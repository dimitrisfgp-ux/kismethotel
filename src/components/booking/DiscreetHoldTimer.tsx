"use client";

import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { Clock } from "lucide-react";

interface DiscreetHoldTimerProps {
    expiresAt: string;
    onExpired?: () => void;
}

export function DiscreetHoldTimer({ expiresAt, onExpired }: DiscreetHoldTimerProps) {
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
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
    }, [expiresAt, onExpired]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    if (secondsLeft <= 0) return null;

    return (
        <div className="flex items-center justify-center gap-2 p-2 bg-amber-50 text-amber-800 text-sm font-medium border-b border-amber-100 animate-fade-in">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>
                Dates held by another guest for{' '}
                <span className="font-mono font-bold text-amber-700">
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
            </span>
        </div>
    );
}
