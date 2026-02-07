"use client";

import { Booking, Room } from "@/types";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/priceCalculator";
import { X, Calendar, Users, Mail, User, CreditCard, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface BookingDetailsModalProps {
    booking: Booking;
    room?: Room;
    onClose: () => void;
}

export function BookingDetailsModal({ booking, room, onClose }: BookingDetailsModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="p-6 border-b border-[var(--color-sand)] flex justify-between items-start bg-[var(--color-warm-white)]">
                    <div>
                        <h2 className="text-xl font-bold font-montserrat text-[var(--color-aegean-blue)]">Booking Details</h2>
                        <p className="text-sm opacity-60 font-mono mt-1">ID: {booking.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X className="h-5 w-5 opacity-60" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    {/* Status Banner */}
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Status</p>
                            <Badge
                                variant="outline"
                                className={
                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                            'bg-gray-100 text-gray-600 border-gray-200'
                                }
                            >
                                {booking.status.toUpperCase()}
                            </Badge>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Booked On</p>
                            <div className="flex items-center gap-1 text-sm">
                                <Clock className="h-3 w-3 opacity-40" />
                                {format(new Date(booking.createdAt), "MMM d, yyyy h:mm a")}
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
                                    <span className="block text-xs opacity-50 uppercase tracking-wide">Namme</span>
                                    <span className="font-medium text-lg">{booking.guestName}</span>
                                </div>
                                <div>
                                    <span className="block text-xs opacity-50 uppercase tracking-wide">Email</span>
                                    <a href={`mailto:${booking.guestEmail}`} className="flex items-center gap-2 text-[var(--color-aegean-blue)] hover:underline">
                                        <Mail className="h-3 w-3" /> {booking.guestEmail}
                                    </a>
                                </div>
                                {booking.guestPhone && (
                                    <div>
                                        <span className="block text-xs opacity-50 uppercase tracking-wide">Phone</span>
                                        <a href={`tel:${booking.guestPhone}`} className="flex items-center gap-2 text-[var(--color-aegean-blue)] hover:underline">
                                            <span className="h-3 w-3">📞</span> {booking.guestPhone}
                                        </a>
                                    </div>
                                )}
                                <div>
                                    <span className="block text-xs opacity-50 uppercase tracking-wide">Party Size</span>
                                    <span className="flex items-center gap-2">
                                        <Users className="h-3 w-3 opacity-50" /> {booking.guestsCount} Guests
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stay Info */}
                        <div className="space-y-4">
                            <h3 className="font-bold border-b border-[var(--color-sand)] pb-2 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-[var(--color-aegean-blue)]" /> Stay Details
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="block text-xs opacity-50 uppercase tracking-wide">Room</span>
                                    <span className="font-medium text-lg">{room?.name || "Unknown Room"}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="block text-xs opacity-50 uppercase tracking-wide">Check-in</span>
                                        <span className="font-medium">{format(new Date(booking.checkIn), "MMM d, yyyy")}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs opacity-50 uppercase tracking-wide">Check-out</span>
                                        <span className="font-medium">{format(new Date(booking.checkOut), "MMM d, yyyy")}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-xs opacity-50 uppercase tracking-wide">Total Amount</span>
                                    <span className="font-bold text-xl font-mono flex items-center gap-2 text-[var(--color-aegean-blue)]">
                                        <CreditCard className="h-4 w-4 opacity-50" />
                                        {formatCurrency(booking.totalPrice)}
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
                    {/* Could add actionable buttons here like 'Send Email' or 'Print' */}
                </div>
            </div>
        </div>
    );
}
