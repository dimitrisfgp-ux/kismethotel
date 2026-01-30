import { ROOMS } from "@/data";
import { Room } from "@/types";


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
    checkAvailability: async (_roomId: string, _start: Date, _end: Date): Promise<boolean> => {
        // For prototype, just return true unless it's the specific "unavailable" dates matching a seed
        // We can implement more logic here if needed
        return true;
    }
};
