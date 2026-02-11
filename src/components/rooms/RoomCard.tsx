"use client";

import Link from "next/link";
import Image from "next/image";
import { Room } from "@/types";
import { formatCurrency } from "@/lib/priceCalculator";
import { BedSingle, BedDouble, Users } from "lucide-react";

interface RoomCardProps {
    room: Room;
    index: number; // For "X of Y" logic or layout shifts
}

import { useRef, useState, useEffect } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { RoomPlaceholder } from "@/components/rooms/RoomPlaceholder";

export function RoomCard({ room, index: _index }: RoomCardProps) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch(window.matchMedia("(hover: none)").matches || window.innerWidth < 1024);

    }, []);

    const isActive = useIntersectionObserver(cardRef, {
        threshold: 0.4,
        rootMargin: "-5% 0px",
        enabled: isTouch
    });

    return (
        <Link
            ref={cardRef}
            href={`/rooms/${room.slug}`}
            className={`group block relative overflow-hidden aspect-[3/4] md:aspect-[16/9] w-full bg-[var(--color-sand)] ${isActive ? "is-active" : ""}`}
        >
            {/* Image */}
            <div className="absolute inset-0 transition-transform duration-500 ease-premium group-hover:scale-105 group-[.is-active]:scale-105">
                {room.media && room.media.length > 0 ? (
                    <Image
                        src={room.media[0].url}
                        alt={room.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                ) : (
                    <RoomPlaceholder />
                )}
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40 group-hover:opacity-70 group-[.is-active]:opacity-70 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 text-[var(--color-warm-white)] transition-transform duration-500 ease-premium group-hover:translate-y-0 group-[.is-active]:translate-y-0 translate-y-2">
                <div className="flex flex-col items-start w-full">
                    <div className="flex justify-between items-end w-full">
                        <div className="w-full">
                            <h3 className="font-montserrat text-2xl font-bold uppercase tracking-widest mb-2 text-[var(--color-warm-white)] group-hover:text-[var(--color-sand)] group-[.is-active]:text-[var(--color-sand)] transition-colors">
                                {room.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-inter opacity-90">
                                {/* Amenities Group */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        {/* Beds */}
                                        {/* Beds (Aggregated) */}
                                        {(() => {
                                            const bedMap = (room.beds || []).reduce((acc, bed) => {
                                                acc[bed.type] = (acc[bed.type] || 0) + bed.count;
                                                return acc;
                                            }, {} as Record<string, number>);

                                            return Object.entries(bedMap).map(([type, count]) => (
                                                <div key={type} className="flex items-center gap-1.5" title={`${count} ${type === 'double' ? 'Double' : 'Single'} Bed${count > 1 ? 's' : ''}`}>
                                                    {type === 'double' ? <BedDouble className="w-4 h-4" /> : <BedSingle className="w-4 h-4" />}
                                                    <span>{count}</span>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                    <div className="w-px h-3 bg-white/40" />
                                    {/* Occupancy */}
                                    <div className="flex items-center gap-1.5" title={`Max ${room.maxOccupancy} Guests`}>
                                        <Users className="w-4 h-4" />
                                        <span>{room.maxOccupancy}</span>
                                    </div>
                                </div>
                                <span className="hidden sm:inline">•</span>
                                <span>{room.sizeSqm}m²</span>
                                <span className="hidden sm:inline">•</span>
                                <span>{formatCurrency(room.pricePerNight)} / night</span>
                            </div>
                        </div>
                    </div>

                    {/* Description Slide (Grid Rows Technique) */}
                    <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-[.is-active]:grid-rows-[1fr] group-hover:opacity-100 group-[.is-active]:opacity-100 transition-all duration-500 ease-premium w-full">
                        <div className="overflow-hidden">
                            <p className="text-sm font-inter text-[var(--color-warm-white)]/90 leading-relaxed border-t border-white/20 pt-4 mt-4 line-clamp-3">
                                {room.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link >
    );
}
