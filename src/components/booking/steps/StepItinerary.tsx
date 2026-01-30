"use client";

import { Room } from "@/types";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import Image from "next/image";

interface StepItineraryProps {
    room: Room;
    dateRange: DateRange;
    nights: number;
}

export function StepItinerary({ room, dateRange, nights }: StepItineraryProps) {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex gap-6">
                <div className="relative w-32 h-32 flex-shrink-0">
                    <Image src={room.images[0]} alt={room.name} fill className="object-cover rounded-[var(--radius-subtle)]" />
                </div>
                <div>
                    <h3 className="font-bold text-xl mb-2">{room.name}</h3>
                    <div className="text-sm opacity-70 space-y-1">
                        <p>{format(dateRange.from!, "MMM dd, yyyy")} - {format(dateRange.to!, "MMM dd, yyyy")}</p>
                        <p>{nights} Nights</p>
                        <p>{room.maxOccupancy} Guests Max</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
