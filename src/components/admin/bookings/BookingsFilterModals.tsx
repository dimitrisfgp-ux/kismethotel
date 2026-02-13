
import { BookingFilters } from "@/hooks/useBookingFilters";
import { RoomSummary } from "@/types";
import {
    BookingIdFilter,
    DetailsFilter,
    RoomFilter,
    GuestsFilter,
    CostFilter,
    StatusFilter,
    RequestsFilter,
    DatesFilter,
} from "./filters";
import { FilterKey } from "@/hooks/useBookingFilters";

interface BookingsFilterModalsProps {
    openFilter: FilterKey | null;
    setOpenFilter: (key: FilterKey | null) => void;
    filters: BookingFilters;
    setFilters: (filters: BookingFilters) => void;
    rooms: RoomSummary[];
}

export function BookingsFilterModals({
    openFilter,
    setOpenFilter,
    filters,
    setFilters,
    rooms
}: BookingsFilterModalsProps) {

    const onClose = () => setOpenFilter(null);

    return (
        <>
            <BookingIdFilter
                isOpen={openFilter === "bookingId"}
                onClose={onClose}
                value={filters.bookingId}
                onChange={(value) => setFilters({ ...filters, bookingId: value })}
            />
            <DetailsFilter
                isOpen={openFilter === "details"}
                onClose={onClose}
                value={filters.details}
                onChange={(value) => setFilters({ ...filters, details: value })}
            />
            <RoomFilter
                isOpen={openFilter === "room"}
                onClose={onClose}
                rooms={rooms}
                selectedRoomIds={filters.roomIds}
                onChange={(roomIds) => setFilters({ ...filters, roomIds })}
            />
            <GuestsFilter
                isOpen={openFilter === "guests"}
                onClose={onClose}
                value={filters.guests}
                onChange={(value) => setFilters({ ...filters, guests: value })}
            />
            <CostFilter
                isOpen={openFilter === "cost"}
                onClose={onClose}
                value={filters.cost}
                onChange={(value) => setFilters({ ...filters, cost: value })}
            />
            <StatusFilter
                isOpen={openFilter === "status"}
                onClose={onClose}
                selectedStatuses={filters.statuses}
                onChange={(statuses) => setFilters({ ...filters, statuses })}
            />
            <RequestsFilter
                isOpen={openFilter === "requests"}
                onClose={onClose}
                selectedOptions={filters.requestOptions}
                onChange={(requestOptions) => setFilters({ ...filters, requestOptions })}
            />
            <DatesFilter
                isOpen={openFilter === "dates"}
                onClose={onClose}
                label="Stay Dates"
                value={filters.stayDates}
                onChange={(stayDates) => setFilters({ ...filters, stayDates })}
            />
            <DatesFilter
                isOpen={openFilter === "bookedDate"}
                onClose={onClose}
                label="Booking Date"
                value={filters.bookedDate}
                onChange={(bookedDate) => setFilters({ ...filters, bookedDate })}
            />
        </>
    );
}
