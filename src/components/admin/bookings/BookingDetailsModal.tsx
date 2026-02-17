"use client";

import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";

import { useState, useEffect } from "react";
import { Booking, RoomSummary } from "@/types";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/priceCalculator";
import { X, Calendar, Users, Mail, User, CreditCard, Clock, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Calendar as CalendarComponent } from "@/components/ui/Calendar";
import { updateBookingDatesAction } from "@/app/actions/bookings";
import { useToast } from "@/contexts/ToastContext";
import { getStatusColor } from "@/lib/constants/statusStyles";
import { formatLocalDate } from "@/lib/dateUtils";
import { DEFAULT_CHECK_IN_TIME, DEFAULT_CHECK_OUT_TIME } from "@/lib/constants";
import { usePermission } from "@/contexts/PermissionContext";
import { useRoomAvailability } from "@/hooks/useRoomAvailability";

interface BookingDetailsModalProps {
    booking: Booking;
    room?: RoomSummary;
    onClose: () => void;
}

export function BookingDetailsModal({ booking, room, onClose }: BookingDetailsModalProps) {
    const { can } = usePermission();
    const [isEditingDates, setIsEditingDates] = useState(false);

    // Fix: Correctly use the hook
    // We pass roomId only when editing starts to trigger the fetch
    const { unavailableDates, isLoading: isLoadingAvailability } = useRoomAvailability(
        isEditingDates ? booking.roomId : undefined
    );

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(booking.checkIn),
        to: new Date(booking.checkOut)
    });

    const [isSaving, setIsSaving] = useState(false);
    const [localBooking, setLocalBooking] = useState(booking);
    const { showToast } = useToast();

    const handleSaveDates = async () => {
        if (!dateRange?.from || !dateRange?.to) return;

        setIsSaving(true);
        const success = await updateBookingDatesAction(
            localBooking.id,
            formatLocalDate(dateRange.from),
            formatLocalDate(dateRange.to)
        );

        if (success) {
            setLocalBooking({
                ...localBooking,
                checkIn: formatLocalDate(dateRange.from),
                checkOut: formatLocalDate(dateRange.to)
            });
            setIsEditingDates(false);
            showToast("Booking dates updated", "success");
        } else {
            showToast("Failed to update dates. Dates may be unavailable.", "error");
        }
        setIsSaving(false);
    };

    return (

        <Modal isOpen={true} onClose={onClose} size="lg">
            <ModalHeader onClose={onClose} className="bg-[var(--color-warm-white)]">
                <div>
                    <h2 className="text-xl font-bold font-montserrat text-[var(--color-aegean-blue)]">Booking Details</h2>
                    <p className="text-sm opacity-60 font-mono mt-1 font-normal text-gray-500">ID: {localBooking.id}</p>
                </div>
            </ModalHeader>

            <ModalBody className="space-y-8">
                {/* Status Banner */}
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Status</p>
                        <Badge
                            variant="outline"
                            className={getStatusColor(localBooking.status, 'booking')}
                        >
                            {localBooking.status.toUpperCase()}
                        </Badge>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Booked On</p>
                        <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3 opacity-40" />
                            {format(new Date(localBooking.createdAt), "MMM d, yyyy h:mm a")}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Guest Info */}
                    <div className="space-y-4">
                        <h3 className="font-bold border-b border-[var(--color-sand)] pb-2 flex items-center gap-2">
                            <User className="h-4 w-4 text-[var(--color-aegean-blue)]" /> Guest Information
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="block text-xs opacity-50 uppercase tracking-wide">Name</span>
                                <span className="font-medium text-lg">{localBooking.guestName}</span>
                            </div>
                            <div>
                                <span className="block text-xs opacity-50 uppercase tracking-wide">Email</span>
                                <a href={`mailto:${localBooking.guestEmail}`} className="flex items-center gap-2 text-[var(--color-aegean-blue)] hover:underline">
                                    <Mail className="h-3 w-3" /> {localBooking.guestEmail}
                                </a>
                            </div>
                            {localBooking.guestPhone && (
                                <div>
                                    <span className="block text-xs opacity-50 uppercase tracking-wide">Phone</span>
                                    <a href={`tel:${localBooking.guestPhone}`} className="flex items-center gap-2 text-[var(--color-aegean-blue)] hover:underline">
                                        <span className="h-3 w-3">📞</span> {localBooking.guestPhone}
                                    </a>
                                </div>
                            )}
                            <div>
                                <span className="block text-xs opacity-50 uppercase tracking-wide">Party Size</span>
                                <span className="flex items-center gap-2">
                                    <Users className="h-3 w-3 opacity-50" /> {localBooking.guestsCount} Guests
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stay Info */}
                    <div className="space-y-4">
                        <h3 className="font-bold border-b border-[var(--color-sand)] pb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-[var(--color-aegean-blue)]" /> Stay Details
                            </span>
                            {/* FIX: Check for 'bookings.edit' instead of 'bookings.manage' to match Role */}
                            {localBooking.status === 'confirmed' && !isEditingDates && can('bookings.edit') && (
                                <button
                                    onClick={() => setIsEditingDates(true)}
                                    className="text-xs text-[var(--color-aegean-blue)] hover:underline flex items-center gap-1"
                                >
                                    <Pencil className="h-3 w-3" /> Edit Dates
                                </button>
                            )}
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="block text-xs opacity-50 uppercase tracking-wide">Room</span>
                                <span className="font-medium text-lg">{room?.name || "Unknown Room"}</span>
                            </div>

                            {isEditingDates ? (
                                <div className="space-y-3">
                                    <div className="border border-[var(--color-sand)] rounded-lg p-2">
                                        <CalendarComponent
                                            mode="range"
                                            selected={dateRange}
                                            onSelect={setDateRange}
                                            numberOfMonths={1}
                                            className="calendar-light"
                                            disabled={unavailableDates} // Use hook data directly (Date[])
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setIsEditingDates(false);
                                                setDateRange({
                                                    from: new Date(localBooking.checkIn),
                                                    to: new Date(localBooking.checkOut)
                                                });
                                            }}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSaveDates}
                                            isLoading={isSaving}
                                            disabled={!dateRange?.from || !dateRange?.to}
                                            className="flex-1"
                                        >
                                            Save Dates
                                        </Button>
                                    </div>
                                </div>
                            ) : (


                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="block text-xs opacity-50 uppercase tracking-wide">Check-in</span>
                                        <span className="font-medium block">{format(new Date(localBooking.checkIn), "MMM d, yyyy")}</span>
                                        <span className="text-xs text-[var(--color-charcoal)]/60">
                                            from {new Date(`2000-01-01T${room?.checkInTime || DEFAULT_CHECK_IN_TIME}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-xs opacity-50 uppercase tracking-wide">Check-out</span>
                                        <span className="font-medium block">{format(new Date(localBooking.checkOut), "MMM d, yyyy")}</span>
                                        <span className="text-xs text-[var(--color-charcoal)]/60">
                                            by {new Date(`2000-01-01T${room?.checkOutTime || DEFAULT_CHECK_OUT_TIME}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <span className="block text-xs opacity-50 uppercase tracking-wide">Total Amount</span>
                                <span className="font-bold text-xl font-mono flex items-center gap-2 text-[var(--color-aegean-blue)]">
                                    <CreditCard className="h-4 w-4 opacity-50" />
                                    {formatCurrency(localBooking.totalPrice)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalBody>

            <ModalFooter className="bg-[var(--color-warm-white)]/50">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-black/5 rounded-md transition-colors">
                    Close
                </button>
            </ModalFooter>
        </Modal>
    );
}
