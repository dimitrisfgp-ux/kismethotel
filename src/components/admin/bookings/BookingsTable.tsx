"use client";

import { useState } from "react";
import { Booking, Room } from "@/types";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/priceCalculator";
import { Badge } from "@/components/ui/Badge";
import { Eye, XCircle } from "lucide-react";
import { cancelBookingAction } from "@/app/actions";
import { BookingDetailsModal } from "./BookingDetailsModal";

interface BookingsTableProps {
    bookings: Booking[];
    rooms: Room[];
}

export function BookingsTable({ bookings, rooms }: BookingsTableProps) {
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const getRoomName = (id: string) => {
        return rooms.find(r => r.id === id)?.name || "Unknown Room";
    };

    if (bookings.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-[var(--color-sand)] rounded-lg">
                <p className="text-[var(--color-charcoal)]/60 italic">No confirmed bookings found.</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg border border-[var(--color-sand)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[var(--color-warm-white)] border-b border-[var(--color-sand)]">
                            <tr>
                                <th className="p-4 font-bold text-[var(--color-charcoal)]">Details</th>
                                <th className="p-4 font-bold text-[var(--color-charcoal)]">Room</th>
                                <th className="p-4 font-bold text-[var(--color-charcoal)]">Dates</th>
                                <th className="p-4 font-bold text-[var(--color-charcoal)]">Guests</th>
                                <th className="p-4 font-bold text-[var(--color-charcoal)]">Total</th>
                                <th className="p-4 font-bold text-[var(--color-charcoal)]">Status</th>
                                <th className="p-4 font-bold text-[var(--color-charcoal)] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-sand)]">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-[var(--color-warm-white)]/20 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-[var(--color-aegean-blue)]">{booking.guestName}</div>
                                        <div className="text-xs text-[var(--color-charcoal)]/60">{booking.guestEmail}</div>
                                    </td>
                                    <td className="p-4 font-medium">
                                        {getRoomName(booking.roomId)}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span>{format(new Date(booking.checkIn), "MMM d, yyyy")}</span>
                                            <span className="text-[10px] text-[var(--color-charcoal)]/50">to</span>
                                            <span>{format(new Date(booking.checkOut), "MMM d, yyyy")}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {booking.guestsCount}
                                    </td>
                                    <td className="p-4 font-mono font-bold">
                                        {formatCurrency(booking.totalPrice)}
                                    </td>
                                    <td className="p-4">
                                        <Badge
                                            variant="outline"
                                            className={booking.status === 'confirmed'
                                                ? 'bg-green-100 text-green-700 border-green-200'
                                                : booking.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-700 border-red-200'
                                                    : 'bg-gray-100 text-gray-600 border-gray-200'}
                                        >
                                            {booking.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button
                                                onClick={() => setSelectedBooking(booking)}
                                                className="p-1.5 text-[var(--color-aegean-blue)] hover:bg-[var(--color-aegean-blue)]/5 rounded-md transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>

                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
                                                            await cancelBookingAction(booking.id);
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            {selectedBooking && (
                <BookingDetailsModal
                    booking={selectedBooking}
                    room={rooms.find(r => r.id === selectedBooking.roomId)}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </>
    );
}
