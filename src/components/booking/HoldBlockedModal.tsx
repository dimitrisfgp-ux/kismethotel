"use client";

import { useEffect } from "react";
import { Clock, Users, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { useCountdown } from "@/hooks/useCountdown";
import { useHoldContention } from "@/contexts/HoldContentionContext";
import { useDateContext } from "@/contexts/DateContext";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export type HoldStatus = 'held' | 'available' | 'booked';

export function HoldBlockedModal() {
    const {
        blockedHold,
        modalVisible,
        outcomeStatus,
        userBChoice,
        selectWatching,
        selectDismissed,
        closeModal
    } = useHoldContention();
    const { setDateRange } = useDateContext();
    const router = useRouter();

    // Determine current status
    const status: HoldStatus | null = outcomeStatus
        ? (outcomeStatus === 'available' ? 'available' : 'booked')
        : (blockedHold ? 'held' : null);

    // Use contention deadline (7 min) when available, fallback to heartbeat TTL
    const timerTarget = status === 'held'
        ? (blockedHold?.contentionDeadline ?? blockedHold?.expiresAt ?? null)
        : null;

    const { formatted } = useCountdown(
        timerTarget,
        () => {
            // Timer expired — hold is released, context will handle via realtime
        }
    );

    // Auto-close the 'booked' outcome after 4 seconds
    useEffect(() => {
        if (outcomeStatus === 'booked' && modalVisible) {
            const timer = setTimeout(() => {
                closeModal();
                router.refresh(); // Refresh page data so calendar shows booked dates
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [outcomeStatus, modalVisible, closeModal, router]);

    // When dates become available, set DateContext and navigate directly to booking
    const handleAvailableClose = () => {
        if (blockedHold) {
            // Set the dates UserB was watching into DateContext
            setDateRange({
                from: new Date(blockedHold.checkIn),
                to: new Date(blockedHold.checkOut)
            });
            closeModal();
            // Navigate directly to the booking flow for this room
            router.push(`/book?roomId=${blockedHold.roomId}`);
        } else {
            closeModal();
            router.refresh();
        }
    };

    // Don't render if modal shouldn't be visible or no status to show
    if (!modalVisible || !status) return null;

    // Format dates for display
    const checkInDisplay = blockedHold ? format(new Date(blockedHold.checkIn), 'MMM d, yyyy') : '';
    const checkOutDisplay = blockedHold ? format(new Date(blockedHold.checkOut), 'MMM d, yyyy') : '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white p-8 rounded-lg max-w-md mx-4 text-center shadow-2xl border border-[var(--color-sand)] relative animate-slide-up">
                <button
                    onClick={outcomeStatus ? handleAvailableClose : closeModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {status === 'held' && (
                    <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                            <Users className="h-8 w-8 text-amber-600" />
                        </div>
                        <h3 className="font-montserrat text-xl font-bold uppercase tracking-wider mb-3">
                            Dates Currently Held
                        </h3>
                        <p className="text-[var(--color-charcoal)]/70 mb-6 font-inter leading-relaxed">
                            Another guest is currently booking the dates from{' '}
                            <strong>{checkInDisplay}</strong> to <strong>{checkOutDisplay}</strong>.
                        </p>
                        {userBChoice === 'watching' && blockedHold?.contentionDeadline && (
                            <div className="flex items-center justify-center gap-2 text-3xl font-mono font-bold text-[var(--color-aegean-blue)] mb-6">
                                <Clock className="h-6 w-6" />
                                <span>{formatted}</span>
                            </div>
                        )}
                        <p className="text-sm text-[var(--color-charcoal)]/50 font-inter mb-8">
                            Would you like us to notify you if the dates become available while you browse? (Max waiting time 7 Minutes)
                        </p>
                        <div className="space-y-3">
                            <Button onClick={selectWatching} className="w-full">
                                Notify me when available
                            </Button>
                            <button
                                onClick={selectDismissed}
                                className="w-full text-sm text-[var(--color-aegean-blue)] hover:text-[var(--color-gold)] underline transition-colors py-2"
                            >
                                It&apos;s OK, I&apos;ll check other dates
                            </button>
                        </div>
                    </>
                )}

                {status === 'available' && (
                    <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="font-montserrat text-xl font-bold uppercase tracking-wider mb-3">
                            Good News!
                        </h3>
                        <p className="text-[var(--color-charcoal)]/70 mb-6 font-inter">
                            The dates are now available. You can proceed with your booking.
                        </p>
                        <Button onClick={handleAvailableClose} className="w-full">
                            Book Now
                        </Button>
                    </>
                )}

                {status === 'booked' && (
                    <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <h3 className="font-montserrat text-xl font-bold uppercase tracking-wider mb-3">
                            Dates Booked
                        </h3>
                        <p className="text-[var(--color-charcoal)]/70 mb-6 font-inter">
                            Dates from <strong>{checkInDisplay}</strong> to <strong>{checkOutDisplay}</strong>{' '}
                            have been booked. Please check other ranges.
                        </p>
                        <p className="text-xs text-[var(--color-charcoal)]/40 font-inter">
                            This window will close shortly...
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

