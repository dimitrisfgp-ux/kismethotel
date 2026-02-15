"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { roomService } from "@/services/roomService";
import { Room } from "@/types";
import { requirePermission } from "@/lib/auth/guards";

export async function bulkUpdateRoomsAction(roomIds: string[], updates: Partial<Room>) {
    // Check if we are updating times
    if (updates.checkInTime !== undefined || updates.checkOutTime !== undefined) {
        await requirePermission('rooms.update_times');
    } else {
        // Default fall back for other updates (if any in future)
        await requirePermission('rooms.update');
    }

    if (!roomIds.length) return { success: false, message: "No rooms selected" };

    try {
        const success = await roomService.bulkUpdateRooms(roomIds, updates);

        if (success) {
            revalidatePath("/admin/rooms", "page");
            revalidateTag("rooms", "default");
            return { success: true, message: `Successfully updated ${roomIds.length} rooms` };
        } else {
            return { success: false, message: "Failed to update rooms" };
        }
    } catch (error) {
        console.error("Bulk update error:", error);
        return { success: false, message: "An unexpected error occurred" };
    }
}
