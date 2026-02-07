"use client";

import { Room, BlockedDate } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import { Trash2, Edit2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface BlockedDatesTableProps {
    blocks: BlockedDate[];
    rooms: Room[];
    onEdit: (block: BlockedDate) => void;
    onDelete: (id: string) => void;
}

export function BlockedDatesTable({ blocks, rooms, onEdit, onDelete }: BlockedDatesTableProps) {
    if (blocks.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-[var(--color-sand)] rounded-lg">
                <div className="flex flex-col items-center justify-center opacity-50">
                    <AlertCircle className="w-10 h-10 mb-2 text-[var(--color-aegean-blue)]" />
                    <p className="text-[var(--color-charcoal)]">No dates are currently blocked.</p>
                </div>
            </div>
        );
    }

    const getRoom = (id: string) => rooms.find(r => r.id === id);

    return (
        <div className="bg-white rounded-lg border border-[var(--color-sand)] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--color-warm-white)] border-b border-[var(--color-sand)]">
                        <tr>
                            <th className="p-4 font-bold text-[var(--color-charcoal)]">Room</th>
                            <th className="p-4 font-bold text-[var(--color-charcoal)]">Dates</th>
                            <th className="p-4 font-bold text-[var(--color-charcoal)]">Reason</th>
                            <th className="p-4 font-bold text-[var(--color-charcoal)]">Notes</th>
                            <th className="p-4 font-bold text-[var(--color-charcoal)] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-sand)]">
                        {blocks.map((block) => {
                            const room = getRoom(block.roomId);
                            return (
                                <tr key={block.id} className="hover:bg-[var(--color-warm-white)]/20 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {room?.images?.[0] ? (
                                                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                    <Image
                                                        src={room.images[0]}
                                                        alt={room.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                                                    No Img
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-[var(--color-aegean-blue)]">{room?.name || "Unknown Room"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{format(new Date(block.from), "MMM d, yyyy")}</span>
                                            <span className="text-[10px] text-[var(--color-charcoal)]/50">to</span>
                                            <span className="font-medium">{format(new Date(block.to), "MMM d, yyyy")}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                                            {block.reason}
                                        </Badge>
                                    </td>
                                    <td className="p-4 max-w-xs">
                                        <p className="truncate text-[var(--color-charcoal)]/80 italic">
                                            {block.note || "-"}
                                        </p>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button
                                                onClick={() => onEdit(block)}
                                                className="p-2 text-[var(--color-aegean-blue)] hover:bg-[var(--color-aegean-blue)]/5 rounded-full transition-colors"
                                                title="Edit Block"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(block.id)}
                                                className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                                                title="Remove Block"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
