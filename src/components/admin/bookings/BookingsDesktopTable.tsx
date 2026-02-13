
import { Booking, RoomSummary, ContactRequest } from "@/types";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/priceCalculator";
import { Badge } from "@/components/ui/Badge";
import { Eye, Trash2, XCircle } from "lucide-react";
import { adminDeleteBookingAction, adminCancelBookingAction } from "@/app/actions/bookings";
import { useToast } from "@/contexts/ToastContext";
import { FilterableHeader } from "./FilterableHeader";
import { RequestBadge } from "./RequestBadge";
import { getStatusColor } from "@/lib/constants/statusStyles";
import { FilterKey, SortConfig } from "@/hooks/useBookingFilters";

interface BookingsDesktopTableProps {
    bookings: Booking[];
    requestsByBookingId: Map<string, ContactRequest[]>;
    rooms: RoomSummary[];
    userRole: string;
    onSelectBooking: (booking: Booking) => void;
    onSelectRequest: (request: ContactRequest) => void;
    isFilterActive: (key: FilterKey) => boolean;
    setOpenFilter: (key: FilterKey) => void;
    sortConfig: SortConfig | null;
    cycleSort: (key: string) => void;
}

export function BookingsDesktopTable({
    bookings,
    requestsByBookingId,
    rooms,
    userRole,
    onSelectBooking,
    onSelectRequest,
    isFilterActive,
    setOpenFilter,
    sortConfig,
    cycleSort
}: BookingsDesktopTableProps) {
    const { showToast } = useToast();

    const getRoomName = (id: string) => {
        return rooms.find(r => r.id === id)?.name || "Unknown Room";
    };

    return (
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-[var(--color-warm-white)] border-b border-[var(--color-sand)]">
                    <tr>
                        <FilterableHeader
                            label="Booking ID"
                            isActive={isFilterActive("bookingId")}
                            onClick={() => setOpenFilter("bookingId")}
                        />
                        <FilterableHeader
                            label="Details"
                            isActive={isFilterActive("details")}
                            onClick={() => setOpenFilter("details")}
                            sortable
                            sortDirection={sortConfig?.key === "guestName" ? sortConfig.direction : null}
                            onSort={() => cycleSort("guestName")}
                        />
                        <FilterableHeader
                            label="Room"
                            isActive={isFilterActive("room")}
                            onClick={() => setOpenFilter("room")}
                            sortable
                            sortDirection={sortConfig?.key === "roomName" ? sortConfig.direction : null}
                            onSort={() => cycleSort("roomName")}
                        />
                        <FilterableHeader
                            label="Dates"
                            isActive={isFilterActive("dates")}
                            onClick={() => setOpenFilter("dates")}
                            sortable
                            sortDirection={sortConfig?.key === "checkIn" ? sortConfig.direction : null}
                            onSort={() => cycleSort("checkIn")}
                        />
                        <FilterableHeader
                            label="Guests"
                            isActive={isFilterActive("guests")}
                            onClick={() => setOpenFilter("guests")}
                            sortable
                            sortDirection={sortConfig?.key === "guestsCount" ? sortConfig.direction : null}
                            onSort={() => cycleSort("guestsCount")}
                        />
                        <FilterableHeader
                            label="Total"
                            isActive={isFilterActive("cost")}
                            onClick={() => setOpenFilter("cost")}
                            sortable
                            sortDirection={sortConfig?.key === "totalPrice" ? sortConfig.direction : null}
                            onSort={() => cycleSort("totalPrice")}
                        />
                        <FilterableHeader
                            label="Status"
                            isActive={isFilterActive("status")}
                            onClick={() => setOpenFilter("status")}
                        />
                        <FilterableHeader
                            label="Requests"
                            isActive={isFilterActive("requests")}
                            onClick={() => setOpenFilter("requests")}
                        />
                        <FilterableHeader
                            label="Booked"
                            isActive={isFilterActive("bookedDate")}
                            onClick={() => setOpenFilter("bookedDate")}
                            sortable
                            sortDirection={sortConfig?.key === "createdAt" ? sortConfig.direction : null}
                            onSort={() => cycleSort("createdAt")}
                        />
                        <th className="p-4 font-bold text-[var(--color-charcoal)] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-sand)]">
                    {bookings.length === 0 ? (
                        <tr>
                            <td colSpan={10} className="p-8 text-center text-[var(--color-charcoal)]/60 italic">
                                No bookings match the current filters.
                            </td>
                        </tr>
                    ) : (
                        bookings.map((booking) => {
                            const bookingRequests = requestsByBookingId.get(booking.id) || [];
                            return (
                                <tr key={booking.id} className="hover:bg-[var(--color-warm-white)]/20 transition-colors">
                                    <td className="p-4 whitespace-nowrap">
                                        <code className="text-xs font-mono text-[var(--color-charcoal)]/70 bg-[var(--color-warm-white)] px-1.5 py-0.5 rounded">
                                            {booking.id}
                                        </code>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        <div className="font-bold text-[var(--color-aegean-blue)]">{booking.guestName}</div>
                                        <div className="text-xs text-[var(--color-charcoal)]/60">{booking.guestEmail}</div>
                                    </td>
                                    <td className="p-4 font-medium whitespace-nowrap">
                                        {getRoomName(booking.roomId)}
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span>{format(new Date(booking.checkIn), "MMM d, yyyy")}</span>
                                            <span className="text-[10px] text-[var(--color-charcoal)]/50">to</span>
                                            <span>{format(new Date(booking.checkOut), "MMM d, yyyy")}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        {booking.guestsCount}
                                    </td>
                                    <td className="p-4 font-mono font-bold whitespace-nowrap">
                                        {formatCurrency(booking.totalPrice)}
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        <Badge
                                            variant="outline"
                                            className={getStatusColor(booking.status, 'booking')}
                                        >
                                            {booking.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        <RequestBadge
                                            requests={bookingRequests}
                                            onClick={() => {
                                                const pending = bookingRequests.find(r => r.status === "pending");
                                                if (pending) onSelectRequest(pending);
                                            }}
                                        />
                                    </td>
                                    <td className="p-4 text-sm text-[var(--color-charcoal)]/70 whitespace-nowrap">
                                        {format(new Date(booking.createdAt), "MMM d, yyyy")}
                                    </td>
                                    <td className="p-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onSelectBooking(booking)}
                                                className="p-1.5 text-[var(--color-aegean-blue)] hover:bg-[var(--color-aegean-blue)]/5 rounded-md transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>

                                            {userRole === 'admin' && (
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
                                                            try {
                                                                await adminDeleteBookingAction(booking.id);
                                                                showToast('Booking deleted successfully', 'success');
                                                            } catch (error: any) {
                                                                showToast(error.message, 'error');
                                                            }
                                                        }
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Delete Booking (Admin Only)"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}

                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
                                                            await adminCancelBookingAction(booking.id);
                                                        }
                                                    }}
                                                    className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                                                    title="Cancel Booking"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
