import { ContactRequest, RequestStatus } from "@/types";

// Global persistence for mock data (same pattern as roomService)
const globalForMock = global as unknown as {
    mockRequests: ContactRequest[]
};

if (!globalForMock.mockRequests) globalForMock.mockRequests = [];

export const requestService = {
    getRequests: async (): Promise<ContactRequest[]> => {
        return globalForMock.mockRequests;
    },

    getRequest: async (id: string): Promise<ContactRequest | undefined> => {
        return globalForMock.mockRequests.find(r => r.id === id);
    },

    createRequest: async (request: ContactRequest): Promise<boolean> => {
        globalForMock.mockRequests.push(request);
        return true;
    },

    updateRequestStatus: async (
        id: string,
        status: RequestStatus,
        originalDates?: { originalCheckIn: string; originalCheckOut: string }
    ): Promise<boolean> => {
        const request = globalForMock.mockRequests.find(r => r.id === id);
        if (request) {
            request.status = status;
            // Store original dates when approving a reschedule
            if (originalDates) {
                request.originalCheckIn = originalDates.originalCheckIn;
                request.originalCheckOut = originalDates.originalCheckOut;
            }
            return true;
        }
        return false;
    }
};
