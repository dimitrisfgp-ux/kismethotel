"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Room, Booking } from "@/types";
import { DateRange } from "react-day-picker";
import { Button } from "../ui/Button";
import { PaymentMock } from "./PaymentMock";
import { calculateTotal } from "@/lib/priceCalculator";
import { differenceInDays } from "date-fns";
import { useRouter } from "next/navigation";
import { StepItinerary } from "./steps/StepItinerary";
import { StepGuestDetails, GuestData } from "./steps/StepGuestDetails";
import { BookingSummary } from "./BookingSummary";
import { ContentionTimer } from "./ContentionTimer";
import { createBookingAction, createHoldAction, releaseHoldAction } from "@/app/actions";
import { useToast } from "@/contexts/ToastContext";
import { useRealtimeHolds } from "@/hooks/useRealtimeHolds";

interface BookingWizardProps {
    room: Room;
    dateRange: DateRange;
}

export function BookingWizard({ room, dateRange }: BookingWizardProps) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [guestData, setGuestData] = useState<GuestData>({ firstName: "", lastName: "", email: "", phone: "" });
    const router = useRouter();
    const { showToast } = useToast();

    // Hold management state
    const [holdId, setHoldId] = useState<string | null>(null);
    const [holdExpiresAt, setHoldExpiresAt] = useState<string | null>(null);
    const holdCreated = useRef(false);

    // Generate session ID
    const sessionId = useMemo(() => {
        if (typeof window === 'undefined') return '';
        let id = localStorage.getItem('booking_session_id');
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem('booking_session_id', id);
        }
        return id;
    }, []);

    // Subscribe to realtime contention updates
    const { hasContention } = useRealtimeHolds({
        roomId: room.id,
        checkIn: dateRange.from!,
        checkOut: dateRange.to!,
        mySessionId: sessionId
    });

    // Create hold on mount
    useEffect(() => {
        if (holdCreated.current || !sessionId || !dateRange.from || !dateRange.to) return;
        holdCreated.current = true;

        createHoldAction(
            room.id,
            dateRange.from.toISOString(),
            dateRange.to.toISOString(),
            sessionId
        ).then(result => {
            if (result.success) {
                setHoldId(result.holdId!);
                setHoldExpiresAt(result.expiresAt!);
            } else {
                showToast(result.error || "Could not reserve room", "error");
                router.push('/rooms');
            }
        });
    }, [room.id, dateRange.from, dateRange.to, sessionId, showToast, router]);

    // Cleanup on unmount - release the hold
    useEffect(() => {
        const currentHoldId = holdId;
        return () => {
            if (currentHoldId) {
                releaseHoldAction(currentHoldId);
            }
        };
    }, [holdId]);

    // Handle hold expiration
    const handleHoldExpired = () => {
        showToast("Your booking session has expired. Please start again.", "error");
        router.push('/rooms');
    };

    const nights = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 0;
    const total = calculateTotal(room.pricePerNight, nights);

    const handleNext = async () => {
        if (step === 2) {
            // Validation
            if (!guestData.firstName || !guestData.lastName || !guestData.email) {
                showToast("Please fill in all required fields", "error");
                return;
            }
        }

        if (step < 3) {
            setStep(step + 1);
        } else {
            // Submit
            setIsLoading(true);
            const booking: Booking = {
                id: crypto.randomUUID(),
                roomId: room.id,
                checkIn: dateRange.from!.toISOString(),
                checkOut: dateRange.to!.toISOString(),
                guestName: `${guestData.firstName} ${guestData.lastName}`,
                guestEmail: guestData.email,
                guestPhone: guestData.phone,
                guestsCount: 2, // Hardcoded for simplified wizard
                totalPrice: total,
                status: 'confirmed',
                createdAt: new Date().toISOString()
            };

            try {
                await createBookingAction(booking);
                // Release hold after successful booking (cleanup)
                if (holdId) {
                    await releaseHoldAction(holdId);
                }
                showToast("Booking Confirmed!", "success");
                router.push("/book/success");
            } catch (_error) {
                showToast("Booking failed. Please try again.", "error");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const steps = ["Itinerary", "Guest Details", "Payment"];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Form Area */}
            <div className="lg:col-span-2">
                {/* Contention Timer - shown when someone else is interested */}
                {hasContention && holdExpiresAt && (
                    <ContentionTimer
                        expiresAt={holdExpiresAt}
                        onExpired={handleHoldExpired}
                    />
                )}

                {/* Steps Indicator (Mobile) */}
                <div className="md:hidden mb-8">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-aegean-blue)]">
                            Step {step} of {steps.length}
                        </span>
                        <span className="text-xs font-inter text-[var(--color-charcoal)]/60">
                            {steps[step - 1]}
                        </span>
                    </div>
                    <div className="w-full h-1 bg-[var(--color-sand)]/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-aegean-blue)] transition-all duration-500 ease-premium"
                            style={{ width: `${(step / steps.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Steps Indicator (Desktop) */}
                <div className="hidden md:flex items-center justify-center space-x-4 mb-12 text-sm font-montserrat uppercase tracking-widest">
                    {steps.map((label, i) => (
                        <div key={i} className={`flex items-center ${step === i + 1 ? 'text-[var(--color-aegean-blue)] font-bold' : step > i + 1 ? 'text-[var(--color-success)]' : 'opacity-40'}`}>
                            {step > i + 1 ? (
                                // Completed Step Icon (Optional) or just number
                                <span className="mr-2">✓</span>
                            ) : (
                                <span className="mr-2">{i + 1}.</span>
                            )}

                            <span>{label}</span>
                            {i < steps.length - 1 && <span className="mx-4 opacity-30">/</span>}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="bg-white p-8 border border-[var(--color-sand)] rounded-[var(--radius-subtle)] min-h-[400px]">
                    <h2 className="font-montserrat text-2xl font-bold uppercase tracking-widest mb-8">{steps[step - 1]}</h2>

                    {step === 1 && <StepItinerary room={room} dateRange={dateRange} nights={nights} />}

                    {step === 2 && <StepGuestDetails data={guestData} onChange={setGuestData} />}

                    {step === 3 && <PaymentMock />}

                    <div className="mt-8 flex justify-between pt-8 border-t border-[var(--color-sand)]">
                        {step > 1 ? (
                            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={isLoading}>Back</Button>
                        ) : <div />}

                        <Button onClick={handleNext} isLoading={isLoading}>
                            {step === 3 ? "Complete Booking" : "Continue"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Order Summary Sidebar */}
            <div>
                <BookingSummary room={room} nights={nights} total={total} />
            </div>
        </div>
    );
}
