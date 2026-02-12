"use client";

import { useCallback } from "react";
import { Clock } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { useHoldContention } from "@/contexts/HoldContentionContext";
import { cn } from "@/lib/utils";

export function FloatingHoldTimer() {
    const {
        blockedHold,
        userBChoice,
        outcomeStatus,
        openModalFromWidget,
        notifyHoldReleased
    } = useHoldContention();

    // When timer expires → check if dates got booked or are now free
    const handleExpired = useCallback(() => {
        if (blockedHold) {
            notifyHoldReleased(blockedHold);
        }
    }, [blockedHold, notifyHoldReleased]);

    // Use contention deadline if set (clear 7-min max), otherwise fallback to heartbeat TTL
    const timerTarget = blockedHold?.contentionDeadline ?? blockedHold?.expiresAt ?? null;

    const { secondsLeft, formatted } = useCountdown(
        timerTarget,
        handleExpired
    );

    // Only show when user chose "watching" and hold is still active
    if (userBChoice !== 'watching' || !blockedHold || secondsLeft <= 0 || outcomeStatus) return null;

    return (
        <button
            onClick={openModalFromWidget}
            className={cn(
                "fixed bottom-6 right-24 z-50 flex items-center gap-2",
                "px-4 py-3 rounded-full shadow-lg",
                "bg-[var(--color-deep-med)] border border-[var(--color-accent-gold)]",
                "text-white text-sm font-inter font-medium",
                "hover:scale-105 active:scale-95",
                "transition-all duration-300 ease-premium",
                "animate-slide-up"
            )}
            aria-label="View hold status"
        >
            <Clock className="w-4 h-4 text-[var(--color-accent-gold)]" />
            <span className="font-mono font-bold tracking-wide">{formatted}</span>
        </button>
    );
}
