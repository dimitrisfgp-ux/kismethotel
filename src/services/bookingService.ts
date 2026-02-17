import { createClient } from "@/lib/supabase/server";
import { Booking, BlockedDate, BookingStatus, PaginatedResponse } from "@/types";
import { formatLocalDate } from "@/lib/dateUtils";

export const bookingService = {
    // --- Availability & Bookings ---

    getRoomBookings: async (roomId: string): Promise<Booking[]> => {
        const supabase = await createClient();

        // Fetch future bookings or active ones for calendar blocking
        // We only care about confirmed/active/pending bookings that block dates
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('room_id', roomId)
            .in('status', ['confirmed', 'active', 'pending'])
            .gte('check_out', new Date().toISOString()); // Only future/current bookings

        if (error) {
            console.error('Error fetching room bookings:', error);
            return [];
        }

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
            createdAt: b.created_at,
            preCheckoutEmailSent: b.pre_checkout_email_sent
        }));
    },

    getBookings: async (
        page: number = 1,
        limit: number = 10,
        filters?: { roomId?: string; status?: BookingStatus }
    ): Promise<PaginatedResponse<Booking>> => {
        const supabase = await createClient();
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('bookings')
            .select('*', { count: 'exact' })
            .order('check_in', { ascending: false })
            .range(from, to);

        if (filters?.roomId) {
            query = query.eq('room_id', filters.roomId);
        }

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        const { data, count, error } = await query;

        if (error) {
            console.error('Error fetching bookings:', error);
            return { data: [], total: 0, page, limit };
        }

        const bookings = (data || []).map(b => ({
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
            createdAt: b.created_at,
            preCheckoutEmailSent: b.pre_checkout_email_sent
        }));

        return {
            data: bookings,
            total: count || 0,
            page,
            limit
        };
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
        // Use Admin Client to bypass RLS (Policy is SELECT-only)
        const { createAdminClient } = await import("@/lib/supabase/server");
        const supabase = createAdminClient();
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

        if (error) {
            console.error("[bookingService] Failed to add blocked date:", error);
            return false;
        }

        return true;
    },

    removeBlockedDate: async (blockId: string): Promise<boolean> => {
        // Use Admin Client to bypass RLS (Policy is SELECT-only)
        const { createAdminClient } = await import("@/lib/supabase/server");
        const supabase = createAdminClient();
        const { error } = await supabase
            .from('blocked_dates')
            .delete()
            .eq('id', blockId);

        return !error;
    },

    checkAvailability: async (roomId: string, start: Date | string, end: Date | string): Promise<boolean> => {
        const supabase = await createClient();
        const startStr = typeof start === 'string' ? start : formatLocalDate(start);
        const endStr = typeof end === 'string' ? end : formatLocalDate(end);

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
        let supabase = await createClient();

        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();

        // If Guest (no user), use Admin Client to bypass RLS
        if (!user) {
            console.log("Guest Booking detected: Switching to Admin Client");
            // Dynamic import to avoid circular dependency issues if any (though server.ts is safe)
            const { createAdminClient } = await import("@/lib/supabase/server");
            supabase = createAdminClient();
        }

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
                status: booking.status,
                // created_by will be NULL for guests, or automatically set by RLS for users (if user context)
                // If using Admin Client, we rely on the fact that created_by is nullable.
            });

        if (error) {
            console.error("Booking Creation Error:", error);
            // Log full error details for debugging
            console.error("Error Code:", error.code);
            console.error("Error Message:", error.message);
            console.error("Error Details:", error.details);
            console.error("Error Hint:", error.hint);
            return false;
        }
        return true;
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
    },

    updateBookingStatus: async (bookingId: string, status: BookingStatus): Promise<boolean> => {
        const supabase = await createClient();
        const { error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', bookingId);

        return !error;
    },

    markPreCheckoutEmailSent: async (bookingId: string): Promise<boolean> => {
        const supabase = await createClient();
        const { error } = await supabase
            .from('bookings')
            .update({ pre_checkout_email_sent: true })
            .eq('id', bookingId);

        return !error;
    }
};
