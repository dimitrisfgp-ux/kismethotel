"use server";

import { revalidatePath } from "next/cache";
import { bookingService } from "@/services/bookingService";
import { roomService } from "@/services/roomService";
import { holdService } from "@/services/holdService";
import { sendEmail, getAdminEmail } from "@/services/emailService";
import { bookingConfirmationEmail, newBookingAlertEmail } from "@/services/emailTemplates";
import { Booking, BlockedDate, BookingHold, BookingStatus } from "@/types";
import { requirePermission } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

// --- Blocked Dates ---

export async function addBlockedDateAction(block: BlockedDate) {
    await requirePermission('rooms.availability');
    const success = await bookingService.addBlockedDate(block);
    if (success) {
        revalidatePath("/admin/bookings");
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
    await requirePermission('bookings.manage');
    const success = await bookingService.cancelBooking(bookingId);
    if (success) {
        revalidatePath("/admin/bookings");
        revalidatePath(`/rooms`);
    }
    return success;
}

export async function getRoomByIdAction(roomId: string) {
    return (await roomService.getRoomById(roomId)) ?? null;
}

export async function getRoomAvailabilityAction(roomId: string) {
    // Fetch bookings for specific room, increased limit for availability check
    const bookingsResponse = await bookingService.getBookings(1, 1000, { roomId });
    const bookings = bookingsResponse.data;
    const blockedDates = await bookingService.getBlockedDates(roomId);

    const unavailableDates: { from: string; to: string; type: 'booked' | 'blocked' }[] = [];

    bookings
        .filter(b => b.status === 'confirmed')
        .forEach(booking => {
            unavailableDates.push({
                from: booking.checkIn,
                to: booking.checkOut,
                type: 'booked'
            });
        });

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

export async function createBookingAction(booking: Booking, holdId?: string) {
    const supabase = await createClient();

    // Final availability check before inserting (guard against race)
    const { data: conflict } = await supabase
        .from('bookings')
        .select('id')
        .eq('room_id', booking.roomId)
        .eq('status', 'confirmed')
        .lt('check_in', booking.checkOut)
        .gt('check_out', booking.checkIn)
        .maybeSingle();

    if (conflict) {
        return false; // Room was booked by someone else
    }

    const success = await bookingService.createBooking(booking);
    if (success) {
        // Release hold server-side
        if (holdId) {
            await holdService.releaseHold(holdId);
        }

        // Get room name for email (lightweight query instead of fetching all rooms)
        const room = await roomService.getRoomById(booking.roomId);

        // Send confirmation + admin alert emails in parallel
        const guestEmail = bookingConfirmationEmail(booking, room);
        const adminAlertEmail = newBookingAlertEmail(booking, room);

        await Promise.allSettled([
            sendEmail({
                to: booking.guestEmail,
                subject: guestEmail.subject,
                html: guestEmail.html
            }),
            sendEmail({
                to: getAdminEmail(),
                subject: adminAlertEmail.subject,
                html: adminAlertEmail.html
            })
        ]);

        revalidatePath("/admin/bookings");
        revalidatePath(`/rooms`);
    }
    return success;
}

export async function getAvailabilityAction() {
    const [bookingsResponse, blockedDates] = await Promise.all([
        bookingService.getBookings(1, 1000), // Fetch up to 1000 for availability check
        bookingService.getBlockedDates()
    ]);
    return { bookings: bookingsResponse.data, blockedDates };
}

export async function getBookingByIdAction(bookingId: string) {
    return bookingService.getBookingById(bookingId);
}

export async function updateBookingDatesAction(bookingId: string, checkIn: string, checkOut: string) {
    await requirePermission('bookings.manage');
    const success = await bookingService.updateBookingDates(bookingId, checkIn, checkOut);
    if (success) {
        revalidatePath("/admin/bookings");
        revalidatePath("/rooms");
    }
    return success;
}

// --- Booking Holds (Heartbeat System) ---
// Thin wrappers delegating to holdService

export async function createHoldAction(
    roomId: string,
    checkIn: string,
    checkOut: string,
    sessionId: string
): Promise<{ success: boolean; holdId?: string; expiresAt?: string; error?: string }> {
    return holdService.createHold(roomId, checkIn, checkOut, sessionId);
}

export async function releaseHoldAction(holdId: string): Promise<boolean> {
    return holdService.releaseHold(holdId);
}

export async function extendHoldAction(holdId: string): Promise<{
    success: boolean;
    expired?: boolean;
    hasContention?: boolean;
    contentionDeadline?: string | null;
}> {
    return holdService.extendHold(holdId);
}

export async function pingHoldAction(holdId: string): Promise<void> {
    return holdService.pingHold(holdId);
}

export async function getRoomHoldsAction(roomId: string): Promise<BookingHold[]> {
    return holdService.getRoomHolds(roomId);
}

export async function checkBookingStatusAction(
    roomId: string,
    checkIn: string,
    checkOut: string
): Promise<{ isBooked: boolean }> {
    return holdService.checkBookingStatus(roomId, checkIn, checkOut);
}

export async function clearContentionAction(holdId: string): Promise<boolean> {
    return holdService.clearContention(holdId);
}

// --- Admin Actions ---

interface AdminCreateBookingData {
    roomId: string;
    checkIn: string;
    checkOut: string;
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    guestsCount: number;
    totalPrice: number;
    status: BookingStatus;
    notes?: string;
}

/**
 * Manually create a booking (Admin)
 * Includes availability conflict check to prevent double-booking.
 */
export async function adminCreateBookingAction(data: AdminCreateBookingData) {
    const user = await requirePermission('bookings.create');

    // Availability conflict check (same as createBookingAction)
    const isAvailable = await bookingService.checkAvailability(
        data.roomId,
        new Date(data.checkIn),
        new Date(data.checkOut)
    );

    if (!isAvailable) {
        throw new Error('Room is not available for the selected dates.');
    }

    const booking: Booking = {
        id: crypto.randomUUID(),
        roomId: data.roomId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        guestsCount: data.guestsCount,
        totalPrice: data.totalPrice,
        status: data.status,
        createdAt: new Date().toISOString(),
    };

    const success = await bookingService.createBooking(booking);

    if (!success) {
        throw new Error('Failed to create booking.');
    }

    revalidatePath('/admin/bookings');
    return { success: true };
}

/**
 * Delete a booking (Admin Only)
 */
export async function adminDeleteBookingAction(bookingId: string) {
    await requirePermission('bookings.delete');
    const supabase = await createClient();

    // bookingService doesn't have a deleteBooking method,
    // so we use direct query (delete is admin-only, not cancel)
    const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

    if (error) {
        console.error('Delete Booking Error:', error);
        throw new Error(error.message);
    }

    revalidatePath('/admin/bookings');
    return { success: true };
}

/**
 * Cancel a booking (Admin)
 * Delegates to bookingService.cancelBooking for consistency.
 */
export async function adminCancelBookingAction(bookingId: string) {
    await requirePermission('bookings.cancel');
    const success = await bookingService.cancelBooking(bookingId);

    if (!success) {
        throw new Error('Failed to cancel booking.');
    }

    revalidatePath('/admin/bookings');
    return { success: true };
}
