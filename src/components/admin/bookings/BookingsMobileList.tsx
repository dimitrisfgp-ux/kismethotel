
import { Booking, RoomSummary, ContactRequest } from "@/types";
import { BookingsMobileCard } from "./BookingsMobileCard";
import { FilterKey } from "@/hooks/useBookingFilters";
import { getRoomName } from "@/lib/filterHelpers";

interface BookingsMobileListProps {
    bookings: Booking[];
    requestsByBookingId: Map<string, ContactRequest[]>;
    rooms: RoomSummary[];
    userRole: string;
    onSelectBooking: (booking: Booking) => void;
    onSelectRequest: (request: ContactRequest) => void;
    isFilterActive: (key: FilterKey) => boolean;
    setOpenFilter: (key: FilterKey) => void;
}

export function BookingsMobileList({
    bookings,
    requestsByBookingId,
    rooms,
    userRole,
    onSelectBooking,
    onSelectRequest,
    isFilterActive,
    setOpenFilter
}: BookingsMobileListProps) {

    return (
        <div className="md:hidden space-y-3 p-2 bg-[var(--color-warm-white)]/30">
            {/* Mobile Filter Bar */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2">
                <button onClick={() => setOpenFilter("status")} className="whitespace-nowrap px-3 py-1.5 bg-white border border-[var(--color-sand)] rounded-full text-xs font-medium text-[var(--color-charcoal)] shadow-sm active:bg-[var(--color-sand)]/20">
                    Status {isFilterActive("status") && "•"}
                </button>
                <button onClick={() => setOpenFilter("dates")} className="whitespace-nowrap px-3 py-1.5 bg-white border border-[var(--color-sand)] rounded-full text-xs font-medium text-[var(--color-charcoal)] shadow-sm active:bg-[var(--color-sand)]/20">
                    Dates {isFilterActive("dates") && "•"}
                </button>
                <button onClick={() => setOpenFilter("room")} className="whitespace-nowrap px-3 py-1.5 bg-white border border-[var(--color-sand)] rounded-full text-xs font-medium text-[var(--color-charcoal)] shadow-sm active:bg-[var(--color-sand)]/20">
                    Room {isFilterActive("room") && "•"}
                </button>
                <button onClick={() => setOpenFilter("details")} className="whitespace-nowrap px-3 py-1.5 bg-white border border-[var(--color-sand)] rounded-full text-xs font-medium text-[var(--color-charcoal)] shadow-sm active:bg-[var(--color-sand)]/20">
                    Guest {isFilterActive("details") && "•"}
                </button>
                <button onClick={() => setOpenFilter("bookingId")} className="whitespace-nowrap px-3 py-1.5 bg-white border border-[var(--color-sand)] rounded-full text-xs font-medium text-[var(--color-charcoal)] shadow-sm active:bg-[var(--color-sand)]/20">
                    ID {isFilterActive("bookingId") && "•"}
                </button>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-8 text-[var(--color-charcoal)]/60 italic">
                    No bookings match filters.
                </div>
            ) : (
                bookings.map((booking) => {
                    const bookingRequests = requestsByBookingId.get(booking.id) || [];
                    const pendingRequest = bookingRequests.find(r => r.status === 'pending');

                    return (
                        <BookingsMobileCard
                            key={booking.id}
                            booking={booking}
                            roomName={getRoomName(rooms, booking.roomId)}
                            roomImage={rooms.find(r => r.id === booking.roomId)?.imageUrl}
                            requestCount={bookingRequests.filter(r => r.status === 'pending').length}
                            userRole={userRole}
                            onViewQuery={() => {
                                if (pendingRequest) onSelectRequest(pendingRequest);
                            }}
                            onViewDetails={() => onSelectBooking(booking)}
                        />
                    );
                })
            )}
        </div>
    );
}
