import { ROOMS } from "@/data";
import { Room } from "@/types";

export const roomService = {
    getRooms: async (): Promise<Room[]> => {
        return ROOMS;
    },

    getRoomBySlug: async (slug: string): Promise<Room | undefined> => {
        return ROOMS.find(room => room.slug === slug);
    },

    getFeaturedRooms: async (): Promise<Room[]> => {
        return ROOMS.slice(0, 4);
    },

    checkAvailability: async (_roomId: string, _start: Date, _end: Date): Promise<boolean> => {
        return true;
    }
};

