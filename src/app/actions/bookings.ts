'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { BookingStatus } from '@/types';

interface CreateBookingData {
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

import { requirePermission } from '@/lib/auth/guards';

/**
 * Manually create a booking
 */
export async function createBookingAction(data: CreateBookingData) {
    const user = await requirePermission('bookings.create');
    const supabase = await createClient();

    // 3. Insert Booking
    const { error } = await supabase
        .from('bookings')
        .insert({
            room_id: data.roomId,
            check_in: data.checkIn,
            check_out: data.checkOut,
            guest_name: data.guestName,
            guest_email: data.guestEmail,
            guest_phone: data.guestPhone,
            guests_count: data.guestsCount,
            total_price: data.totalPrice,
            status: data.status,
            created_by: user.id, // Audit trail
            // notes: data.notes // Assuming we might add a notes column later or store in JSON
        });

    if (error) {
        console.error('Create Booking Error:', error);
        throw new Error(error.message);
    }

    revalidatePath('/admin/bookings');
    return { success: true };
}

/**
 * Delete a booking (Admin Only)
 */
export async function deleteBookingAction(bookingId: string) {
    await requirePermission('bookings.delete');
    const supabase = await createClient();

    // 3. Delete
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
 * Cancel a booking
 */
export async function cancelBookingAction(bookingId: string) {
    await requirePermission('bookings.cancel');
    const supabase = await createClient();

    // 3. Update Status
    const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

    if (error) {
        console.error('Cancel Booking Error:', error);
        throw new Error(error.message);
    }

    revalidatePath('/admin/bookings');
    return { success: true };
}
