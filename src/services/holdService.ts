import { createClient } from "@/lib/supabase/server";
import { BookingHold } from "@/types";

export const holdService = {
    /**
     * Create a new booking hold with a 1-minute heartbeat TTL.
     * Returns the hold ID and expiry, or an error message.
     */
    createHold: async (
        roomId: string,
        checkIn: string,
        checkOut: string,
        sessionId: string
    ): Promise<{ success: boolean; holdId?: string; expiresAt?: string; error?: string }> => {
        const supabase = await createClient();

        // SHORT TTL for Heartbeat Pattern (1 minute)
        const durationMs = 60 * 1000;
        const expiresAt = new Date(Date.now() + durationMs);

        const checkInDate = checkIn.split('T')[0];
        const checkOutDate = checkOut.split('T')[0];

        // 1. Check for CONFIRMED bookings
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

        // 2. Clean up any expired holds for this room first (reduces TOCTOU window)
        await supabase
            .from('booking_holds')
            .delete()
            .eq('room_id', roomId)
            .lt('expires_at', new Date().toISOString());

        // 3. Check for OTHER active holds (Excluding my session)
        const { data: overlappingHolds, error: holdError } = await supabase
            .from('booking_holds')
            .select('id')
            .eq('room_id', roomId)
            .gt('expires_at', new Date().toISOString())
            .lt('check_in', checkOutDate)
            .gt('check_out', checkInDate)
            .neq('session_id', sessionId)
            .maybeSingle();

        if (holdError) {
            console.error('Error checking holds:', holdError);
            return { success: false, error: 'System error checking holds' };
        }

        if (overlappingHolds) {
            return { success: false, error: 'Room is currently held by someone else' };
        }

        // 4. Insert hold — if a duplicate sneaks through (TOCTOU), the DB constraint
        // or a subsequent check will catch it via contention detection.
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

        // 5. Post-insert contention check: If another hold was created in parallel,
        // mark both as contention so the UI can inform both users.
        const { data: parallelHolds } = await supabase
            .from('booking_holds')
            .select('id')
            .eq('room_id', roomId)
            .gt('expires_at', new Date().toISOString())
            .lt('check_in', checkOutDate)
            .gt('check_out', checkInDate)
            .neq('id', data.id);

        if (parallelHolds && parallelHolds.length > 0) {
            const allIds = [data.id, ...parallelHolds.map((h: { id: string }) => h.id)];
            await supabase
                .from('booking_holds')
                .update({ has_contention: true })
                .in('id', allIds);
        }

        return {
            success: true,
            holdId: data.id,
            expiresAt: expiresAt.toISOString()
        };
    },

    /**
     * Release (delete) a booking hold.
     */
    releaseHold: async (holdId: string): Promise<boolean> => {
        const supabase = await createClient();
        const { error } = await supabase
            .from('booking_holds')
            .delete()
            .eq('id', holdId);

        if (error) {
            console.error('Failed to release hold:', error);
        }
        return !error;
    },

    /**
     * Extend a hold's expiry by 1 minute (heartbeat).
     */
    extendHold: async (holdId: string): Promise<{ success: boolean }> => {
        const supabase = await createClient();
        const newExpiry = new Date(Date.now() + 60 * 1000).toISOString();

        const { error } = await supabase
            .from('booking_holds')
            .update({ expires_at: newExpiry })
            .eq('id', holdId);

        if (error) {
            console.error('Failed to extend hold:', error);
            return { success: false };
        }
        return { success: true };
    },

    /**
     * Mark a hold as having contention (another user is looking at the same dates).
     */
    pingHold: async (holdId: string): Promise<void> => {
        const supabase = await createClient();
        await supabase
            .from('booking_holds')
            .update({ has_contention: true })
            .eq('id', holdId);
    },

    /**
     * Get a single active hold overlapping a date range for a room.
     */
    getActiveHold: async (
        roomId: string,
        checkIn: string,
        checkOut: string,
        excludeSessionId?: string
    ): Promise<BookingHold | null> => {
        const supabase = await createClient();

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
    },

    /**
     * Get all active holds for a room (for populating the calendar UI).
     */
    getRoomHolds: async (roomId: string): Promise<BookingHold[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('booking_holds')
            .select('*')
            .eq('room_id', roomId)
            .gt('expires_at', new Date().toISOString());

        if (error) {
            console.error('Error fetching room holds:', error);
            return [];
        }

        return data.map((record) => ({
            id: record.id as string,
            roomId: record.room_id as string,
            checkIn: record.check_in as string,
            checkOut: record.check_out as string,
            sessionId: record.session_id as string,
            expiresAt: record.expires_at as string,
            hasContention: record.has_contention as boolean,
            createdAt: record.created_at as string
        }));
    },

    /**
     * Check if a specific date range has a confirmed booking.
     */
    checkBookingStatus: async (
        roomId: string,
        checkIn: string,
        checkOut: string
    ): Promise<{ isBooked: boolean }> => {
        const supabase = await createClient();

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
    },

    /**
     * Signal that UserB has backed off from contending for this hold's dates.
     * Sets contention_cleared=true, which UserA receives via realtime subscription.
     */
    clearContention: async (holdId: string): Promise<boolean> => {
        const supabase = await createClient();
        const { error } = await supabase
            .from('booking_holds')
            .update({ contention_cleared: true })
            .eq('id', holdId);

        if (error) {
            console.error('Failed to clear contention:', error);
            return false;
        }
        return true;
    }
};

