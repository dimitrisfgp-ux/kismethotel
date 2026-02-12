"use client";

import { useState } from "react";
import { Booking, RoomSummary } from "@/types";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/priceCalculator";
import { X, Calendar, Users, Mail, User, CreditCard, Clock, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Calendar as CalendarComponent } from "@/components/ui/Calendar";
import { updateBookingDatesAction } from "@/app/actions/booking";
import { useToast } from "@/contexts/ToastContext";
import { getStatusColor } from "@/lib/constants/statusStyles";
import { formatLocalDate } from "@/lib/dateUtils";

interface BookingDetailsModalProps {
    booking: Booking;
    room?: RoomSummary;
    onClose: () => void;
}

export function BookingDetailsModal({ booking, room, onClose }: BookingDetailsModalProps) {
    const [isEditingDates, setIsEditingDates] = useState(false);
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
            showToast("Failed to update dates", "error");
        }
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-[var(--color-sand)] flex justify-between items-start bg-[var(--color-warm-white)]">
                    <div>
                        <h2 className="text-xl font-bold font-montserrat text-[var(--color-aegean-blue)]">Booking Details</h2>
                        <p className="text-sm opacity-60 font-mono mt-1">ID: {localBooking.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X className="h-5 w-5 opacity-60" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
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
                                {localBooking.status === 'confirmed' && !isEditingDates && (
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
                                            <span className="font-medium">{format(new Date(localBooking.checkIn), "MMM d, yyyy")}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs opacity-50 uppercase tracking-wide">Check-out</span>
                                            <span className="font-medium">{format(new Date(localBooking.checkOut), "MMM d, yyyy")}</span>
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
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-[var(--color-warm-white)]/50 border-t border-[var(--color-sand)] flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-black/5 rounded-md transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
