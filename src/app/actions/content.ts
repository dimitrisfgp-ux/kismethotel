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

export async function updateLocationsAction(locations: Convenience[]) {
    await requirePermission('content.locations');
    const success = await contentService.updateConveniences(locations);
    if (success) revalidateHomepageContent();
    return success;
}

export async function updateCategoriesAction(categories: LocationCategory[]) {
    await requirePermission('content.locations');
    const result = await contentService.updateCategories(categories);
    if (result) revalidateHomepageContent();
    return result;
}

export async function updateAttractionsAction(attractions: Attraction[]) {
    await requirePermission('content.pages');
    const success = await contentService.updateAttractions(attractions);
    if (success) revalidateHomepageContent();
    return success;
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
