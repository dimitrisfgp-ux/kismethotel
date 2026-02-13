import { useMemo } from "react";
import { ContactRequest } from "@/types";

export function useBookingRequests(requests: ContactRequest[]) {
    // Group Requests by Booking ID
    const requestsByBookingId = useMemo(() => {
        const map = new Map<string, ContactRequest[]>();
        requests.forEach(req => {
            if (req.bookingId) {
                const existing = map.get(req.bookingId) || [];
                map.set(req.bookingId, [...existing, req]);
            }
        });
        return map;
    }, [requests]);

    return requestsByBookingId;
}
