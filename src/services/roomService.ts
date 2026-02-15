import { createClient, createPublicClient } from "@/lib/supabase/server";
import { Room } from "@/types";
import { unstable_cache } from "next/cache";

import { transformRoom } from "@/lib/mappers/roomMapper";

// ROOM_SELECT_QUERY remains here as it defines WHAT we fetch, enabling the mapper to work.

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

// Cached Fetchers
const getCachedRooms = unstable_cache(
    async (): Promise<Room[]> => {
        const supabase = createPublicClient();
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
    ['rooms-list'],
    { tags: ['rooms'] }
);

const getCachedRoomsSummary = unstable_cache(
    async (): Promise<{ id: string; name: string; slug: string; pricePerNight: number; maxOccupancy: number; sizeSqm: number; floor: number; checkInTime?: string; checkOutTime?: string; imageUrl?: string }[]> => {
        const supabase = createPublicClient();
        const { data, error } = await supabase
            .from('rooms')
            .select(`
                id, name, slug, price_per_night, max_occupancy, size_sqm, floor, check_in_time, check_out_time,
                room_media (
                    is_primary,
                    display_order,
                    media_assets (url)
                )
            `)
            .order('name');

        if (error) return [];
        return (data || []).map(r => {
            // Find primary image or first available
            const media = (r.room_media as any[]) || [];
            const primary = media.find(m => m.is_primary) || media.sort((a, b) => a.display_order - b.display_order)[0];
            const imageUrl = primary?.media_assets?.url;

            return {
                id: r.id,
                name: r.name,
                slug: r.slug,
                pricePerNight: r.price_per_night,
                maxOccupancy: r.max_occupancy,
                sizeSqm: r.size_sqm,
                floor: r.floor,
                checkInTime: r.check_in_time?.slice(0, 5),
                checkOutTime: r.check_out_time?.slice(0, 5),
                imageUrl
            };
        });
    },
    ['rooms-summary'],
    { tags: ['rooms'] }
);

export const roomService = {
    getRooms: async (): Promise<Room[]> => {
        return getCachedRooms();
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
    getRoomsSummary: async (): Promise<{ id: string; name: string; slug: string; pricePerNight: number; maxOccupancy: number; sizeSqm: number; floor: number; checkInTime?: string; checkOutTime?: string; imageUrl?: string }[]> => {
        return getCachedRoomsSummary();
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
                highlights: room.highlights,
                check_in_time: room.checkInTime,
                check_out_time: room.checkOutTime
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

        const { error, count } = await supabase
            .from('rooms')
            .update({
                name: room.name,
                slug: room.slug,
                description: room.description,
                size_sqm: room.sizeSqm,
                floor: room.floor,
                max_occupancy: room.maxOccupancy,
                price_per_night: room.pricePerNight,
                highlights: room.highlights,
                check_in_time: room.checkInTime,
                check_out_time: room.checkOutTime
            }, { count: 'exact' })
            .eq('id', room.id);

        if (error) {
            console.error("Error saving room:", error);
            return false;
        }

        if (count === 0) {
            console.error("Room save failed: No rows updated (check RLS policies or ID)");
            return false;
        }

        console.log("Room updated successfully. Rows modified:", count);

        // Sync Media: Smart Diff (Non-Destructive)
        // 1. Fetch existing media links to determine what to remove
        const { data: existingMedia } = await supabase
            .from('room_media')
            .select('media_id')
            .eq('room_id', room.id);

        const existingIds = (existingMedia || []).map(m => m.media_id);
        const incomingIds = (room.media || []).map(m => m.id);

        // 2. Determine Removals: IDs in DB but NOT in new payload
        const toRemove = existingIds.filter(id => !incomingIds.includes(id));

        if (toRemove.length > 0) {
            console.log(`RoomService: Removing ${toRemove.length} media links from room ${room.id}`);
            const { error: deleteError } = await supabase
                .from('room_media')
                .delete()
                .eq('room_id', room.id)
                .in('media_id', toRemove);

            if (deleteError) {
                console.error("Error removing detached media:", deleteError);
                // We typically continue here to try and save the new state anyway
            }
        }

        // 3. Upsert New/Updated Media
        if (room.media?.length) {
            const mediaUpserts = room.media.map((m, index) => ({
                room_id: room.id,
                media_id: m.id,
                display_order: index,
                is_primary: m.category === 'primary',
                category: m.category
            }));

            const { error: mediaError } = await supabase
                .from('room_media')
                .upsert(mediaUpserts, { onConflict: 'room_id, media_id' }); // Ensure we update if exists

            if (mediaError) {
                console.error("Error upserting media links:", mediaError);
                return false;
            }
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

    bulkUpdateRooms: async (roomIds: string[], updates: Partial<Room>): Promise<boolean> => {
        const supabase = await createClient();

        // Map camelCase to snake_case for DB
        const dbUpdates: any = {};
        if (updates.pricePerNight !== undefined) dbUpdates.price_per_night = updates.pricePerNight;
        if (updates.maxOccupancy !== undefined) dbUpdates.max_occupancy = updates.maxOccupancy;
        if (updates.sizeSqm !== undefined) dbUpdates.size_sqm = updates.sizeSqm;
        if (updates.floor !== undefined) dbUpdates.floor = updates.floor;
        if (updates.checkInTime !== undefined) dbUpdates.check_in_time = updates.checkInTime;
        if (updates.checkOutTime !== undefined) dbUpdates.check_out_time = updates.checkOutTime;
        if (updates.highlights !== undefined) dbUpdates.highlights = updates.highlights;

        if (Object.keys(dbUpdates).length === 0) return true;

        const { error } = await supabase
            .from('rooms')
            .update(dbUpdates)
            .in('id', roomIds);

        return !error;
    }
};
