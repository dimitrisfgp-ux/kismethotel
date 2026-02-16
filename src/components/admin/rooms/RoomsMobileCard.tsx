"use client";

import { Room } from "@/types";
import Image from "next/image";
import { formatCurrency } from "@/lib/priceCalculator";
import { Edit2, Trash2, ImageOff, Users, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Define local summary type to match RoomDataTable
interface RoomSummary {
    id: string;
    name: string;
    slug: string;
    pricePerNight: number;
    maxOccupancy: number;
    sizeSqm: number;
    checkInTime?: string;
    checkOutTime?: string;
    imageUrl?: string;
    media?: { url: string }[];
}

import { usePermission } from "@/contexts/PermissionContext";

interface RoomsMobileCardProps {
    room: RoomSummary;
    onDelete: (id: string) => Promise<void>;
}

export function RoomsMobileCard({ room, onDelete }: RoomsMobileCardProps) {
    const { can } = usePermission();
    return (
        <div className="bg-white p-3 rounded-lg border border-[var(--color-sand)] shadow-sm space-y-3">
            <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-[var(--color-sand)]/50">
                    {room.imageUrl || (room.media && room.media.length > 0) ? (
                        <Image
                            src={room.imageUrl || room.media?.[0]?.url || ""}
                            alt={room.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-charcoal)]/30">
                            <ImageOff className="h-6 w-6" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-[var(--color-aegean-blue)] truncate text-base leading-tight pr-2">
                                {room.name}
                            </h3>
                            <div className="font-mono font-bold text-[var(--color-charcoal)] text-sm">
                                {formatCurrency(room.pricePerNight)}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--color-charcoal)]/70">
                            <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>Max {room.maxOccupancy}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                            <span>{room.sizeSqm}m²</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-[var(--color-charcoal)]/50 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>In: {room.checkInTime || '15:00'} • Out: {room.checkOutTime || '11:00'}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-[var(--color-sand)]/30">
                {can('rooms.delete') && (
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 border-transparent hover:border-red-100"
                        onClick={() => onDelete(room.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}

                {can('rooms.update') && (
                    <Link href={`/admin/rooms/${room.slug}`} className="flex-1">
                        <Button className="w-full h-8 bg-[var(--color-aegean-blue)] hover:bg-[var(--color-aegean-blue)]/90 text-xs uppercase tracking-wide font-bold gap-2">
                            <Edit2 className="h-3 w-3" />
                            Edit Room
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
