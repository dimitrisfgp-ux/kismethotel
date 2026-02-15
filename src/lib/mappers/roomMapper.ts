import { Room } from "@/types";
import { DEFAULT_CHECK_IN_TIME, DEFAULT_CHECK_OUT_TIME } from "@/lib/constants";

export interface RoomMediaJoin {
    display_order: number;
    is_primary: boolean;
    category?: string;
    media_assets: Record<string, unknown>;
}

// Helper to transform Supabase room data to our Room type
export function transformRoom(dbRoom: Record<string, unknown>): Room {
    // Media System
    const media = ((dbRoom.room_media as RoomMediaJoin[]) || [])
        // ... (existing map logic) ...
        .map(rm => ({
            ...(rm.media_assets as any),
            id: rm.media_assets.id as string,
            mediaType: rm.media_assets.media_type as 'image' | 'video',
            mimeType: rm.media_assets.mime_type as string,
            sizeBytes: rm.media_assets.size_bytes as number,
            altText: rm.media_assets.alt_text as string,
            originalFilename: rm.media_assets.original_filename as string,
            storagePath: rm.media_assets.storage_path as string,
            bucket: rm.media_assets.bucket as string,
            folder: rm.media_assets.folder as string,
            width: rm.media_assets.width as number,
            height: rm.media_assets.height as number,
            caption: rm.media_assets.caption as string,
            createdAt: rm.media_assets.created_at as string,
            updatedAt: rm.media_assets.updated_at as string,
            createdBy: rm.media_assets.created_by as string,
            // Junction props
            displayOrder: rm.display_order,
            isPrimary: rm.is_primary,
            category: (rm.category || (rm.is_primary ? 'primary' : (rm.display_order === 1 || rm.display_order === 2 ? 'secondary' : 'gallery'))) as 'primary' | 'secondary' | 'gallery' | 'hero_poster' | 'hero_video' | 'portrait'
        }))
        .sort((a, b) => (a.displayOrder as number) - (b.displayOrder as number));

    return {
        id: dbRoom.id as string,
        slug: dbRoom.slug as string,
        name: dbRoom.name as string,
        checkInTime: (dbRoom.check_in_time as string)?.slice(0, 5) || DEFAULT_CHECK_IN_TIME,
        checkOutTime: (dbRoom.check_out_time as string)?.slice(0, 5) || DEFAULT_CHECK_OUT_TIME,
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
