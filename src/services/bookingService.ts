import { createClient } from "@/lib/supabase/server";
import { Booking, BlockedDate } from "@/types";
import { formatLocalDate } from "@/lib/dateUtils";

export const bookingService = {
    // --- Availability & Bookings ---

    getBookings: async (roomId?: string): Promise<Booking[]> => {
        const supabase = await createClient();
        let query = supabase
            .from('bookings')
            .select('*')
            .order('check_in', { ascending: false });

        if (roomId) {
            query = query.eq('room_id', roomId);
        }

        const { data, error } = await query;
        if (error) return [];

        return (data || []).map(b => ({
            id: b.id,
            roomId: b.room_id,
            checkIn: b.check_in,
            checkOut: b.check_out,
            guestName: b.guest_name,
            guestEmail: b.guest_email,
            guestPhone: b.guest_phone,
            guestsCount: b.guests_count,
            totalPrice: b.total_price,
            status: b.status,
            createdAt: b.created_at
        }));
    },

    getBookingById: async (bookingId: string): Promise<Booking | undefined> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (error || !data) return undefined;

        return {
            id: data.id,
            roomId: data.room_id,
            checkIn: data.check_in,
            checkOut: data.check_out,
            guestName: data.guest_name,
            guestEmail: data.guest_email,
            guestPhone: data.guest_phone,
            guestsCount: data.guests_count,
            totalPrice: data.total_price,
            status: data.status,
            createdAt: data.created_at
        };
    },

    getBlockedDates: async (roomId?: string): Promise<BlockedDate[]> => {
        const supabase = await createClient();
        let query = supabase
            .from('blocked_dates')
            .select('*')
            .order('from_date', { ascending: true });

        if (roomId) {
            query = query.eq('room_id', roomId);
        }

        const { data, error } = await query;
        if (error) return [];

        return (data || []).map(b => ({
            id: b.id,
            roomId: b.room_id,
            from: b.from_date,
            to: b.to_date,
            reason: b.reason,
            note: b.note
        }));
    },

    addBlockedDate: async (block: BlockedDate): Promise<boolean> => {
        const supabase = await createClient();
        const { error } = await supabase
            .from('blocked_dates')
            .insert({
                id: block.id,
                room_id: block.roomId,
                from_date: block.from,
                to_date: block.to,
                reason: block.reason,
                note: block.note
            });

        return !error;
    },

    removeBlockedDate: async (blockId: string): Promise<boolean> => {
        const supabase = await createClient();
        const { error } = await supabase
            .from('blocked_dates')
            .delete()
            .eq('id', blockId);

        return !error;
    },

    checkAvailability: async (roomId: string, start: Date, end: Date): Promise<boolean> => {
        const supabase = await createClient();
        const startStr = formatLocalDate(start);
        const endStr = formatLocalDate(end);

        // Use the database function we created
        const { data, error } = await supabase
            .rpc('check_room_availability', {
                p_room_id: roomId,
                p_start: startStr,
                p_end: endStr
            });

        if (error) {
            console.error('Availability check error:', error);
            return false;
        }

        return data === true;
    },

    createBooking: async (booking: Booking): Promise<boolean> => {
        const supabase = await createClient();
        const { error } = await supabase
            .from('bookings')
            .insert({
                id: booking.id,
                room_id: booking.roomId,
                check_in: booking.checkIn,
                check_out: booking.checkOut,
                guest_name: booking.guestName,
                guest_email: booking.guestEmail,
                guest_phone: booking.guestPhone,
                guests_count: booking.guestsCount,
                total_price: booking.totalPrice,
                status: 'confirmed'
            });

        return !error;
    },

    cancelBooking: async (bookingId: string): Promise<boolean> => {
        const supabase = await createClient();
        const { error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId);

        return !error;
    },

    updateBookingDates: async (bookingId: string, checkIn: string, checkOut: string): Promise<boolean> => {
        const supabase = await createClient();
        const { error } = await supabase
            .from('bookings')
            .update({ check_in: checkIn, check_out: checkOut })
            .eq('id', bookingId);

        return !error;
    }
};
