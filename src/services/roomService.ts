import { createClient } from "@/lib/supabase/server";
import { Room } from "@/types";

interface RoomMediaJoin {
    display_order: number;
    is_primary: boolean;
    category?: string;
    media_assets: Record<string, unknown>;
}

// Helper to transform Supabase room data to our Room type
function transformRoom(dbRoom: Record<string, unknown>): Room {
    // Map new Media System
    const media = ((dbRoom.room_media as RoomMediaJoin[]) || [])
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
        .sort((a, b) => (a.displayOrder as number) - (b.displayOrder as number));

    return {
        id: dbRoom.id as string,
        slug: dbRoom.slug as string,
        name: dbRoom.name as string,
        description: dbRoom.description as string || '',
        sizeSqm: dbRoom.size_sqm as number,
        floor: dbRoom.floor as number,
        maxOccupancy: dbRoom.max_occupancy as number,
        pricePerNight: dbRoom.price_per_night as number,
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

const ROOM_SELECT_QUERY = `
    *,
    room_beds (type, count),
    room_layout_sections (
        type, title, details, sort_order,
        room_layout_amenities (
            amenities (id, name, icon_name)
        )
    ),
    room_media (
        display_order, is_primary, category,
        media_assets (*)
    )
`;

export const roomService = {
    getRooms: async (): Promise<Room[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('rooms')
            .select(ROOM_SELECT_QUERY)
            .order('price_per_night', { ascending: true });

        if (error) {
            console.error('Error fetching rooms:', error);
            return [];
        }

        return (data || []).map(transformRoom);
    },

    getRoomById: async (roomId: string): Promise<Room | undefined> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('rooms')
            .select(ROOM_SELECT_QUERY)
            .eq('id', roomId)
            .single();

        if (error || !data) return undefined;
        return transformRoom(data);
    },

    /**
     * Lightweight query returning only basic room info (for admin lists, dropdowns, emails).
     */
    getRoomsSummary: async (): Promise<{ id: string; name: string; slug: string; pricePerNight: number; maxOccupancy: number }[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('rooms')
            .select('id, name, slug, price_per_night, max_occupancy')
            .order('name');

        if (error) return [];
        return (data || []).map(r => ({
            id: r.id,
            name: r.name,
            slug: r.slug,
            pricePerNight: r.price_per_night,
            maxOccupancy: r.max_occupancy
        }));
    },

    getRoomBySlug: async (slug: string): Promise<Room | undefined> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('rooms')
            .select(ROOM_SELECT_QUERY)
            .eq('slug', slug)
            .single();

        if (error || !data) return undefined;
        return transformRoom(data);
    },

    getFeaturedRooms: async (): Promise<Room[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('rooms')
            .select(ROOM_SELECT_QUERY)
            .order('price_per_night', { ascending: false })
            .limit(4);

        if (error) return [];
        return (data || []).map(transformRoom);
    },

    // --- Room CRUD Operations ---

    createRoom: async (room: Room): Promise<boolean> => {
        const supabase = await createClient();

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
                highlights: room.highlights
            })
            .select()
            .single();

        if (roomError || !newRoom) return false;

        // Insert beds
        if (room.beds?.length) {
            const { error: bedsError } = await supabase.from('room_beds').insert(
                room.beds.map(b => ({
                    room_id: room.id,
                    type: b.type,
                    count: b.count
                }))
            );
            if (bedsError) {
                console.error('Error inserting beds:', bedsError);
                return false;
            }
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

            if (mediaError) {
                console.error('Error linking media:', mediaError);
                return false;
            }
        }

        return true;
    },

    saveRoom: async (room: Room): Promise<boolean> => {
        const supabase = await createClient();

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
                highlights: room.highlights
            })
            .eq('id', room.id);

        if (error) return false;

        // Sync Media: Delete existing and re-insert
        await supabase.from('room_media').delete().eq('room_id', room.id);

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

    deleteRoom: async (roomId: string): Promise<boolean> => {
        const supabase = await createClient();
        const { error } = await supabase
            .from('rooms')
            .delete()
            .eq('id', roomId);

        return !error;
    },
};
