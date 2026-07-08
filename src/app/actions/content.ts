"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { contentService } from "@/services/contentService";
import { HotelSettings, PageContent, FAQ, Convenience, LocationCategory, Attraction } from "@/types";
import { requirePermission } from "@/lib/auth/guards";

// Revalidate every surface that renders homepage content — the self_contained
// page-content route, the guesty homepage editor, the public site, and the
// cached guesty-home document.
function revalidateHomepageContent() {
    revalidatePath("/admin/page-content", "page");
    revalidatePath("/admin/homepage", "page");
    revalidatePath("/", "page");
    revalidateTag("guesty-home", "default");
}

export async function updateSettingsAction(settings: HotelSettings) {
    await requirePermission('content.settings');
    const success = await contentService.updateSettings(settings);
    if (success) {
        revalidatePath("/admin/settings", "page");
        revalidatePath("/", "layout"); // Revalidate entire site as settings affect footer/meta
        revalidateTag("settings", "default");
    }
    return success;
}

export async function updatePageContentAction(content: PageContent) {
    await requirePermission('content.pages');
    const success = await contentService.updatePageContent(content);
    if (success) {
        revalidatePath("/admin/settings", "page");
        revalidatePath("/", "page");
        revalidateTag("page_content", "default");
    }
    return success;
}

export async function updateFAQsAction(faqs: FAQ[]) {
    await requirePermission('content.faqs');
    const success = await contentService.updateFAQs(faqs);
    if (success) revalidateHomepageContent();
    return success;
}

export async function updateLocationsAction(
    locations: Convenience[]
): Promise<{ ok: true } | { ok: false; error: string }> {
    try {
        await requirePermission('content.locations');
        await contentService.updateConveniences(locations);
        revalidateHomepageContent();
        return { ok: true };
    } catch (e) {
        // Return (don't throw) so the real message reaches the client —
        // Next redacts thrown Server Action errors in production.
        return { ok: false, error: e instanceof Error ? e.message : 'Save locations failed' };
    }
}

export async function updateCategoriesAction(
    categories: LocationCategory[]
): Promise<{ ok: true; idMap: Record<string, string> } | { ok: false; error: string }> {
    try {
        await requirePermission('content.locations');
        const idMap = await contentService.updateCategories(categories);
        revalidateHomepageContent();
        return { ok: true, idMap: idMap ?? {} };
    } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : 'Save categories failed' };
    }
}

export async function updateAttractionsAction(attractions: Attraction[]) {
    await requirePermission('content.pages');
    const success = await contentService.updateAttractions(attractions);
    if (success) revalidateHomepageContent();
    return success;
}

export async function deleteAttractionAction(id: number): Promise<{ ok: true } | { ok: false; error: string }> {
    try {
        await requirePermission('content.pages');
        const success = await contentService.deleteAttraction(id);
        if (!success) return { ok: false, error: 'Failed to remove attraction' };
        revalidateHomepageContent();
        return { ok: true };
    } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : 'Failed to remove attraction' };
    }
}

export async function getAmenitiesAction() {
    return contentService.getAmenities();
}

export async function deleteCategoryAction(categoryId: string) {
    await requirePermission('content.locations');
    const success = await contentService.deleteCategory(categoryId);
    if (success) revalidateHomepageContent();
    return success;
}
