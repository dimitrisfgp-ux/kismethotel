"use client";

import Link from "next/link";
import { ROOMS } from "@/data/rooms";

export function RoomsDropdown() {
    return (
        <div className="absolute top-full left-0 w-[600px] bg-white border border-[var(--color-sand)] shadow-[var(--shadow-lg)] m-0 p-8 grid grid-cols-2 gap-x-8 gap-y-4 rounded-b-[var(--radius-subtle)] animate-slide-up z-50">
            <div className="col-span-2 mb-2">
                <h4 className="font-montserrat text-sm uppercase tracking-widest text-[var(--color-charcoal)] opacity-50">Our Selection</h4>
            </div>
            {ROOMS.map((room) => (
                <Link
                    key={room.id}
                    href={`/rooms/${room.slug}`}
                    className="group flex flex-col"
                >
                    <span className="font-montserrat font-semibold text-[var(--color-aegean-blue)] group-hover:text-[var(--color-deep-med)] transition-colors">
                        {room.name}
                    </span>
                    <span className="font-inter text-xs text-[var(--color-charcoal)] opacity-70">
                        {room.maxOccupancy} Guests · {room.sizeSqm}m²
                    </span>
                </Link>
            ))}

        </div>
    );
}
