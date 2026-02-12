import { requestService } from "@/services/requestService";
import { bookingService } from "@/services/bookingService";
import { RequestsTable } from "@/components/admin/requests/RequestsTable";

export default async function RequestsPage() {
    const [requests, bookings] = await Promise.all([
        requestService.getRequests(),
        bookingService.getBookings()
    ]);

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div className="border-b border-[var(--color-sand)] pb-6">
                <h1 className="text-3xl font-bold font-montserrat text-[var(--color-charcoal)]">Contact Requests</h1>
                <p className="text-[var(--color-charcoal)]/60 mt-2">Review and action guest inquiries and booking change requests.</p>
            </div>

            <section>
                <h2 className="text-xl font-bold text-[var(--color-aegean-blue)] mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-[var(--color-accent-gold)] rounded-full block"></span>
                    All Requests
                </h2>
                <RequestsTable requests={requests} bookings={bookings} />
            </section>
        </div>
    );
}
