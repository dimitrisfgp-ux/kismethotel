"use client";

import { Clock } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";

interface ContentionTimerProps {
    expiresAt: string;
    onExpired?: () => void;
}

export function ContentionTimer({ expiresAt, onExpired }: ContentionTimerProps) {
    const { formatted, isUrgent } = useCountdown(expiresAt, onExpired);

    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${isUrgent
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
            <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-500 animate-pulse' : 'text-amber-500'}`} />
            <span>
                Another guest is also looking at this room.
                Complete your booking within{' '}
                <span className="font-mono font-bold">{formatted}</span>
            </span>
        </div>
    );
}
