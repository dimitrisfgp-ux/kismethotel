"use server";

import { revalidatePath } from "next/cache";
import { bookingService } from "@/services/bookingService";
import { roomService } from "@/services/roomService";
import { sendEmail, getAdminEmail } from "@/services/emailService";
import { bookingConfirmationEmail, newBookingAlertEmail } from "@/services/emailTemplates";
import { Booking, BlockedDate, BookingHold } from "@/types";
import { requirePermission } from "@/lib/auth/guards";
import { createServerClient } from "@/lib/supabase";

// --- Blocked Dates ---

export async function addBlockedDateAction(block: BlockedDate) {
    await requirePermission('rooms.availability');
    const success = await bookingService.addBlockedDate(block);
    if (success) {
        revalidatePath("/admin/bookings");
        // Revalidate public room pages so the calendar updates immediately
        revalidatePath(`/rooms`);
    }
    return success;
}

export async function removeBlockedDateAction(blockId: string) {
    await requirePermission('rooms.availability');
    const success = await bookingService.removeBlockedDate(blockId);
    if (success) {
        revalidatePath("/admin/bookings");
        revalidatePath(`/rooms`);
    }
    return success;
}

export async function cancelBookingAction(bookingId: string) {
    const success = await bookingService.cancelBooking(bookingId);
    if (success) {
        revalidatePath("/admin/bookings");
        revalidatePath(`/rooms`); // Update availability
    }
    return success;
}

export async function getRoomAvailabilityAction(roomId: string) {
    // Returns all unavailable dates for a room (booked + blocked)
    const bookings = await bookingService.getBookings(roomId);
    const blockedDates = await bookingService.getBlockedDates(roomId);

    // Convert to date ranges that the calendar can use
    const unavailableDates: { from: string; to: string; type: 'booked' | 'blocked' }[] = [];

    // Add confirmed bookings
    bookings
        .filter(b => b.status === 'confirmed')
        .forEach(booking => {
            unavailableDates.push({
                from: booking.checkIn,
                to: booking.checkOut,
                type: 'booked'
            });
        });

    // Add blocked dates
    blockedDates.forEach(block => {
        unavailableDates.push({
            from: block.from,
            to: block.to,
            type: 'blocked'
        });
    });

    return unavailableDates;
}

// --- Booking Creation ---

export async function createBookingAction(booking: Booking) {
    // In a real app, validation would happen here or in service
    const success = await bookingService.createBooking(booking);
    if (success) {
        // Get room details for email
        const rooms = await roomService.getRooms();
        const room = rooms.find(r => r.id === booking.roomId);

        // Email #1: Send confirmation to guest
        const guestEmail = bookingConfirmationEmail(booking, room);
        await sendEmail({
            to: booking.guestEmail,
            subject: guestEmail.subject,
            html: guestEmail.html
        });

        // Email #2: Send alert to admin
        const adminEmail = newBookingAlertEmail(booking, room);
        await sendEmail({
            to: getAdminEmail(),
            subject: adminEmail.subject,
            html: adminEmail.html
        });

        revalidatePath("/admin/bookings");
        revalidatePath(`/rooms`);
    }
    return success;
}

export async function getAvailabilityAction() {
    const [bookings, blockedDates] = await Promise.all([
        bookingService.getBookings(),
        bookingService.getBlockedDates()
    ]);
    return { bookings, blockedDates };
}

export async function getBookingByIdAction(bookingId: string) {
    return bookingService.getBookingById(bookingId);
}

export async function updateBookingDatesAction(bookingId: string, checkIn: string, checkOut: string) {
    const success = await bookingService.updateBookingDates(bookingId, checkIn, checkOut);
    if (success) {
        revalidatePath("/admin/bookings");
        revalidatePath("/rooms");
    }
    return success;
}

// --- Booking Holds (Heartbeat System) ---

