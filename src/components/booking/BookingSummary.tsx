"use client";

import { Room } from "@/types";
import { formatCurrency } from "@/lib/priceCalculator";

interface BookingSummaryProps {
    room: Room;
    nights: number;
    total: number;
}

export function BookingSummary({ room, nights, total }: BookingSummaryProps) {
    return (
        <div className="bg-[var(--color-warm-white)] p-8 rounded-[var(--radius-subtle)] sticky top-28">
            <h3 className="font-montserrat text-lg font-bold uppercase tracking-widest mb-6 border-b border-[var(--color-sand)] pb-4">Order Summary</h3>

            <div className="space-y-4 text-sm font-inter">
                <div className="flex justify-between">
                    <span className="opacity-60">{formatCurrency(room.pricePerNight)} x {nights} nights</span>
                    <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="opacity-60">Taxes & Fees</span>
                    <span>{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-[var(--color-sand)] font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[var(--color-aegean-blue)]">{formatCurrency(total)}</span>
                </div>
            </div>
        </div>
    );
}
