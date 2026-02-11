import { createServerClient } from "@/lib/supabase";
import { Room, BlockedDate, Booking } from "@/types";

// Helper to transform Supabase room data to our Room type
function transformRoom(dbRoom: Record<string, unknown>): Room {
    // Map new Media System
    const media = ((dbRoom.room_media as Array<any>) || [])
        .map(rm => ({
            ...rm.media_assets,
            id: rm.media_assets.id,
            mediaType: rm.media_assets.media_type,
            mimeType: rm.media_assets.mime_type,
            sizeBytes: rm.media_assets.size_bytes,
            altText: rm.media_assets.alt_text,
            originalFilename: rm.media_assets.original_filename,
            storagePath: rm.media_assets.storage_path,
            bucket: rm.media_assets.bucket,
            folder: rm.media_assets.folder,
            width: rm.media_assets.width,
            height: rm.media_assets.height,
            caption: rm.media_assets.caption,
            createdAt: rm.media_assets.created_at,
            updatedAt: rm.media_assets.updated_at,
            createdBy: rm.media_assets.created_by,
            // Junction props
            displayOrder: rm.display_order,
            isPrimary: rm.is_primary,
            category: rm.category || (rm.is_primary ? 'primary' : (rm.display_order === 1 || rm.display_order === 2 ? 'secondary' : 'gallery'))
        }))
        .sort((a, b) => a.displayOrder - b.displayOrder);

    return {
        id: dbRoom.id as string,
        slug: dbRoom.slug as string,
        name: dbRoom.name as string,
        description: dbRoom.description as string || '',
        sizeSqm: dbRoom.size_sqm as number,
        floor: dbRoom.floor as number,
        maxOccupancy: dbRoom.max_occupancy as number,
        pricePerNight: dbRoom.price_per_night as number,
        // images: legacyImages.length > 0 ? legacyImages : ((dbRoom.images as string[]) || []), // Removed Legacy
        highlights: (dbRoom.highlights as string[]) || [],
        beds: ((dbRoom.room_beds as Array<{ type: string; count: number }>) || []).map(b => ({
            type: b.type as 'single' | 'double',
            count: b.count
        })),
        layout: ((dbRoom.room_layout_sections as Array<Record<string, unknown>>) || []).map(section => ({
            type: section.type as string,
            title: section.title as string,
            details: (section.details as string[]) || [],
            amenities: ((section.room_layout_amenities as Array<{ amenities: { id: number; name: string; icon_name: string } }>) || [])
                .map(a => ({
                    id: a.amenities.id,
                    name: a.amenities.name,
                    iconName: a.amenities.icon_name
                }))
        })),
        media: media
    };
}

