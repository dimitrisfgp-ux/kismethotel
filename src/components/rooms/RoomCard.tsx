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

export function RoomCard({ room, index }: RoomCardProps) {
    return (
        <Link href={`/rooms/${room.slug}`} className="group block relative overflow-hidden aspect-[3/4] md:aspect-[16/9] w-full bg-[var(--color-sand)]">
            {/* Image */}
            <div className="absolute inset-0 transition-transform duration-500 ease-premium group-hover:scale-105">
                <Image
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {/* Overlay Gradient (Bottom) - Made stronger on hover for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 text-[var(--color-warm-white)] transition-transform duration-500 ease-premium group-hover:translate-y-0 translate-y-2">
                <div className="flex flex-col items-start">
                    <div className="flex justify-between items-end w-full">
                        <div>
                            <h3 className="font-montserrat text-2xl font-bold uppercase tracking-widest mb-2 text-[var(--color-warm-white)] group-hover:text-[var(--color-sand)] transition-colors">
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

                        {/* Action Icon (Appears on hover) */}
                        <div className="opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
                            <div className="bg-white text-[var(--color-aegean-blue)] p-3 rounded-full">
                                <ArrowRight className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Description Fade In */}
                    <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-[100px] group-hover:opacity-100 group-hover:mt-4 transition-all duration-500 ease-premium delay-75">
                        <p className="text-sm font-inter text-[var(--color-warm-white)]/90 leading-relaxed border-t border-white/20 pt-4">
                            {room.description}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
