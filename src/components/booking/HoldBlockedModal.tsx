"use client";

import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { Clock, Users, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";

export type HoldStatus = 'held' | 'released' | 'booked';

interface HoldBlockedModalProps {
    status: HoldStatus;
    expiresAt?: string;
    onExpired?: () => void;
    onClose: () => void;
}

export function HoldBlockedModal({ status, expiresAt, onExpired, onClose }: HoldBlockedModalProps) {
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
        if (status !== 'held' || !expiresAt) return;

        const updateTimer = () => {
            const remaining = differenceInSeconds(new Date(expiresAt), new Date());
            if (remaining <= 0) {
                onExpired?.();
            } else {
                setSecondsLeft(remaining);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [status, expiresAt, onExpired]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white p-8 rounded-lg max-w-md mx-4 text-center shadow-2xl border border-[var(--color-sand)] relative animate-scale-in">
                <button
                    onClick={onClose}
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
                            Room Currently Held
                        </h3>
                        <p className="text-[var(--color-charcoal)]/70 mb-6 font-inter">
                            Someone else is completing a booking for these dates.
                            Please wait or select different dates.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-3xl font-mono font-bold text-[var(--color-aegean-blue)] mb-6">
                            <Clock className="h-6 w-6" />
                            <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
                        </div>
                        <p className="text-sm text-[var(--color-charcoal)]/50 font-inter">
                            The room will become available when the timer expires
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-6 text-sm text-[var(--color-aegean-blue)] underline hover:text-[var(--color-gold)]"
                        >
                            I'll check other dates
                        </button>
                    </>
                )}

                {status === 'released' && (
                    <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="font-montserrat text-xl font-bold uppercase tracking-wider mb-3">
                            Good News!
                        </h3>
                        <p className="text-[var(--color-charcoal)]/70 mb-6 font-inter">
                            The dates you were looking at are now available.
                        </p>
                        <Button onClick={onClose} className="w-full">
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
                            Another guest has just booked these dates. Please select different dates.
                        </p>
                        <Button variant="outline" onClick={onClose} className="w-full">
                            Close
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
