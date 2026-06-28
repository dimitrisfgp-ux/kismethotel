'use server';

import { createClient } from '@/lib/supabase/server';
import { requirePermission } from '@/lib/auth/guards';
import { revalidatePath } from 'next/cache';
import { MediaAsset } from '@/types';
import { r2Put, r2Delete, r2PublicPath } from '@/lib/r2';

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

    // 2. Delete the underlying object from its storage backend.
    if (asset.provider === 'r2') {
        try {
            await r2Delete(asset.storage_path);
        } catch (e) {
            console.error('Failed to delete object from R2:', e);
        }
    } else if (asset.provider === 'supabase') {
        const { error: storageError } = await supabase.storage
            .from(asset.bucket)
            .remove([asset.storage_path]);
        if (storageError) {
            console.error('Failed to delete file from Supabase storage:', storageError);
        }
    }
    // provider 'public' → file lives in /public (git); nothing to remove from a bucket.

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

function toMediaAsset(row: Record<string, unknown>): MediaAsset {
    return {
        id: row.id as string,
        filename: row.filename as string,
        originalFilename: row.original_filename as string,
        storagePath: row.storage_path as string,
        url: row.url as string,
        bucket: row.bucket as string,
        folder: row.folder as string,
        mediaType: (row.media_type as 'image' | 'video') ?? 'image',
        mimeType: (row.mime_type as string) ?? 'image/webp',
        sizeBytes: (row.size_bytes as number) ?? 0,
        width: (row.width as number) ?? undefined,
        height: (row.height as number) ?? undefined,
        altText: (row.alt_text as string) ?? undefined,
        caption: (row.caption as string) ?? undefined,
        createdBy: (row.created_by as string) ?? undefined,
        createdAt: (row.created_at as string) ?? '',
        updatedAt: (row.updated_at as string) ?? '',
    };
}

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2 MB

/**
 * Upload a WebP image to R2 for the guesty homepage. WebP-only is enforced by
 * magic-byte check (not just the extension). Stored privately in R2 with
 * provider='r2'; the public URL is the /api/media proxy path.
 */
export async function uploadGuestyMediaAction(
    formData: FormData
): Promise<{ success: true; asset: MediaAsset } | { success: false; error: string }> {
    await requirePermission('media.upload');

    const file = formData.get('file');
    if (!(file instanceof File)) return { success: false, error: 'No file provided.' };

    const bytes = new Uint8Array(await file.arrayBuffer());

    // WebP magic bytes: "RIFF" (0..4) .... "WEBP" (8..12)
    const isWebp =
        bytes.length > 12 &&
        bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
        bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
    if (!isWebp) return { success: false, error: 'Only WebP images are allowed.' };
    if (bytes.length > MAX_UPLOAD_BYTES) return { success: false, error: 'Image is too large (max 2 MB).' };

    const width = Number(formData.get('width')) || null;
    const height = Number(formData.get('height')) || null;

    const key = `guesty/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.webp`;

    try {
        await r2Put(key, bytes, 'image/webp');
    } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'Upload to storage failed.' };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('media_assets')
        .insert({
            filename: key.split('/').pop(),
            original_filename: file.name,
            storage_path: key,
            url: r2PublicPath(key),
            bucket: process.env.R2_BUCKET,
            folder: 'guesty',
            media_type: 'image',
            mime_type: 'image/webp',
            size_bytes: bytes.length,
            width,
            height,
            provider: 'r2',
        })
        .select()
        .single();

    if (error || !data) {
        await r2Delete(key).catch(() => { }); // avoid an orphaned object
        return { success: false, error: error?.message ?? 'Failed to save the media record.' };
    }

    revalidatePath('/admin/homepage');
    revalidatePath('/admin/media');
    return { success: true, asset: toMediaAsset(data) };
}
