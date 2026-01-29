"use client";

import { useState } from "react";
import { Room } from "@/types";
import { DateRange } from "react-day-picker";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { PaymentMock } from "./PaymentMock";
import { formatCurrency, calculateTotal } from "@/lib/priceCalculator";
import { differenceInDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BookingWizardProps {
    room: Room;
    dateRange: DateRange;
}

export function BookingWizard({ room, dateRange }: BookingWizardProps) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const nights = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 0;
    const total = calculateTotal(room.pricePerNight, nights);

    const handleNext = async () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Submit
            setIsLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.push("/book/success");
        }
    };

    const steps = ["Itinerary", "Guest Details", "Payment"];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Form Area */}
            <div className="lg:col-span-2">
                {/* Steps Indicator */}
                <div className="flex items-center space-x-4 mb-12 text-sm font-montserrat uppercase tracking-widest">
                    {steps.map((label, i) => (
                        <div key={i} className={`flex items-center ${step === i + 1 ? 'text-[var(--color-aegean-blue)] font-bold' : step > i + 1 ? 'text-[var(--color-success)]' : 'opacity-40'}`}>
                            <span className="mr-2">{i + 1}.</span>
                            <span>{label}</span>
                            {i < steps.length - 1 && <span className="mx-4 opacity-30">/</span>}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="bg-white p-8 border border-[var(--color-sand)] rounded-[var(--radius-subtle)] min-h-[400px]">
                    <h2 className="font-montserrat text-2xl font-bold uppercase tracking-widest mb-8">{steps[step - 1]}</h2>

                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex gap-6">
                                <div className="relative w-32 h-32 flex-shrink-0">
                                    <Image src={room.images[0]} alt={room.name} fill className="object-cover rounded-[var(--radius-subtle)]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-2">{room.name}</h3>
                                    <div className="text-sm opacity-70 space-y-1">
                                        <p>{format(dateRange.from!, "MMM dd, yyyy")} - {format(dateRange.to!, "MMM dd, yyyy")}</p>
                                        <p>{nights} Nights</p>
                                        <p>{room.maxOccupancy} Guests Max</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">First Name</label>
                                    <Input placeholder="First Name" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Last Name</label>
                                    <Input placeholder="Last Name" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Email Address</label>
                                <Input type="email" placeholder="email@example.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Phone Number (Optional)</label>
                                <Input type="tel" placeholder="+1..." />
                            </div>
                        </div>
                    )}

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
                <div className="bg-[var(--color-warm-white)] p-8 rounded-[var(--radius-subtle)] sticky top-28">
                    <h3 className="font-montserrat text-lg font-bold uppercase tracking-widest mb-6 border-b border-[var(--color-sand)] pb-4">Order Summary</h3>

                    <div className="space-y-4 text-sm font-inter">
                        <div className="flex justify-between">
                            <span className="opacity-60">{formatCurrency(room.pricePerNight)} x {nights} nights</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-60">Taxes & Fees</span>
                            <span>{formatCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-[var(--color-sand)] font-bold text-lg">
                            <span>Total</span>
                            <span className="text-[var(--color-aegean-blue)]">{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
