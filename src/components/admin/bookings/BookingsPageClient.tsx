'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { RoomSummary, Booking, ContactRequest, PaginatedResponse } from "@/types";
import { BookingsTable } from "@/components/admin/bookings/BookingsTable";
import { CreateBookingModal } from "@/components/admin/bookings/CreateBookingModal";
import { Plus } from 'lucide-react';
import { usePermission } from "@/contexts/PermissionContext";

interface BookingsPageClientProps {
    rooms: RoomSummary[];
    initialBookings: PaginatedResponse<Booking>;
    initialRequests: PaginatedResponse<ContactRequest>;
    userRole: string;
    // Server Actions passed down
    approveFn: (id: string) => Promise<void>;
    discardFn: (id: string) => Promise<void>;
}

export function BookingsPageClient({
    rooms,
    initialBookings,
    initialRequests,
    userRole,
    approveFn,
    discardFn
}: BookingsPageClientProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { can } = usePermission();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Filter logic for requests (Just showing pending for now, pagination applied to list)
    // Note: If we want to filter requests client side we can, but they are paginated now.
    // For the "Booking Requests" section, we probably want to show ALL pending requests?
    // If so, we might need a separate query for "Pending Requests count" or just show the page.
    // For now, let's use the paginated list.
    const bookingRequests = initialRequests.data.filter((r: ContactRequest) => r.bookingId && r.status === "pending");

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-12 px-4">
            {/* Header */}
            <div className="border-b border-[var(--color-sand)] pb-6 flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold font-montserrat text-[var(--color-charcoal)]">Bookings & Availability</h1>
                    <p className="text-[var(--color-charcoal)]/60 mt-1 md:mt-2 text-sm md:text-base">Manage guest reservations and block room dates.</p>
                </div>
                {can('bookings.create') && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[var(--color-aegean-blue)] w-full md:w-auto text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#0fd0d6] hover:text-[var(--color-aegean-blue)] transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Booking
                    </button>
                )}
            </div>

            {/* Confirmed Bookings Section */}
            <section>
                <h2 className="text-xl font-bold text-[var(--color-aegean-blue)] mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-[var(--color-accent-gold)] rounded-full block"></span>
                    Confirmed Bookings
                </h2>
                <BookingsTable
                    bookings={initialBookings.data}
                    totalBookings={initialBookings.total}
                    currentPage={initialBookings.page}
                    itemsPerPage={initialBookings.limit}
                    onPageChange={handlePageChange}
                    rooms={rooms}
                    requests={bookingRequests} // Passing paginated requests for now
                    userRole={userRole}
                    onApproveRequest={async (r) => approveFn(r.id)}
                    onDiscardRequest={async (r) => discardFn(r.id)}
                />
            </section>

            {/* Modals */}
            <CreateBookingModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                rooms={rooms}
                currentUserRole={userRole}
            />
        </div>
    );
}
