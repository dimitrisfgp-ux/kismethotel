"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { roomService } from "@/services/roomService";
import { Room } from "@/types";
import { requirePermission } from "@/lib/auth/guards";

export async function createRoomAction(room: Room) {
    await requirePermission('rooms.create');
    const success = await roomService.createRoom(room);
    if (success) {
        revalidatePath("/admin/rooms", "page");
        revalidatePath("/", "page");
        revalidatePath("/(website)", "layout"); // Try to revalidate public site
        revalidateTag("rooms", "default");
    }
    return success;
}

export async function saveRoomAction(room: Room) {
    await requirePermission('rooms.update');
    const success = await roomService.saveRoom(room);
    if (success) {
        revalidatePath("/admin/rooms", "page");
        revalidatePath(`/admin/rooms/${room.slug}`, "page");
        revalidatePath("/", "page");
        revalidateTag("rooms", "default");
    }
    return success;
}

export async function deleteRoomAction(roomId: string) {
    await requirePermission('rooms.delete');

    // SAFETY CHECK: Prevent deleting rooms with future bookings
    // (Database ON DELETE SET NULL would orphan them, leaving guests without a room)
    const { bookingService } = await import("@/services/bookingService");
    const hasBookings = await bookingService.hasFutureBookings(roomId);

    if (hasBookings) {
        throw new Error("Cannot delete room: It has active or future bookings. Please cancel or move them first.");
    }

    const success = await roomService.deleteRoom(roomId);
    if (success) {
        revalidatePath("/admin/rooms", "page");
        revalidatePath("/", "page");
        revalidateTag("rooms", "default");
    }
    return success;
}

export async function getRoomsAction() {
    return roomService.getRooms();
}
