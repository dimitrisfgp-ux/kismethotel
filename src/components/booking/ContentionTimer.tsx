"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";

interface ContentionTimerProps {
    expiresAt: string;
    contentionCleared?: boolean;
    onExpired?: () => void;
}

export function ContentionTimer({ expiresAt, contentionCleared = false, onExpired }: ContentionTimerProps) {
    const { formatted, isUrgent } = useCountdown(expiresAt, onExpired);
    const [showCleared, setShowCleared] = useState(false);

    // When contention clears, show the success message briefly then auto-hide
    useEffect(() => {
        if (contentionCleared) {
            setShowCleared(true);
            const timer = setTimeout(() => setShowCleared(false), 5000);
            return () => clearTimeout(timer);
        } else {
            setShowCleared(false);
        }
    }, [contentionCleared]);

    // Cleared state — green success variant
    if (showCleared) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-green-50 text-green-800 border border-green-200 animate-fade-in mb-4">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>
                    No other user is attempting the same dates anymore, please take your time.
                </span>
            </div>
        );
    }

    // Don't show if contention is cleared (after animation finishes)
    if (contentionCleared) return null;

    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors mb-4 ${isUrgent
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
            <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-500 animate-pulse' : 'text-amber-500'}`} />
            <span>
                Someone else is also interested in these dates, please complete your session within{' '}
                <span className="font-mono font-bold">{formatted}</span>
            </span>
        </div>
    );
}
