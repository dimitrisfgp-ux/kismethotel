"use server";

import { revalidatePath } from "next/cache";
import { roomService } from "@/services/roomService";
import { contentService } from "@/services/contentService";
import { Room, HotelSettings, PageContent, FAQ, BlockedDate, Booking } from "@/types";

// --- Room Actions ---

export async function createRoomAction(room: Room) {
    const success = await roomService.createRoom(room);
    if (success) {
        revalidatePath("/admin/rooms");
        revalidatePath("/");
        revalidatePath("/(website)", "layout"); // Try to revalidate public site
    }
    return success;
}

export async function saveRoomAction(room: Room) {
    const success = await roomService.saveRoom(room);
    if (success) {
        revalidatePath("/admin/rooms");
        revalidatePath(`/admin/rooms/${room.slug}`);
        revalidatePath("/");
    }
    return success;
}

export async function deleteRoomAction(roomId: string) {
    const success = await roomService.deleteRoom(roomId);
    if (success) {
        revalidatePath("/admin/rooms");
        revalidatePath("/");
    }
    return success;
}

// --- Content Actions ---

export async function updateSettingsAction(settings: HotelSettings) {
    const success = await contentService.updateSettings(settings);
    if (success) {
        revalidatePath("/admin/settings");
        revalidatePath("/", "layout"); // Revalidate entire site as settings affect footer/meta
    }
    return success;
}

export async function updatePageContentAction(content: PageContent) {
    const success = await contentService.updatePageContent(content);
    if (success) {
        revalidatePath("/admin/settings");
        revalidatePath("/");
    }
    return success;
}

// --- FAQ Actions ---

export async function updateFAQsAction(faqs: FAQ[]) {
    const success = await contentService.updateFAQs(faqs);
    if (success) {
        revalidatePath("/admin/page-content");
        revalidatePath("/");
    }
    return success;
}

// --- Blocked Dates Actions ---

export async function addBlockedDateAction(block: BlockedDate) {
    const success = await roomService.addBlockedDate(block);
    if (success) {
        revalidatePath("/admin/bookings");
        // Revalidate public room pages so the calendar updates immediately
        revalidatePath(`/rooms`);
    }
    return success;
}

export async function removeBlockedDateAction(blockId: string) {
    const success = await roomService.removeBlockedDate(blockId);
    if (success) {
        revalidatePath("/admin/bookings");
        revalidatePath(`/rooms`);
    }
    return success;
}

export async function cancelBookingAction(bookingId: string) {
    const success = await roomService.cancelBooking(bookingId);
    if (success) {
        revalidatePath("/admin/bookings");
        revalidatePath(`/rooms`); // Update availability
    }
    return success;
}

// --- Booking Actions ---

export async function createBookingAction(booking: Booking) {
    // In a real app, validation would happen here or in service
    const success = await roomService.createBooking(booking);
    if (success) {
        revalidatePath("/admin/bookings");
        revalidatePath(`/rooms`);
    }
    return success;
}
