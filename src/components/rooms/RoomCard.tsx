"use client";

import Link from "next/link";
import Image from "next/image";
import { Room } from "@/types";
import { Badge } from "../ui/Badge";
import { formatCurrency } from "@/lib/priceCalculator";
import { ArrowRight } from "lucide-react";

interface RoomCardProps {
    room: Room;
    index: number; // For "X of Y" logic or layout shifts
}

import { useRef, useState, useEffect } from "react";
// ... imports

export function RoomCard({ room, index }: RoomCardProps) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Only enable scroll-trigger on mobile devices (width-based for reliable testing)
        if (window.innerWidth >= 768) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsActive(entry.isIntersecting);
            },
            { threshold: 0.5 } // Reduced threshold to ensure it catches easier
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <Link
            ref={cardRef}
            href={`/rooms/${room.slug}`}
            data-active={isActive ? "" : undefined}
            className="group block relative overflow-hidden aspect-[3/4] md:aspect-[16/9] w-full bg-[var(--color-sand)]"
        >
            {/* Image */}
            <div className="absolute inset-0 transition-transform duration-500 ease-premium group-hover:scale-105 data-[active]:scale-105">
                <Image
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40 group-hover:opacity-70 data-[active]:opacity-70 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 text-[var(--color-warm-white)] transition-transform duration-500 ease-premium group-hover:translate-y-0 data-[active]:translate-y-0 translate-y-2">
                <div className="flex flex-col items-start">
                    <div className="flex justify-between items-end w-full">
                        <div>
                            <h3 className="font-montserrat text-2xl font-bold uppercase tracking-widest mb-2 text-[var(--color-warm-white)] group-hover:text-[var(--color-sand)] data-[active]:text-[var(--color-sand)] transition-colors">
                                {room.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm font-inter opacity-90">
                                <span>{room.maxOccupancy} Guests</span>
                                <span>•</span>
                                <span>{room.sizeSqm}m²</span>
                                <span>•</span>
                                <span>{formatCurrency(room.pricePerNight)} / night</span>
                            </div>
                        </div>
                    </div>

                    {/* Description Slide (Grid Rows Technique) */}
                    <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] data-[active]:grid-rows-[1fr] group-hover:opacity-100 data-[active]:opacity-100 transition-all duration-500 ease-premium">
                        <div className="overflow-hidden">
                            <p className="text-sm font-inter text-[var(--color-warm-white)]/90 leading-relaxed border-t border-white/20 pt-4 mt-4">
                                {room.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
