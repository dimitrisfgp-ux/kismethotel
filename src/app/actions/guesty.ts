'use server';

import { requirePermission } from '@/lib/auth/guards';
import { createClient } from '@/lib/supabase/server';
import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * Replace the ordered image list for a guesty category. The given order is the
 * source of truth: index 0 becomes the cover, 1..3 the secondary thumbnails,
 * 4.. the carousel/lightbox extras (the public read-path slices by position).
 */
export async function setCategoryMediaAction(categoryId: string, mediaIds: string[]) {
    await requirePermission('content.pages');
    const supabase = await createClient();

    const { error: delError } = await supabase
        .from('guesty_category_media')
        .delete()
        .eq('category_id', categoryId);
    if (delError) throw new Error(delError.message);

    if (mediaIds.length > 0) {
        const rows = mediaIds.map((media_id, i) => ({
            category_id: categoryId,
            media_id,
            display_order: i,
        }));
        const { error: insError } = await supabase.from('guesty_category_media').insert(rows);
        if (insError) throw new Error(insError.message);
    }

    revalidateTag('guesty-home', 'default');
    revalidatePath('/admin/homepage');
    return { success: true };
}

/** Update a guesty category's copy / link / layout. */
export async function updateCategoryAction(
    categoryId: string,
    fields: {
        title?: string;
        subtitle?: string;
        description?: string;
        guestyUrl?: string;
        layout?: 'image-left' | 'image-right';
    }
) {
    await requirePermission('content.pages');
    const supabase = await createClient();

    const payload: Record<string, unknown> = {};
    if (fields.title !== undefined) payload.title = fields.title;
    if (fields.subtitle !== undefined) payload.subtitle = fields.subtitle;
    if (fields.description !== undefined) payload.description = fields.description;
    if (fields.guestyUrl !== undefined) payload.guesty_url = fields.guestyUrl;
    if (fields.layout !== undefined) payload.layout = fields.layout;

    if (Object.keys(payload).length > 0) {
        const { error } = await supabase.from('guesty_categories').update(payload).eq('id', categoryId);
        if (error) throw new Error(error.message);
    }

    revalidateTag('guesty-home', 'default');
    revalidatePath('/admin/homepage');
    return { success: true };
}
