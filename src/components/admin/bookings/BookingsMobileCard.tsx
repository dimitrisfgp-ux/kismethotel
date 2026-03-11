"use client";

import { Booking } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import { getStatusColor, getStatusLabel } from "@/lib/constants/statusStyles";
import { Eye, Trash2, XCircle, ImageOff } from "lucide-react";
import Image from "next/image";
import { adminDeleteBookingAction, adminCancelBookingAction } from "@/app/actions/bookings";
import { useToast } from "@/contexts/ToastContext";

interface BookingsMobileCardProps {
    booking: Booking;
    roomName: string;
    roomImage?: string;
    requestCount: number;
    userRole: string;
    onViewQuery: () => void;
    onViewDetails: () => void;
}

import { usePermission } from "@/contexts/PermissionContext";

export function BookingsMobileCard({
    booking,
    roomName,
    roomImage,
    requestCount,
    userRole,
    onViewQuery,
    onViewDetails
}: BookingsMobileCardProps) {
    const { showToast } = useToast();
    const { can } = usePermission();

    return (
        <div className="bg-white p-3 rounded-lg border border-[var(--color-sand)] shadow-sm space-y-2">
            <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-[var(--color-sand)]/50">
                    {roomImage ? (
                        <Image
                            src={roomImage}
                            alt={roomName}
                            fill
                            className="object-cover"
                            sizes="64px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-charcoal)]/20">
                            <ImageOff className="h-5 w-5" />
                        </div>
                    )}
                </div>

                {/* Header Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 pr-1">
                            <div className="font-bold text-[var(--color-aegean-blue)] truncate text-sm leading-tight">
                                {booking.guestName}
                            </div>
                            <div className="text-[10px] text-[var(--color-charcoal)]/60 truncate mt-0.5">
                                {roomName}
                            </div>
                        </div>
                        <Badge variant="outline" className={`${getStatusColor(booking.status, 'booking')} shrink-0 text-[9px] px-1.5 py-0.5 h-auto uppercase tracking-wide`}>
                            {getStatusLabel(booking.status)}
                        </Badge>
                    </div>

                    <div className="flex justify-between items-end mt-1">
                        <div className="text-[10px] text-[var(--color-charcoal)]/70">
                            <span className="font-mono bg-gray-50 px-1 rounded">{booking.id.slice(0, 8)}</span>
                        </div>
                        <div className="text-right leading-none">
                            <div className="text-sm font-bold text-[var(--color-aegean-blue)]">
                                {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(booking.totalPrice)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dates Row */}
            <div className="flex justify-between items-center border-t border-[var(--color-sand)]/50 pt-2 text-xs text-[var(--color-charcoal)]/80">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <span className="text-[var(--color-charcoal)]/40 uppercase text-[9px] font-bold tracking-wider">In</span>
                        <span className="font-medium">{format(new Date(booking.checkIn), "dd MMM")}</span>
                    </div>
                    <span className="text-[var(--color-charcoal)]/20">•</span>
                    <div className="flex items-center gap-1">
                        <span className="text-[var(--color-charcoal)]/40 uppercase text-[9px] font-bold tracking-wider">Out</span>
                        <span className="font-medium">{format(new Date(booking.checkOut), "dd MMM")}</span>
                    </div>
                </div>
                <div className="text-[10px] text-[var(--color-charcoal)]/60">
                    {booking.guestsCount} Guest{booking.guestsCount !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Requests Notification */}
            {requestCount > 0 && (
                <button
                    onClick={(e) => { e.stopPropagation(); onViewQuery(); }}
                    className="w-full bg-amber-50 text-amber-700 text-xs px-2 py-1.5 rounded flex items-center justify-between border border-amber-100 font-medium active:bg-amber-100 transition-colors"
                >
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        {requestCount} Pending Request{requestCount !== 1 ? 's' : ''}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-600/80">View</span>
                </button>
            )}

            {/* Compact Actions */}
            <div className="flex gap-2 pt-2 border-t border-[var(--color-sand)]/30 mt-1">
                {/* Secondary Actions (Icon Only) */}
                {can('bookings.delete') && (
                    <button
                        onClick={async (e) => {
                            e.stopPropagation();
                            if (confirm('Delete booking?')) {
                                try {
                                    await adminDeleteBookingAction(booking.id);
                                    showToast('Booking deleted', 'success');
                                } catch (error) {
                                    showToast('Failed to delete', 'error');
                                }
                            }
                        }}
                        className="h-8 w-8 flex items-center justify-center text-gray-400 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded border border-transparent hover:border-red-100 transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}

                {booking.status === 'confirmed' && can('bookings.cancel') && (
                    <button
                        onClick={async (e) => {
                            e.stopPropagation();
                            if (confirm('Cancel booking?')) {
                                try {
                                    await adminCancelBookingAction(booking.id);
                                    showToast('Booking cancelled', 'success');
                                } catch (error) {
                                    showToast('Failed to cancel', 'error');
                                }
                            }
                        }}
                        className="h-8 w-8 flex items-center justify-center text-red-400 bg-red-50 hover:bg-red-100 hover:text-red-600 rounded border border-transparent hover:border-red-200 transition-colors"
                        title="Cancel"
                    >
                        <XCircle className="h-4 w-4" />
                    </button>
                )}

                {/* Primary Action */}
                <button
                    onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
                    className="flex-1 h-8 bg-[var(--color-aegean-blue)] text-white rounded text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 active:bg-[var(--color-aegean-blue)]/90 transition-colors shadow-sm"
                >
                    <Eye className="h-3 w-3" />
                    Details
                </button>
            </div>
        </div>
    );
}
