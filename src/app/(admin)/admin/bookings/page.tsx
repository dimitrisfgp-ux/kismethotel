import { roomService } from "@/services/roomService";
import { bookingService } from "@/services/bookingService";
import { requestService } from "@/services/requestService";
import { approveRequestAction, discardRequestAction } from "@/app/actions/request";
import { BookingsPageClient } from "@/components/admin/bookings/BookingsPageClient";
import { getUserRole } from "@/lib/auth/guards";

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = 10;

    // All queries run in parallel — getRoomsSummary is lightweight (no deep joins)
    const [rooms, bookingsData, requestsData, roleResult] = await Promise.all([
        roomService.getRoomsSummary(),
        bookingService.getBookings(page, limit),
        requestService.getRequests(page, limit),
        getUserRole()
    ]);

    const userRole = roleResult?.roleName ?? 'viewer';

    return (
        <BookingsPageClient
            rooms={rooms}
            initialBookings={bookingsData}
            initialRequests={requestsData}
            userRole={userRole}
            approveFn={async (id: string) => { "use server"; await approveRequestAction(id); }}
            discardFn={async (id: string) => { "use server"; await discardRequestAction(id); }}
        />
    );
}
