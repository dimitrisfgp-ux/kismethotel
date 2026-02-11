"use client";

import { Clock } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";

interface DiscreetHoldTimerProps {
    expiresAt: string;
    onExpired?: () => void;
}

export function DiscreetHoldTimer({ expiresAt, onExpired }: DiscreetHoldTimerProps) {
    const { secondsLeft, formatted } = useCountdown(expiresAt, onExpired);

    if (secondsLeft <= 0) return null;

    return (
        <div className="flex items-center justify-center gap-2 p-2 bg-amber-50 text-amber-800 text-sm font-medium border-b border-amber-100 animate-fade-in">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>
                Dates held by another guest for{' '}
                <span className="font-mono font-bold text-amber-700">
                    {formatted}
                </span>
            </span>
        </div>
    );
}
