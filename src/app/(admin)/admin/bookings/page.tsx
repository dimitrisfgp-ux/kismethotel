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

    console.log('BookingsPage params:', { page, limit });

    // Run sequentially to debug potential race conditions with cookies/supabase client
    const rooms = await roomService.getRoomsSummary();
    const bookingsData = await bookingService.getBookings(page, limit);
    const requestsData = await requestService.getRequests(page, limit);
    const blockedDates = await bookingService.getBlockedDates(); // Fetch blocked dates
    const roleResult = await getUserRole();

    const userRole = roleResult?.roleName ?? 'viewer';

    return (
        <BookingsPageClient
            rooms={rooms}
            initialBookings={bookingsData}
            initialRequests={requestsData}
            initialBlockedDates={blockedDates}
            userRole={userRole}
            approveFn={async (id: string) => { "use server"; await approveRequestAction(id); }}
            discardFn={async (id: string) => { "use server"; await discardRequestAction(id); }}
        />
    );
}
