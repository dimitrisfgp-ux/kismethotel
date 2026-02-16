'use server';

import { createClient } from '@/lib/supabase/server';
import { requirePermission } from '@/lib/auth/guards';
import { revalidatePath } from 'next/cache';
import { PageContent } from '@/types';

export interface MediaUsage {
    id: string; // The ID of the entity using the media
    type: 'page' | 'room' | 'attraction' | 'other';
    name: string; // Human readable name (e.g. "Homepage Hero", "Deluxe Suite")
}

/**
 * Scans the database to check if a media asset is currently in use.
 * Returns a list of places where it is used.
 */
export async function checkMediaUsageAction(mediaId: string): Promise<MediaUsage[]> {
    await requirePermission('media.delete'); // Ensure user has permission to even ask
    const supabase = await createClient();
    const usages: MediaUsage[] = [];

    // 1. Check Page Content (JSON Scan)
    const { data: pageContent } = await supabase
        .from('page_content')
        .select('*')
        .eq('id', 1)
        .single();

    if (pageContent) {
        const content = pageContent as any;
        // Helper to check if a URL string contains the media ID
        // Note: We check ID because filenames might be duplicated or changed, but ID in storage path is usually stable key
        // actually looking at the data, the 'url' is the full public URL.
        // We should search for the media ID if we stored it, OR the filename/path.
        // The safest bet for now is checking ID if standard kismet pattern used media_id in path,
        // BUT current system likely stores simple URLs.

        // Strategy: First get the media URL or Storage Path to search for
        const { data: media } = await supabase.from('media_assets').select('url, filename').eq('id', mediaId).single();

        if (media) {
            const searchTerms = [media.url, media.filename].filter(Boolean);

            const isUsed = (text?: string) => {
                if (!text || typeof text !== 'string') return false;
                return searchTerms.some(term => text.includes(term));
            };

            // Hero
            if (isUsed(content.hero?.image)) usages.push({ id: 'home-hero', type: 'page', name: 'Homepage Hero' });
            if (isUsed(content.hero?.poster)) usages.push({ id: 'home-hero-poster', type: 'page', name: 'Homepage Hero Poster' });
            if (isUsed(content.hero?.mobileImage)) usages.push({ id: 'home-hero-mobile', type: 'page', name: 'Homepage Hero (Mobile)' });

            // Videos
            if (isUsed(content.hero?.videos?.desktop)) usages.push({ id: 'home-hero-video-desktop', type: 'page', name: 'Homepage Video (Desktop)' });
            if (isUsed(content.hero?.videos?.mobile)) usages.push({ id: 'home-hero-video-mobile', type: 'page', name: 'Homepage Video (Mobile)' });

            // Locations Section
            if (isUsed(content.locationsSection?.image)) usages.push({ id: 'home-locations', type: 'page', name: 'Locations Section Background' });

            // Sections
            if (isUsed(content.sections?.rooms?.image)) usages.push({ id: 'home-rooms', type: 'page', name: 'Rooms Section Background' });
            if (isUsed(content.sections?.location?.image)) usages.push({ id: 'home-location', type: 'page', name: 'Location Map/Section' });
            if (isUsed(content.sections?.attractions?.image)) usages.push({ id: 'home-attractions', type: 'page', name: 'Attractions Section Background' });
            if (isUsed(content.sections?.faq?.image)) usages.push({ id: 'home-faq', type: 'page', name: 'FAQ Section Background' });
        }
    }

    // 2. Check Rooms (Main Media & Gallery)
    // First check room_media join table
    const { data: roomMedia } = await supabase
        .from('room_media')
        .select('room_id, rooms(name)')
        .eq('media_id', mediaId);

    if (roomMedia) {
        roomMedia.forEach((rm: any) => {
            usages.push({
                id: rm.room_id,
                type: 'room',
                name: `Room: ${rm.rooms?.name || 'Unknown Room'}`
            });
        });
    }

    // Also check 'media' column in rooms table if it exists as fallback/legacy
    // (Assuming current architecture relies on room_media for galleries)

    // 3. Check Attractions
    const { data: media } = await supabase.from('media_assets').select('url').eq('id', mediaId).single();
    if (media?.url) {
        const { data: attractions } = await supabase
            .from('attractions')
            .select('id, name')
            .eq('image', media.url);

        if (attractions) {
            attractions.forEach(attr => {
                usages.push({
                    id: String(attr.id),
                    type: 'attraction',
                    name: `Attraction: ${attr.name}`
                });
            });
        }
    }

    return usages;
}

/**
 * Permanently deletes a media asset.
 * Should be called after confirming with the user.
 */
export async function deleteMediaAction(mediaId: string) {
    await requirePermission('media.delete');
    const supabase = await createClient();

    // 1. Get Asset Details (to delete from storage)
    const { data: asset, error: fetchError } = await supabase
        .from('media_assets')
        .select('*')
        .eq('id', mediaId)
        .single();

    if (fetchError || !asset) {
        throw new Error('Asset not found');
    }

    // 2. Delete from Storage
    const { error: storageError } = await supabase.storage
        .from(asset.bucket)
        .remove([asset.storage_path]);

    if (storageError) {
        console.error('Failed to delete file from storage:', storageError);
        // We continue to delete row to avoid "ghost" records, 
        // or we could throw. Ideally we want DB to stay clean even if storage fails.
    }

    // 3. Delete from Database
    const { error: dbError } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', mediaId);

    if (dbError) {
        throw new Error(dbError.message);
    }

    // 4. Revalidate
    revalidatePath('/admin/media');

    return { success: true };
}
