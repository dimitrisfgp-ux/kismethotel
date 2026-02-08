import { ROOMS } from "@/data";
import { Room, BlockedDate, Booking } from "@/types";

// Global persistence hack for development to prevent data reset on HMR/Route changes
const globalForMock = global as unknown as {
    mockRooms: Room[],
    mockBlockedDates: BlockedDate[],
    mockBookings: Booking[]
};

if (!globalForMock.mockRooms) {
    globalForMock.mockRooms = [...ROOMS];
}
if (!globalForMock.mockBlockedDates) globalForMock.mockBlockedDates = [];
if (!globalForMock.mockBookings) globalForMock.mockBookings = [];



export const roomService = {
    getRooms: async (): Promise<Room[]> => {
        return globalForMock.mockRooms;
    },

    getRoomBySlug: async (slug: string): Promise<Room | undefined> => {
        return globalForMock.mockRooms.find(room => room.slug === slug);
    },

    getFeaturedRooms: async (): Promise<Room[]> => {
        return globalForMock.mockRooms.slice(0, 4);
    },

    // --- Availability & Bookings ---

    getBookings: async (roomId?: string): Promise<Booking[]> => {
        if (!roomId) return globalForMock.mockBookings;
        return globalForMock.mockBookings.filter(b => b.roomId === roomId);
    },

    getBlockedDates: async (roomId?: string): Promise<BlockedDate[]> => {
        if (!roomId) return globalForMock.mockBlockedDates;
        return globalForMock.mockBlockedDates.filter(b => b.roomId === roomId);
    },

    addBlockedDate: async (block: BlockedDate): Promise<boolean> => {
        globalForMock.mockBlockedDates.push(block);
        return true;
    },

    removeBlockedDate: async (blockId: string): Promise<boolean> => {
        globalForMock.mockBlockedDates = globalForMock.mockBlockedDates.filter(b => b.id !== blockId);
        return true;
    },

    checkAvailability: async (roomId: string, start: Date, end: Date): Promise<boolean> => {
        // Simple check: loops through all blocked dates and confirmed bookings
        // In a real app, this would be a DB query
        const startTime = start.getTime();
        const endTime = end.getTime();

        const hasBlock = globalForMock.mockBlockedDates
            .filter(b => b.roomId === roomId)
            .some(b => {
                const bStart = new Date(b.from).getTime();
                const bEnd = new Date(b.to).getTime();
                return (startTime < bEnd && endTime > bStart); // Overlap
            });

        const hasBooking = globalForMock.mockBookings
            .filter(b => b.roomId === roomId && b.status === "confirmed")
            .some(b => {
                const bStart = new Date(b.checkIn).getTime();
                const bEnd = new Date(b.checkOut).getTime();
                return (startTime < bEnd && endTime > bStart); // Overlap
            });

        return !hasBlock && !hasBooking;
    },

    createBooking: async (booking: Booking): Promise<boolean> => {
        // SIMULATION: Always treat as confirmed for now since we have no Stripe
        const simulatedBooking = { ...booking, status: 'confirmed' as const };
        globalForMock.mockBookings.push(simulatedBooking);
        return true;
    },

    cancelBooking: async (bookingId: string): Promise<boolean> => {
        const booking = globalForMock.mockBookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = 'cancelled';
            return true;
        }
        return false;
    },

    // --- Mock CRUD Operations ---

    createRoom: async (room: Room): Promise<boolean> => {
        globalForMock.mockRooms.push(room);
        return true;
    },

    saveRoom: async (updatedRoom: Room): Promise<boolean> => {
        const index = globalForMock.mockRooms.findIndex(r => r.id === updatedRoom.id);
        if (index !== -1) {
            globalForMock.mockRooms[index] = updatedRoom;
            return true;
        }
        return false;
    },

    deleteRoom: async (roomId: string): Promise<boolean> => {
        const initialLength = globalForMock.mockRooms.length;
        globalForMock.mockRooms = globalForMock.mockRooms.filter(r => r.id !== roomId);
        return globalForMock.mockRooms.length < initialLength;
    },

    // --- Booking Management ---

    getBookingById: async (bookingId: string): Promise<Booking | undefined> => {
        return globalForMock.mockBookings.find(b => b.id === bookingId);
    },

    updateBookingDates: async (bookingId: string, checkIn: string, checkOut: string): Promise<boolean> => {
        const booking = globalForMock.mockBookings.find(b => b.id === bookingId);
        if (booking) {
            booking.checkIn = checkIn;
            booking.checkOut = checkOut;
            return true;
        }
        return false;
    }
};
