import { roomService } from "@/services/roomService";
import { AvailabilityManager } from "@/components/admin/bookings/AvailabilityManager";
import { BookingsTable } from "@/components/admin/bookings/BookingsTable";

export default async function BookingsPage() {
    const rooms = await roomService.getRooms();
    const bookings = await roomService.getBookings();
    const blockedDates = await roomService.getBlockedDates();

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
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
                <BookingsTable bookings={bookings} rooms={rooms} />
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
