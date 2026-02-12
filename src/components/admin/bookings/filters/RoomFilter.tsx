"use client";

import { useState, useEffect } from "react";
import { RoomSummary } from "@/types";
import { Check } from "lucide-react";
import { FilterModal } from "../FilterModal";

interface RoomFilterProps {
    isOpen: boolean;
    onClose: () => void;
    rooms: RoomSummary[];
    selectedRoomIds: string[];
    onChange: (roomIds: string[]) => void;
}

export function RoomFilter({ isOpen, onClose, rooms, selectedRoomIds, onChange }: RoomFilterProps) {
    const [localSelection, setLocalSelection] = useState<string[]>(selectedRoomIds);

    useEffect(() => {
        setLocalSelection(selectedRoomIds);
    }, [selectedRoomIds]);

    const allSelected = localSelection.length === 0 || localSelection.length === rooms.length;

    const toggleRoom = (roomId: string) => {
        if (localSelection.includes(roomId)) {
            setLocalSelection(localSelection.filter(id => id !== roomId));
        } else {
            setLocalSelection([...localSelection, roomId]);
        }
    };

    const selectAll = () => {
        setLocalSelection([]);
    };

    const handleApply = () => {
        onChange(localSelection);
        onClose();
    };

    const handleClear = () => {
        setLocalSelection([]);
        onChange([]);
    };

    return (
        <FilterModal title="Room" isOpen={isOpen} onClose={onClose} onClear={handleClear}>
            <div className="space-y-4">
                <div className="max-h-[300px] overflow-y-auto space-y-1">
                    {/* All Option */}
                    <button
                        onClick={selectAll}
                        className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${allSelected
                            ? "bg-[var(--color-aegean-blue)]/10 text-[var(--color-aegean-blue)]"
                            : "hover:bg-[var(--color-warm-white)]"
                            }`}
                    >
                        <span className="font-medium">All Rooms</span>
                        {allSelected && <Check className="h-4 w-4" />}
                    </button>

                    <div className="h-px bg-[var(--color-sand)] my-2" />

                    {/* Room Options */}
                    {rooms.map(room => {
                        const isSelected = localSelection.includes(room.id);
                        return (
                            <button
                                key={room.id}
                                onClick={() => toggleRoom(room.id)}
                                className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${isSelected
                                    ? "bg-[var(--color-aegean-blue)]/10 text-[var(--color-aegean-blue)]"
                                    : "hover:bg-[var(--color-warm-white)]"
                                    }`}
                            >
                                <span>{room.name}</span>
                                {isSelected && <Check className="h-4 w-4" />}
                            </button>
                        );
                    })}
                </div>
                <button
                    onClick={handleApply}
                    className="w-full py-2 bg-[var(--color-aegean-blue)] text-white rounded-[var(--radius-subtle)] font-semibold hover:bg-[var(--color-aegean-blue)]/90 transition-colors"
                >
                    Apply Filter
                </button>
            </div>
        </FilterModal>
    );
}
