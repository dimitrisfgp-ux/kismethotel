'use client';

import { useState } from 'react';
import { RoomSummary, Booking, ContactRequest, BookingStatus } from "@/types";
import { BookingsTable } from "@/components/admin/bookings/BookingsTable";
import { CreateBookingModal } from "@/components/admin/bookings/CreateBookingModal";
import { Plus } from 'lucide-react';

interface BookingsPageClientProps {
    rooms: RoomSummary[];
    bookings: Booking[];
    requests: ContactRequest[];
    userRole: string;
    // Server Actions passed down
    approveFn: (id: string) => Promise<void>;
    discardFn: (id: string) => Promise<void>;
}

export function BookingsPageClient({
    rooms,
    bookings,
    requests,
    userRole,
    approveFn,
    discardFn
}: BookingsPageClientProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Filter logic for requests
    const bookingRequests = requests.filter(r => r.bookingId && r.status === "pending");

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-12 px-4">
            {/* Header */}
            <div className="border-b border-[var(--color-sand)] pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold font-montserrat text-[var(--color-charcoal)]">Bookings & Availability</h1>
                    <p className="text-[var(--color-charcoal)]/60 mt-2">Manage guest reservations and block room dates.</p>
                </div>
                {['admin', 'manager', 'receptionist'].includes(userRole) && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[var(--color-aegean-blue)] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#0fd0d6] hover:text-[var(--color-aegean-blue)] transition-colors flex items-center gap-2 shadow-sm"
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
                    bookings={bookings}
                    rooms={rooms}
                    requests={bookingRequests}
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
