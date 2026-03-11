
import { Booking, RoomSummary, ContactRequest } from "@/types";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/priceCalculator";
import { Badge } from "@/components/ui/Badge";
import { Eye, Trash2, XCircle } from "lucide-react";
import { adminDeleteBookingAction, adminCancelBookingAction } from "@/app/actions/bookings";
import { useToast } from "@/contexts/ToastContext";
import { FilterableHeader } from "./FilterableHeader";
import { RequestBadge } from "./RequestBadge";
import { getStatusColor, getStatusLabel } from "@/lib/constants/statusStyles";
import { getRoomName } from "@/lib/filterHelpers";
import { FilterKey, SortConfig } from "@/hooks/useBookingFilters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/admin/Table";
import { AdminActionButton } from "@/components/ui/admin/AdminActionButton";

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

import { usePermission } from "@/contexts/PermissionContext";

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
    const { can } = usePermission();

    return (
        <div className="hidden md:block">
            <Table>
                <TableHeader>
                    <TableRow>
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
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bookings.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="h-24 text-center text-[var(--color-charcoal)]/60 italic">
                                No bookings match the current filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        bookings.map((booking) => {
                            const bookingRequests = requestsByBookingId.get(booking.id) || [];
                            return (
                                <TableRow key={booking.id}>
                                    <TableCell className="whitespace-nowrap">
                                        <code className="text-xs font-mono text-[var(--color-charcoal)]/70 bg-[var(--color-warm-white)] px-1.5 py-0.5 rounded">
                                            {booking.id.slice(0, 8)}
                                        </code>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div className="font-bold text-[var(--color-aegean-blue)]">{booking.guestName}</div>
                                        <div className="text-xs text-[var(--color-charcoal)]/60">{booking.guestEmail}</div>
                                    </TableCell>
                                    <TableCell className="font-medium whitespace-nowrap">
                                        {getRoomName(rooms, booking.roomId)}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span>{format(new Date(booking.checkIn), "MMM d, yyyy")}</span>
                                            <span className="text-[10px] text-[var(--color-charcoal)]/50">to</span>
                                            <span>{format(new Date(booking.checkOut), "MMM d, yyyy")}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {booking.guestsCount}
                                    </TableCell>
                                    <TableCell className="font-mono font-bold whitespace-nowrap">
                                        {formatCurrency(booking.totalPrice)}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <Badge
                                            variant="outline"
                                            className={getStatusColor(booking.status, 'booking')}
                                        >
                                            {getStatusLabel(booking.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <RequestBadge
                                            requests={bookingRequests}
                                            onClick={() => {
                                                const pending = bookingRequests.find(r => r.status === "pending");
                                                if (pending) onSelectRequest(pending);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="text-sm text-[var(--color-charcoal)]/70 whitespace-nowrap">
                                        {format(new Date(booking.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <AdminActionButton
                                                icon={Eye}
                                                onClick={() => onSelectBooking(booking)}
                                                tooltip="View Details"
                                                variant="secondary"
                                            />

                                            {can('bookings.delete') && (
                                                <AdminActionButton
                                                    icon={Trash2}
                                                    variant="destructive"
                                                    tooltip="Delete Booking"
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
                                                />
                                            )}

                                            {booking.status === 'confirmed' && can('bookings.cancel') && (
                                                <AdminActionButton
                                                    icon={XCircle}
                                                    variant="destructive"
                                                    tooltip="Cancel Booking"
                                                    className="bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 hover:border-red-200" // Custom style overriding standard destructive if needed, or just rely on variant
                                                    onClick={async () => {
                                                        if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
                                                            await adminCancelBookingAction(booking.id);
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
