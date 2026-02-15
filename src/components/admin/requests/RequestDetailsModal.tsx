"use client";

import { ContactRequest, Booking } from "@/types";
import { format } from "date-fns";
import { X, Calendar, User, Mail, Phone, MessageSquare, Clock, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SUBJECT_LABELS, SUBJECT_COLORS } from "@/lib/constants/requestStyles";
import { getStatusColor } from "@/lib/constants/statusStyles";
import { usePermission } from "@/contexts/PermissionContext";

interface RequestDetailsModalProps {
    request: ContactRequest;
    booking?: Booking;
    onClose: () => void;
    onApprove: () => Promise<void>;
    onDiscard: () => Promise<void>;
}

export function RequestDetailsModal({ request, booking, onClose, onApprove, onDiscard }: RequestDetailsModalProps) {
    const { can } = usePermission();
    const isPending = request.status === 'pending';
    const canAction = isPending && request.subject !== 'general' && can('requests.manage');
    const canHandleGeneral = isPending && request.subject === 'general' && can('requests.manage');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-[var(--color-sand)] flex justify-between items-start bg-[var(--color-warm-white)]">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold font-montserrat text-[var(--color-aegean-blue)]">Request Details</h2>
                            <Badge variant="outline" className={SUBJECT_COLORS[request.subject]}>
                                {SUBJECT_LABELS[request.subject]}
                            </Badge>
                        </div>
                        <p className="text-sm opacity-60 font-mono">ID: {request.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X className="h-5 w-5 opacity-60" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                    {/* Status & Date */}
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Status</p>
                            <Badge
                                variant="outline"
                                className={getStatusColor(request.status, 'request')}
                            >
                                {request.status.toUpperCase()}
                            </Badge>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Submitted</p>
                            <div className="flex items-center gap-1 text-sm">
                                <Clock className="h-3 w-3 opacity-40" />
                                {format(new Date(request.createdAt), "MMM d, yyyy h:mm a")}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h3 className="font-bold border-b border-[var(--color-sand)] pb-2 flex items-center gap-2">
                                <User className="h-4 w-4 text-[var(--color-aegean-blue)]" /> Contact Information
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="block text-xs opacity-50 uppercase tracking-wide">Name</span>
                                    <span className="font-medium text-lg">{request.name}</span>
                                </div>
                                <div>
                                    <span className="block text-xs opacity-50 uppercase tracking-wide">Email</span>
                                    <a href={`mailto:${request.email}`} className="flex items-center gap-2 text-[var(--color-aegean-blue)] hover:underline">
                                        <Mail className="h-3 w-3" /> {request.email}
                                    </a>
                                </div>
                                {request.phone && (
                                    <div>
                                        <span className="block text-xs opacity-50 uppercase tracking-wide">Phone</span>
                                        <a href={`tel:${request.phone}`} className="flex items-center gap-2 text-[var(--color-aegean-blue)] hover:underline">
                                            <Phone className="h-3 w-3" /> {request.phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Booking Info (if linked) */}
                        {booking && (
                            <div className="space-y-4">
                                <h3 className="font-bold border-b border-[var(--color-sand)] pb-2 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-[var(--color-aegean-blue)]" /> Linked Booking
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="block text-xs opacity-50 uppercase tracking-wide">Booking ID</span>
                                        <code className="font-mono text-xs bg-[var(--color-warm-white)] px-2 py-1 rounded">{booking.id}</code>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="block text-xs opacity-50 uppercase tracking-wide">
                                                {request.subject === 'reschedule' && request.status === 'approved' ? 'Original Check-in' : 'Current Check-in'}
                                            </span>
                                            <span className="font-medium">
                                                {request.subject === 'reschedule' && request.status === 'approved' && request.originalCheckIn
                                                    ? format(new Date(request.originalCheckIn), "MMM d, yyyy")
                                                    : format(new Date(booking.checkIn), "MMM d, yyyy")}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-xs opacity-50 uppercase tracking-wide">
                                                {request.subject === 'reschedule' && request.status === 'approved' ? 'Original Check-out' : 'Current Check-out'}
                                            </span>
                                            <span className="font-medium">
                                                {request.subject === 'reschedule' && request.status === 'approved' && request.originalCheckOut
                                                    ? format(new Date(request.originalCheckOut), "MMM d, yyyy")
                                                    : format(new Date(booking.checkOut), "MMM d, yyyy")}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-xs opacity-50 uppercase tracking-wide">Total</span>
                                        <span className="font-bold font-mono flex items-center gap-2 text-[var(--color-aegean-blue)]">
                                            <CreditCard className="h-4 w-4 opacity-50" /> €{booking.totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* New Dates (for reschedule) - Show as "Applied Dates" when approved */}
                    {request.subject === 'reschedule' && request.newCheckIn && request.newCheckOut && (
                        <div className={`${request.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'} border rounded-lg p-4`}>
                            <h4 className={`font-bold ${request.status === 'approved' ? 'text-green-800' : 'text-amber-800'} mb-2 flex items-center gap-2`}>
                                <Calendar className="h-4 w-4" />
                                {request.status === 'approved' ? 'Applied New Dates' : 'Requested New Dates'}
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-xs opacity-60 uppercase tracking-wide">New Check-in</span>
                                    <span className={`font-bold ${request.status === 'approved' ? 'text-green-900' : 'text-amber-900'}`}>
                                        {format(new Date(request.newCheckIn), "MMM d, yyyy")}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-xs opacity-60 uppercase tracking-wide">New Check-out</span>
                                    <span className={`font-bold ${request.status === 'approved' ? 'text-green-900' : 'text-amber-900'}`}>
                                        {format(new Date(request.newCheckOut), "MMM d, yyyy")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Message */}
                    <div className="space-y-2">
                        <h3 className="font-bold border-b border-[var(--color-sand)] pb-2 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-[var(--color-aegean-blue)]" /> Message
                        </h3>
                        <p className="text-sm whitespace-pre-wrap bg-[var(--color-warm-white)] p-4 rounded-lg">
                            {request.message || <span className="italic opacity-50">No message provided</span>}
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-[var(--color-warm-white)]/50 border-t border-[var(--color-sand)] flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                    {canAction && (
                        <>
                            <Button variant="ghost" onClick={onDiscard} className="text-red-600 hover:bg-red-50">
                                Discard
                            </Button>
                            <Button onClick={onApprove}>
                                Approve {request.subject === 'cancellation' ? 'Cancellation' : 'Reschedule'}
                            </Button>
                        </>
                    )}
                    {isPending && request.subject === 'general' && canHandleGeneral && (
                        <Button variant="ghost" onClick={onDiscard}>
                            Mark as Handled
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
