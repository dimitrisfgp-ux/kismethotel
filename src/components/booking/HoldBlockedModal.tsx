"use client";

import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { Clock, Users } from "lucide-react";

interface HoldBlockedModalProps {
    expiresAt: string;
    onExpired: () => void;
}

export function HoldBlockedModal({ expiresAt, onExpired }: HoldBlockedModalProps) {
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
        const updateTimer = () => {
            const remaining = differenceInSeconds(new Date(expiresAt), new Date());
            if (remaining <= 0) {
                onExpired();
            } else {
                setSecondsLeft(remaining);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [expiresAt, onExpired]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-lg max-w-md mx-4 text-center shadow-2xl border border-[var(--color-sand)]">
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
            </div>
        </div>
    );
}
