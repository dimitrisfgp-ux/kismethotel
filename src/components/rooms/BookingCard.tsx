"use client";

import { useState, useEffect, useRef } from "react";

import { Room, BlockedDate, Booking } from "@/types";
import { useDateContext } from "@/contexts/DateContext";
import { Calendar } from "../ui/Calendar";
import { Button } from "../ui/Button";
import { formatCurrency, calculateTotal } from "@/lib/priceCalculator";
import { differenceInDays, addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { TIMEZONE_DISCLAIMER } from "@/lib/constants";
import { useRealtimeHolds } from "@/hooks/useRealtimeHolds";
import { HoldBlockedModal, HoldStatus } from "../booking/HoldBlockedModal";
import { DiscreetHoldTimer } from "../booking/DiscreetHoldTimer";
import { useToast } from "@/contexts/ToastContext";
import { checkBookingStatusAction } from "@/app/actions";

interface BookingCardProps {
    room: Room;
    blockedDates?: BlockedDate[];
    bookings?: Booking[];
}

export function BookingCard({ room, blockedDates = [], bookings = [] }: BookingCardProps) {
    const { dateRange, setDateRange } = useDateContext();
    const router = useRouter();
    const { showToast } = useToast();

    // Subscribe to realtime holds for this room
    const { allHolds, activeHold } = useRealtimeHolds({
        roomId: room.id,
        checkIn: dateRange?.from,
        checkOut: dateRange?.to
    });

    // Modal State Management
    const [modalStatus, setModalStatus] = useState<HoldStatus | 'idle'>('idle');
    const [isHeldDismissed, setIsHeldDismissed] = useState(false);

    // Store previous hold to detect when it's released
    const previousHoldRef = useRef(activeHold);

    // Effect: Handle State Transitions
    useEffect(() => {
        const prevHold = previousHoldRef.current;
        const currentHold = activeHold;

        // 1. New Hold Detected
        if (currentHold && !prevHold) {
            setModalStatus('held');
            setIsHeldDismissed(false);
        }
        // 1b. Hold ID changed (new hold replaced old one)
        else if (currentHold && prevHold && currentHold.id !== prevHold.id) {
            setModalStatus('held');
            setIsHeldDismissed(false);
        }

        // 2. Hold Released (Active -> Null)
        if (prevHold && !currentHold) {
            // Check if it resulted in a booking
            checkBookingStatusAction(
                room.id,
                prevHold.checkIn,
                prevHold.checkOut
            ).then(({ isBooked }) => {
                if (isBooked) {
                    setModalStatus('booked');
                } else {
                    setModalStatus('released');
                }
                router.refresh();
            });
        }

        previousHoldRef.current = activeHold;
    }, [activeHold, room.id, router]);

    // Close Handler
    const handleCloseModal = () => {
        if (modalStatus === 'held') {
            setIsHeldDismissed(true); // Don't close, just dismiss to discreet mode
        } else {
            setModalStatus('idle'); // Close completely for other states
        }
    };

    // Prepare disabled dates for DayPicker (including past dates)
    const disabledDates = [
        { before: new Date() }, // Disable all past dates
        ...blockedDates.map(b => ({ from: new Date(b.from), to: new Date(b.to) })),
        ...bookings.filter(b => b.status === 'confirmed').map(b => ({ from: new Date(b.checkIn), to: new Date(b.checkOut) }))
    ];

    // Logic: If 'from' is selected but 'to' is not, consider it 1 night (User selecting just check-in for 1 night stay)
    const nights = dateRange?.from
        ? (dateRange.to ? Math.max(1, differenceInDays(dateRange.to, dateRange.from)) : 1)
        : 0;

    const total = calculateTotal(room.pricePerNight, nights);

    const handleBookNow = () => {
        if (!dateRange?.from) {
            alert("Please select dates first."); // Or use Toast
            return;
        }

        if (isSelectionHeld) {
            // Should be handled by disabled state, but extra safety
            return;
        }

        // If single day selected, assume 1 night for booking flow
        // The context in book page will likely need 'to' to be defined, but we pass roomId. 
        // We might want to set the context 'to' here before navigating? 
        // Or better, let the book page handle it via URL params if implemented, but here we just push.
        // Actually, let's update local context to ensure consistency if we rely on it.
        if (!dateRange.to) {
            setDateRange({ from: dateRange.from, to: addDays(dateRange.from, 1) });
        }

        // Navigate to booking flow
        router.push(`/book?roomId=${room.id}`);
    };

    // Modifiers Calculation
    const bookedMatchers = bookings
        .filter(b => b.status === "confirmed")
        .map(b => ({ from: new Date(b.checkIn), to: new Date(b.checkOut) }));

    const maintenanceMatchers = blockedDates
        .filter(b => b.reason === "Maintenance")
        .map(b => ({ from: new Date(b.from), to: new Date(b.to) }));

    const renovationMatchers = blockedDates
        .filter(b => b.reason === "Renovations")
        .map(b => ({ from: new Date(b.from), to: new Date(b.to) }));

    const seasonMatchers = blockedDates
        .filter(b => b.reason === "Out of Season")
        .map(b => ({ from: new Date(b.from), to: new Date(b.to) }));

    const otherMatchers = blockedDates
        .filter(b => b.reason === "Other")
        .map(b => ({ from: new Date(b.from), to: new Date(b.to) }));

    const heldMatchers = allHolds.map(h => ({
        from: new Date(h.checkIn),
        to: new Date(h.checkOut)
    }));

    // Smart Blocking Logic: Only disable if SELECTION overlaps with a hold
    const isSelectionHeld = !!activeHold;

    return (
        <div className="sticky top-28 bg-white border border-[var(--color-sand)] rounded-card shadow-xl animate-slide-up overflow-hidden">

            {/* Modal Logic */}
            {(modalStatus !== 'idle') && !(modalStatus === 'held' && isHeldDismissed) && (
                <HoldBlockedModal
                    status={modalStatus as HoldStatus}
                    expiresAt={activeHold?.expiresAt} // Only needed for 'held'
                    onExpired={() => {
                        // Let the effect handle the transition to 'released' when activeHold becomes null
                    }}
                    onClose={handleCloseModal}
                />
            )}

            {/* Discreet Timer (only when held & dismissed) */}
            {modalStatus === 'held' && isHeldDismissed && activeHold && (
                <DiscreetHoldTimer
                    expiresAt={activeHold.expiresAt}
                    onExpired={() => { /* Effect handles removal */ }}
                />
            )}
            {/* Header: Price */}
            <div className="p-6 bg-[var(--color-warm-white)] border-b border-[var(--color-sand)] text-center">
                <span className="font-montserrat text-3xl font-bold text-[var(--color-aegean-blue)]">{formatCurrency(room.pricePerNight)}</span>
                <span className="text-sm font-inter opacity-60 ml-1">/ night</span>
            </div>

            <div className="p-6 space-y-6">
                {/* Inline Calendar */}
                <div className="flex justify-center booking-calendar-wrapper">
                    <Calendar
                        className="calendar-light p-3"
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={1}
                        disabled={disabledDates}
                        modifiers={{
                            booked: bookedMatchers,
                            maintenance: maintenanceMatchers,
                            renovation: renovationMatchers,
                            season: seasonMatchers,
                            other: otherMatchers,
                            held: heldMatchers
                        }}
                        modifiersClassNames={{
                            booked: "rdp-day_booked",
                            maintenance: "rdp-day_maintenance",
                            renovation: "rdp-day_renovation",
                            season: "rdp-day_season",
                            other: "rdp-day_other",
                            held: "rdp-day_held"
                        }}
                    />
                </div>
                <p className="text-[10px] text-center text-[var(--color-charcoal)]/50 mt-2">
                    {TIMEZONE_DISCLAIMER}
                </p>


                {/* Totals & Action */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-4 border-t border-[var(--color-sand)] font-inter">
                        <span className="text-sm uppercase tracking-widest opacity-60">Total Stay</span>
                        <div className="text-right">
                            {nights > 0 ? (
                                <>
                                    <span className="block font-bold text-lg text-[var(--color-charcoal)]">{formatCurrency(total)}</span>
                                    <span className="text-xs opacity-50">{nights} nights</span>
                                </>
                            ) : (
                                <span className="text-sm opacity-40">- -</span>
                            )}
                        </div>
                    </div>

                    <Button
                        onClick={handleBookNow}
                        className="w-full rounded-subtle h-14 text-lg"
                        disabled={nights === 0 || isSelectionHeld}
                    >
                        {isSelectionHeld
                            ? "Dates Currently Held"
                            : (nights > 0 ? "Book Now" : "Select Dates")
                        }
                    </Button>

                    <p className="text-center text-[10px] opacity-50 uppercase tracking-widest">You won&apos;t be charged yet</p>
                </div>
            </div>
        </div>
    );
}
