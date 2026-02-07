"use client";

import { useState } from "react";
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
import { createBookingAction } from "@/app/actions";
import { useToast } from "@/contexts/ToastContext";

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
                id: Math.random().toString(36).substr(2, 9),
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
                {/* Steps Indicator */}
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
