import { roomService } from "@/services/roomService";
import { requestService } from "@/services/requestService";
import { AvailabilityManager } from "@/components/admin/bookings/AvailabilityManager";
import { BookingsTable } from "@/components/admin/bookings/BookingsTable";
import { approveRequestAction, discardRequestAction } from "@/app/actions";
import { ContactRequest } from "@/types";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
    const rooms = await roomService.getRooms();
    const bookings = await roomService.getBookings();
    const blockedDates = await roomService.getBlockedDates();
    const requests = await requestService.getRequests();

    // Only pass pending requests related to bookings
    const bookingRequests = requests.filter(r => r.bookingId && r.status === "pending");

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-12 px-4">
            <div className="border-b border-[var(--color-sand)] pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold font-montserrat text-[var(--color-charcoal)]">Bookings & Availability</h1>
                    <p className="text-[var(--color-charcoal)]/60 mt-2">Manage guest reservations and block room dates.</p>
                </div>
            </div>

            {/* Section 1: Confirmed Bookings */}
            <section>
                <h2 className="text-xl font-bold text-[var(--color-aegean-blue)] mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-[var(--color-accent-gold)] rounded-full block"></span>
                    Confirmed Bookings
                </h2>
                <BookingsTable
                    bookings={bookings}
                    rooms={rooms}
                    requests={bookingRequests}
                    onApproveRequest={async (request: ContactRequest) => {
                        "use server";
                        await approveRequestAction(request.id);
                    }}
                    onDiscardRequest={async (request: ContactRequest) => {
                        "use server";
                        await discardRequestAction(request.id);
                    }}
                />
            </section>

            {/* Section 2: Availability Manager (Blocked Dates) */}
            <section>
                <h2 className="text-xl font-bold text-[var(--color-aegean-blue)] mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-[var(--color-accent-gold)] rounded-full block"></span>
                    Unavailability & Blocks
                </h2>
                <AvailabilityManager rooms={rooms} initialBlockedDates={blockedDates} />
            </section>
        </div>
    );
}
