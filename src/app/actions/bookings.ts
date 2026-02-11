'use server';

import { revalidatePath } from 'next/cache';
import { bookingService } from '@/services/bookingService';
import { BookingStatus, Booking } from '@/types';
import { requirePermission } from '@/lib/auth/guards';
import { createClient } from '@/lib/supabase/server';

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