export async function createHoldAction(
    roomId: string,
    checkIn: string,
    checkOut: string,
    sessionId: string
): Promise<{ success: boolean; holdId?: string; expiresAt?: string; error?: string }> {
    const supabase = createServerClient();

    // SHORT TTL for Heartbeat Pattern (1 minute)
    // If client is present, they will ping every 30s to extend this.
    const durationMs = 60 * 1000;
    const expiresAt = new Date(Date.now() + durationMs);

    const checkInDate = checkIn.split('T')[0];
    const checkOutDate = checkOut.split('T')[0];

    // 1. Check for CONFIRMED bookings (Manual check to avoid RPC rigidness)
    const { data: existingBookings, error: bookingError } = await supabase
        .from('bookings')
        .select('id')
        .eq('room_id', roomId)
        .eq('status', 'confirmed')
        .lt('check_in', checkOutDate)
        .gt('check_out', checkInDate)
        .maybeSingle();

    if (bookingError) {
        console.error('Error checking bookings:', bookingError);
        return { success: false, error: 'System error checking availability' };
    }

    if (existingBookings) {
        return { success: false, error: 'Room is already booked for these dates' };
    }

    // 2. Check for OTHER active holds (Excluding my session)
    const { data: overlappingHolds, error: holdError } = await supabase
        .from('booking_holds')
        .select('id')
        .eq('room_id', roomId)
        .gt('expires_at', new Date().toISOString()) // Only active holds
        .lt('check_in', checkOutDate)
        .gt('check_out', checkInDate)
        .neq('session_id', sessionId) // <--- CRITICAL: Exclude myself
        .maybeSingle();

    if (holdError) {
        console.error('Error checking holds:', holdError);
        return { success: false, error: 'System error checking holds' };
    }

    if (overlappingHolds) {
        return { success: false, error: 'Room is currently held by someone else' };
    }

    // 3. Create (or Update?) Hold
    // A fresh create is safer to ensure we have a valid ID for this flow.
    const { data, error } = await supabase
        .from('booking_holds')
        .insert({
            room_id: roomId,
            check_in: checkInDate,
            check_out: checkOutDate,
            session_id: sessionId,
            expires_at: expiresAt.toISOString(),
            has_contention: false
        })
        .select('id')
        .single();

    if (error) {
        console.error('Failed to create hold:', error);
        return { success: false, error: 'Failed to reserve room. Please try again.' };
    }

    return {
        success: true,
        holdId: data.id,
        expiresAt: expiresAt.toISOString()
    };
}

export async function releaseHoldAction(holdId: string): Promise<boolean> {
    const supabase = createServerClient();
    const { error } = await supabase
        .from('booking_holds')
        .delete()
        .eq('id', holdId);

    if (error) {
        console.error('Failed to release hold:', error);
    }
    return !error;
}

// Named 'extend' to be clear about its purpose (Heartbeat)
export async function extendHoldAction(holdId: string): Promise<void> {
    const supabase = createServerClient();
    // Extend by 1 minute from NOW
    const newExpiry = new Date(Date.now() + 60 * 1000).toISOString();

    await supabase
        .from('booking_holds')
        .update({ expires_at: newExpiry })
        .eq('id', holdId);
}

export async function pingHoldAction(holdId: string): Promise<void> {
    const supabase = createServerClient();
    await supabase
        .from('booking_holds')
        .update({ has_contention: true })
        .eq('id', holdId);
}

export async function getActiveHoldAction(
    roomId: string,
    checkIn: string,
    checkOut: string,
    excludeSessionId?: string
): Promise<BookingHold | null> {
    const supabase = createServerClient();

    let query = supabase
        .from('booking_holds')
        .select('*')
        .eq('room_id', roomId)
        .lt('check_in', checkOut.split('T')[0])
        .gt('check_out', checkIn.split('T')[0])
        .gt('expires_at', new Date().toISOString());

    if (excludeSessionId) {
        query = query.neq('session_id', excludeSessionId);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) return null;

    return {
        id: data.id,
        roomId: data.room_id,
        checkIn: data.check_in,
        checkOut: data.check_out,
        sessionId: data.session_id,
        expiresAt: data.expires_at,
        hasContention: data.has_contention,
        createdAt: data.created_at
    };
}

// Get all active holds for a room (to populate initial state)
export async function getRoomHoldsAction(roomId: string): Promise<BookingHold[]> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('booking_holds')
        .select('*')
        .eq('room_id', roomId)
        .gt('expires_at', new Date().toISOString());

    if (error) {
        console.error('Error fetching room holds:', error);
        return [];
    }

    return data.map(record => ({
        id: record.id,
        roomId: record.room_id,
        checkIn: record.check_in,
        checkOut: record.check_out,
        sessionId: record.session_id,
        expiresAt: record.expires_at,
        hasContention: record.has_contention,
        createdAt: record.created_at
    }));
}

// Check if a specific period was successfully booked (used for notifications)
export async function checkBookingStatusAction(
    roomId: string,
    checkIn: string,
    checkOut: string
): Promise<{ isBooked: boolean }> {
    const supabase = createServerClient();

    // Check for any confirmed booking overlapping the range
    const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('room_id', roomId)
        .eq('status', 'confirmed')
        .lt('check_in', checkOut)
        .gt('check_out', checkIn)
        .maybeSingle();

    if (error) {
        console.error('Error checking booking status:', error);
        return { isBooked: false };
    }

    return { isBooked: !!data };
}
