import { roomService } from "@/services/roomService";
import { bookingService } from "@/services/bookingService";
import { requestService } from "@/services/requestService";
import { approveRequestAction, discardRequestAction } from "@/app/actions/request";
import { BookingsPageClient } from "@/components/admin/bookings/BookingsPageClient";
import { getUserRole } from "@/lib/auth/guards";

export default async function BookingsPage() {
    // All queries run in parallel — getRoomsSummary is lightweight (no deep joins)
    const [rooms, bookings, requests, roleResult] = await Promise.all([
        roomService.getRoomsSummary(),
        bookingService.getBookings(),
        requestService.getRequests(),
        getUserRole()
    ]);

    const userRole = roleResult?.roleName ?? 'viewer';

    return (
        <BookingsPageClient
            rooms={rooms}
            bookings={bookings}
            requests={requests}
            userRole={userRole}
            approveFn={async (id: string) => { "use server"; await approveRequestAction(id); }}
            discardFn={async (id: string) => { "use server"; await discardRequestAction(id); }}
        />
    );
}
