"use server";

import { revalidatePath } from "next/cache";
import { roomService } from "@/services/roomService";
import { Room } from "@/types";
import { requirePermission } from "@/lib/auth/guards";

export async function createRoomAction(room: Room) {
    await requirePermission('rooms.manage');
    const success = await roomService.createRoom(room);
    if (success) {
        revalidatePath("/admin/rooms");
        revalidatePath("/");
        revalidatePath("/(website)", "layout"); // Try to revalidate public site
    }
    return success;
}

export async function saveRoomAction(room: Room) {
    await requirePermission('rooms.manage');
    const success = await roomService.saveRoom(room);
    if (success) {
        revalidatePath("/admin/rooms");
        revalidatePath(`/admin/rooms/${room.slug}`);
        revalidatePath("/");
    }
    return success;
}

export async function deleteRoomAction(roomId: string) {
    await requirePermission('rooms.manage');
    const success = await roomService.deleteRoom(roomId);
    if (success) {
        revalidatePath("/admin/rooms");
        revalidatePath("/");
    }
    return success;
}

export async function getRoomsAction() {
    return roomService.getRooms();
}
