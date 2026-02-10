import { roomService } from "@/services/roomService";
import { requestService } from "@/services/requestService";
import { approveRequestAction, discardRequestAction } from "@/app/actions";
import { BookingsPageClient } from "@/components/admin/bookings/BookingsPageClient";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
    // 1. Fetch Key Data Parallel
    const [rooms, bookings, requests, supabase] = await Promise.all([
        roomService.getRooms(),
        roomService.getBookings(),
        requestService.getRequests(),
        createClient()
    ]);

    // 2. Fetch User Role
    const { data: { user } } = await supabase.auth.getUser();
    let userRole = 'viewer';

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        userRole = profile?.role || 'viewer';
    }

    return (
        <BookingsPageClient
            rooms={rooms}
            bookings={bookings}
            requests={requests}
            userRole={userRole}
            approveFn={async (id) => { "use server"; await approveRequestAction(id); }}
            discardFn={async (id) => { "use server"; await discardRequestAction(id); }}
        />
    );
}
