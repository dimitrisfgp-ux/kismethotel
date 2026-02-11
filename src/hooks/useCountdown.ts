"use client";

import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

interface UseCountdownResult {
    secondsLeft: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
    isUrgent: boolean;
    formatted: string;
}

/**
 * Reusable countdown hook for hold timers.
 * Calls `onExpired` once when the timer reaches 0.
 * 
 * @param expiresAt - ISO date string for when the countdown ends
 * @param onExpired - Optional callback fired once at expiry
 * @param urgentThreshold - Seconds remaining to consider "urgent" (default: 120)
 */
export function useCountdown(
    expiresAt: string | null | undefined,
    onExpired?: () => void,
    urgentThreshold = 120
): UseCountdownResult {
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [hasFired, setHasFired] = useState(false);

    // Fire onExpired via effect (not during render) to avoid
    // "Cannot update a component while rendering a different component"
    useEffect(() => {
        if (hasFired) {
            onExpired?.();
        }
    }, [hasFired, onExpired]);

    useEffect(() => {
        if (!expiresAt) return;

        // Reset fired state when expiresAt changes
        setHasFired(false);

        const updateTimer = () => {
            const remaining = differenceInSeconds(new Date(expiresAt), new Date());
            if (remaining <= 0) {
                setSecondsLeft(0);
                setHasFired(true);
            } else {
                setSecondsLeft(remaining);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return {
        secondsLeft,
        minutes,
        seconds,
        isExpired: secondsLeft <= 0 && hasFired,
        isUrgent: secondsLeft > 0 && secondsLeft < urgentThreshold,
        formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`
    };
}
