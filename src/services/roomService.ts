import { ROOMS } from "@/data";
import { Room } from "@/types";
import { isDateAvailable } from "@/lib/availability";

export const roomService = {
    getRooms: async (): Promise<Room[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return ROOMS;
    },

    getRoomBySlug: async (slug: string): Promise<Room | undefined> => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return ROOMS.find(room => room.slug === slug);
    },

    getFeaturedRooms: async (): Promise<Room[]> => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return ROOMS.slice(0, 4); // Just first 4 for home
    },

    // Mock availability check
    checkAvailability: async (roomId: string, start: Date, end: Date): Promise<boolean> => {
        // For prototype, just return true unless it's the specific "unavailable" dates matching a seed
        // We can implement more logic here if needed
        return true;
    }
};
