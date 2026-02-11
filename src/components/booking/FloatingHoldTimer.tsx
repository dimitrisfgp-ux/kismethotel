"use client";

import { Clock } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { useHoldContention } from "@/contexts/HoldContentionContext";
import { cn } from "@/lib/utils";

export function FloatingHoldTimer() {
    const {
        blockedHold,
        userBChoice,
        outcomeStatus,
        openModalFromWidget
    } = useHoldContention();

    const { secondsLeft, formatted } = useCountdown(
        blockedHold?.expiresAt ?? null
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
