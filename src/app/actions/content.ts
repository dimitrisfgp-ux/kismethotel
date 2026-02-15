"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { contentService } from "@/services/contentService";
import { HotelSettings, PageContent, FAQ, Convenience, LocationCategory } from "@/types";
import { requirePermission } from "@/lib/auth/guards";

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
    if (success) {
        revalidatePath("/admin/page-content", "page");
        revalidatePath("/", "page");
    }
    return success;
}

export async function updateLocationsAction(locations: Convenience[]) {
    await requirePermission('content.locations');
    const success = await contentService.updateConveniences(locations);
    if (success) {
        revalidatePath("/admin/page-content", "page");
        revalidatePath("/", "page");
    }
    return success;
}

export async function updateCategoriesAction(categories: LocationCategory[]) {
    await requirePermission('content.locations');
    const result = await contentService.updateCategories(categories);
    if (result) {
        revalidatePath("/admin/page-content", "page");
        revalidatePath("/", "page");
    }
    return result;
}

export async function getAmenitiesAction() {
    return contentService.getAmenities();
}

export async function deleteCategoryAction(categoryId: string) {
    await requirePermission('content.locations');
    const success = await contentService.deleteCategory(categoryId);
    if (success) {
        revalidatePath("/admin/page-content", "page");
        revalidatePath("/", "page");
    }
    return success;
}