export const roomService = {
    getRooms: async (): Promise<Room[]> => {
        const supabase = createServerClient();
        const { data, error } = await supabase
            .from('rooms')
            .select(`
            *,
            room_beds (type, count),
            room_layout_sections (
                type, title, details, sort_order,
                room_layout_amenities (
                    amenities (id, name, icon_name)
                )
            ),
            room_media (
                display_order, is_primary,
                media_assets (*)
            )
        `)
            .order('price_per_night', { ascending: true });

        if (error) {
            console.error('Error fetching rooms:', error);
            return [];
        }

        return (data || []).map(transformRoom);
    },

    getRoomBySlug: async (slug: string): Promise<Room | undefined> => {
        const supabase = createServerClient();
        const { data, error } = await supabase
            .from('rooms')
            .select(`
            *,
            room_beds (type, count),
            room_layout_sections (
                type, title, details, sort_order,
                room_layout_amenities (
                    amenities (id, name, icon_name)
                )
            ),
            room_media (
                display_order, is_primary,
                media_assets (*)
            )
        `)
            .eq('slug', slug)
            .single();

        if (error || !data) return undefined;
        return transformRoom(data);
    },

    getFeaturedRooms: async (): Promise<Room[]> => {
        const supabase = createServerClient();
        const { data, error } = await supabase
            .from('rooms')
            .select(`
            *,
            room_beds (type, count),
            room_layout_sections (
                type, title, details, sort_order,
                room_layout_amenities (
                    amenities (id, name, icon_name)
                )
            ),
            room_media (
                display_order, is_primary,
                media_assets (*)
            )
        `)
            .order('price_per_night', { ascending: false })
            .limit(4);

        if (error) return [];
        return (data || []).map(transformRoom);
    },

    // --- Availability & Bookings ---

    getBookings: async (roomId?: string): Promise<Booking[]> => {
        const supabase = createServerClient();
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

    getBlockedDates: async (roomId?: string): Promise<BlockedDate[]> => {
        const supabase = createServerClient();
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
        const supabase = createServerClient();
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
        const supabase = createServerClient();
        const { error } = await supabase
            .from('blocked_dates')
            .delete()
            .eq('id', blockId);

        return !error;
    },

    checkAvailability: async (roomId: string, start: Date, end: Date): Promise<boolean> => {
        const supabase = createServerClient();
        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];

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
        const supabase = createServerClient();
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
        const supabase = createServerClient();
        const { error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId);

        return !error;
    },

    // --- Room CRUD Operations ---

    createRoom: async (room: Room): Promise<boolean> => {
        const supabase = createServerClient();

        // Insert room
        const { data: newRoom, error: roomError } = await supabase
            .from('rooms')
            .insert({
                id: room.id,
                slug: room.slug,
                name: room.name,
                description: room.description,
                size_sqm: room.sizeSqm,
                floor: room.floor,
                max_occupancy: room.maxOccupancy,
                price_per_night: room.pricePerNight,
                // images: room.images, // Removed
                highlights: room.highlights
            })
            .select()
            .single();

        if (roomError || !newRoom) return false;

        // Insert beds
        if (room.beds?.length) {
            await supabase.from('room_beds').insert(
                room.beds.map(b => ({
                    room_id: room.id,
                    type: b.type,
                    count: b.count
                }))
            );
        }

        // Insert Media Associations
        if (room.media?.length) {
            const mediaInserts = room.media.map((m, index) => ({
                room_id: room.id,
                media_id: m.id,
                display_order: index,
                is_primary: m.category === 'primary',
                category: m.category
            }));

            const { error: mediaError } = await supabase
                .from('room_media')
                .insert(mediaInserts);

            if (mediaError) console.error("Error linking media:", mediaError);
        }

        return true;
    },

    saveRoom: async (room: Room): Promise<boolean> => {
        const supabase = createServerClient();

        const { error } = await supabase
            .from('rooms')
            .update({
                name: room.name,
                slug: room.slug,
                description: room.description,
                size_sqm: room.sizeSqm,
                floor: room.floor,
                max_occupancy: room.maxOccupancy,
                price_per_night: room.pricePerNight,
                // images: room.images, // Removed
                highlights: room.highlights
            })
            .eq('id', room.id);

        if (error) return false;

        // Sync Media: Delete existing and re-insert (simplest strategy to handle order/removals)
        // 1. Delete all existing for this room
        await supabase.from('room_media').delete().eq('room_id', room.id);

        // 2. Insert new list
        if (room.media?.length) {
            const mediaInserts = room.media.map((m, index) => ({
                room_id: room.id,
                media_id: m.id,
                display_order: index,
                is_primary: m.category === 'primary',
                category: m.category
            }));

            const { error: mediaError } = await supabase
                .from('room_media')
                .insert(mediaInserts);

            if (mediaError) console.error("Error linking media:", mediaError);
        }

        return !error;
    },

    deleteRoom: async (roomId: string): Promise<boolean> => {
        const supabase = createServerClient();
        const { error } = await supabase
            .from('rooms')
            .delete()
            .eq('id', roomId);

        return !error;
    },

    // --- Booking Management ---

    getBookingById: async (bookingId: string): Promise<Booking | undefined> => {
        const supabase = createServerClient();
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

    updateBookingDates: async (bookingId: string, checkIn: string, checkOut: string): Promise<boolean> => {
        const supabase = createServerClient();
        const { error } = await supabase
            .from('bookings')
            .update({ check_in: checkIn, check_out: checkOut })
            .eq('id', bookingId);

        return !error;
    }
};
