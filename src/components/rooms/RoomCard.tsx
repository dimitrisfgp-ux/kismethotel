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
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
// ... imports

export function RoomCard({ room, index }: RoomCardProps) {
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
                <Image
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40 group-hover:opacity-70 group-[.is-active]:opacity-70 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 text-[var(--color-warm-white)] transition-transform duration-500 ease-premium group-hover:translate-y-0 group-[.is-active]:translate-y-0 translate-y-2">
                <div className="flex flex-col items-start">
                    <div className="flex justify-between items-end w-full">
                        <div>
                            <h3 className="font-montserrat text-2xl font-bold uppercase tracking-widest mb-2 text-[var(--color-warm-white)] group-hover:text-[var(--color-sand)] group-[.is-active]:text-[var(--color-sand)] transition-colors">
                                {room.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm font-inter opacity-90">
                                <span>
                                    {room.beds?.map(b => `${b.count} ${b.type === 'double' ? 'Double' : 'Single'}`).join(", ")} Bed{room.beds?.reduce((acc, b) => acc + b.count, 0) > 1 ? 's' : ''}
                                </span>
                                <span>•</span>
                                <span>Max {room.maxOccupancy} Guests</span>
                                <span>•</span>
                                <span>{room.sizeSqm}m²</span>
                                <span>•</span>
                                <span>{formatCurrency(room.pricePerNight)} / night</span>
                            </div>
                        </div>
                    </div>

                    {/* Description Slide (Grid Rows Technique) */}
                    <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-[.is-active]:grid-rows-[1fr] group-hover:opacity-100 group-[.is-active]:opacity-100 transition-all duration-500 ease-premium">
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
