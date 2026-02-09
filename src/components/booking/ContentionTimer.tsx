"use client";

import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { AlertTriangle, Clock } from "lucide-react";

interface ContentionTimerProps {
    expiresAt: string;
    onExpired?: () => void;
}

export function ContentionTimer({ expiresAt, onExpired }: ContentionTimerProps) {
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
    const isUrgent = secondsLeft < 120; // Less than 2 minutes

    return (
        <div className={`rounded-lg p-4 mb-6 flex items-center gap-3 border ${isUrgent
                ? 'bg-red-50 border-red-200'
                : 'bg-amber-50 border-amber-200'
            }`}>
            <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${isUrgent ? 'text-red-600' : 'text-amber-600'
                }`} />
            <div className="flex-1">
                <p className={`font-semibold ${isUrgent ? 'text-red-800' : 'text-amber-800'}`}>
                    Someone else is interested in these dates!
                </p>
                <p className={`text-sm ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
                    Complete your booking within{" "}
                    <span className="font-mono font-bold inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {minutes}:{seconds.toString().padStart(2, '0')}
                    </span>
                </p>
            </div>
        </div>
    );
}
