
import { Booking, RoomSummary } from "@/types";
import { BookingFilters } from "@/hooks/useBookingFilters";
import { formatCurrency } from "@/lib/priceCalculator";
import { format } from "date-fns";
import { RotateCcw, X } from "lucide-react";
import { useMemo } from "react";

interface BookingsFilterBarProps {
    filters: BookingFilters;
    setFilters: (filters: BookingFilters) => void;
    filteredCount: number;
    totalCount: number;
    hasActiveFilters: boolean;
    clearFilters: () => void;
    rooms: RoomSummary[];
}

export function BookingsFilterBar({
    filters,
    setFilters,
    filteredCount,
    totalCount,
    hasActiveFilters,
    clearFilters,
    rooms
}: BookingsFilterBarProps) {

    // Helper to remove a specific filter
    const removeFilter = (type: string, value?: any) => {
        const newFilters = { ...filters };
        switch (type) {
            case "bookingId":
                newFilters.bookingId = "";
                break;
            case "details":
                if (value && typeof value === 'string') newFilters.details = { ...newFilters.details, [value]: undefined };
                else newFilters.details = {};
                break;
            case "room":
                newFilters.roomIds = newFilters.roomIds.filter(id => id !== value);
                break;
            case "guests":
                newFilters.guests = null;
                break;
            case "cost":
                newFilters.cost = null;
                break;
            case "status":
                newFilters.statuses = newFilters.statuses.filter(s => s !== value);
                break;
            case "requests":
                newFilters.requestOptions = newFilters.requestOptions.filter(o => o !== value);
                break;
            case "stayDates":
                newFilters.stayDates = null;
                break;
            case "bookedDate":
                newFilters.bookedDate = null;
                break;
        }
        setFilters(newFilters);
    };

    // Generate tags for active filters
    const activeTags = useMemo(() => {
        const tags: { id: string; label: React.ReactNode; onRemove: () => void }[] = [];

        if (filters.bookingId) {
            tags.push({ id: 'bid', label: `ID: ${filters.bookingId}`, onRemove: () => removeFilter("bookingId") });
        }
        if (filters.details.name) tags.push({ id: 'd-name', label: `Name: ${filters.details.name}`, onRemove: () => removeFilter("details", "name") });
        if (filters.details.email) tags.push({ id: 'd-email', label: `Email: ${filters.details.email}`, onRemove: () => removeFilter("details", "email") });
        if (filters.details.phone) tags.push({ id: 'd-phone', label: `Phone: ${filters.details.phone}`, onRemove: () => removeFilter("details", "phone") });

        filters.roomIds.forEach((id: string) => {
            const roomName = rooms.find(r => r.id === id)?.name || id;
            tags.push({ id: `room-${id}`, label: roomName, onRemove: () => removeFilter("room", id) });
        });

        if (filters.guests) {
            const { operator, value, value2 } = filters.guests;
            let label = `Guests ${operator} ${value}`;
            if (operator === "between") label = `Guests: ${value}-${value2}`;
            tags.push({ id: 'guests', label, onRemove: () => removeFilter("guests") });
        }

        if (filters.cost) {
            const { operator, value, value2 } = filters.cost;
            let label = `Total ${operator} ${formatCurrency(value)}`;
            if (operator === "between") label = `Total: ${formatCurrency(value)} - ${formatCurrency(value2 || 0)}`;
            tags.push({ id: 'cost', label, onRemove: () => removeFilter("cost") });
        }

        filters.statuses.forEach((status: string) => {
            tags.push({ id: `status-${status}`, label: status, onRemove: () => removeFilter("status", status) });
        });

        filters.requestOptions.forEach((opt: string) => {
            tags.push({ id: `req-${opt}`, label: `Request: ${opt}`, onRemove: () => removeFilter("requests", opt) });
        });

        if (filters.stayDates && filters.stayDates.from) {
            let label = `Dates: ${format(filters.stayDates.from, "MMM d")}`;
            if (filters.stayDates.to) label += ` - ${format(filters.stayDates.to, "MMM d")}`;
            tags.push({ id: 'stayDates', label, onRemove: () => removeFilter("stayDates") });
        }

        if (filters.bookedDate && filters.bookedDate.from) {
            let label = `Booked: ${format(filters.bookedDate.from, "MMM d")}`;
            if (filters.bookedDate.to) label += ` - ${format(filters.bookedDate.to, "MMM d")}`;
            tags.push({ id: 'bookedDate', label, onRemove: () => removeFilter("bookedDate") });
        }

        return tags;
    }, [filters, rooms]);

    if (!hasActiveFilters) return null;

    return (
        <div className="mb-4 space-y-3 bg-[var(--color-aegean-blue)]/5 border border-[var(--color-aegean-blue)]/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-aegean-blue)] font-medium">
                    Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> bookings
                </span>
                <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs font-bold text-[var(--color-aegean-blue)] hover:underline uppercase tracking-wider"
                >
                    <RotateCcw className="h-3 w-3" />
                    Clear all
                </button>
            </div>

            {/* Active Filter Chips */}
            <div className="flex flex-wrap gap-2">
                {activeTags.map(tag => (
                    <span
                        key={tag.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[var(--color-aegean-blue)]/30 text-[var(--color-aegean-blue)] text-xs font-medium shadow-sm transition-all hover:border-[var(--color-aegean-blue)]"
                    >
                        {tag.label}
                        <button
                            onClick={tag.onRemove}
                            className="p-0.5 hover:bg-[var(--color-aegean-blue)]/10 rounded-full transition-colors"
                            aria-label="Remove filter"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}
