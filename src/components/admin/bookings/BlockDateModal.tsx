"use client";

import { useEffect, useState } from "react";
import { Room, BlockedDate, BlockReason } from "@/types";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/Calendar";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/admin/Select";
import { Input } from "@/components/ui/Input";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockDateModalProps {
    rooms: Room[];
    isOpen: boolean;
    onClose: () => void;
    onSave: (block: BlockedDate) => Promise<void>;
    initialData?: BlockedDate; // If present, we are editing
}

const BLOCK_REASONS: BlockReason[] = ["Maintenance", "Renovations", "Out of Season", "Other"];

export function BlockDateModal({ rooms, isOpen, onClose, onSave, initialData }: BlockDateModalProps) {
    const [selectedRoomId, setSelectedRoomId] = useState<string>(initialData?.roomId || rooms[0]?.id || "");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        initialData ? { from: new Date(initialData.from), to: new Date(initialData.to) } : undefined
    );
    const [reason, setReason] = useState<BlockReason>(initialData?.reason || "Maintenance");
    const [note, setNote] = useState(initialData?.note || "");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setSelectedRoomId(initialData.roomId);
                setDateRange({ from: new Date(initialData.from), to: new Date(initialData.to) });
                setReason(initialData.reason);
                setNote(initialData.note || "");
            } else {
                // Reset for new entry
                setSelectedRoomId(rooms[0]?.id || "");
                setDateRange(undefined);
                setReason("Maintenance");
                setNote("");
            }
        }
    }, [isOpen, initialData, rooms]);

    const handleSave = async () => {
        if (!dateRange?.from || !dateRange?.to || !selectedRoomId) return;

        setIsLoading(true);
        try {
            await onSave({
                id: initialData?.id || Math.random().toString(36).substr(2, 9),
                roomId: selectedRoomId,
                from: dateRange.from.toISOString(),
                to: dateRange.to.toISOString(),
                reason,
                note
            });
            onClose();
        } catch (error) {
            console.error("Failed to save block", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--color-sand)] bg-[var(--color-warm-white)]">
                    <h3 className="font-bold font-montserrat text-lg text-[var(--color-charcoal)]">
                        {initialData ? "Edit Blocked Dates" : "Block New Dates"}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                        <X className="w-5 h-5 opacity-60" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">

                    {/* Room Select */}
                    <div>
                        <Select
                            label="Select Room"
                            value={selectedRoomId}
                            onChange={(e) => setSelectedRoomId(e.target.value)}
                            options={rooms.map(room => ({ label: room.name, value: room.id }))}
                        />
                    </div>

                    {/* Reason Select */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--color-charcoal)]">Reason</label>
                        <div className="flex flex-wrap gap-2">
                            {BLOCK_REASONS.map(r => (
                                <button
                                    key={r}
                                    onClick={() => setReason(r)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs uppercase tracking-wider rounded-full border transition-all",
                                        reason === r
                                            ? "bg-[var(--color-aegean-blue)] text-white border-transparent"
                                            : "border-[var(--color-sand)] text-[var(--color-charcoal)] hover:border-[var(--color-aegean-blue)]"
                                    )}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--color-charcoal)]">Select Range</label>
                        <div className="border border-[var(--color-sand)] rounded-md p-2 flex justify-center">
                            <Calendar
                                className="calendar-light p-3"
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={1}
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <Input
                            label="Notes (Optional)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="e.g. Painting walls..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[var(--color-sand)] bg-[var(--color-warm-white)]/50 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={handleSave}
                        isLoading={isLoading}
                        disabled={!dateRange?.from || !dateRange?.to}
                    >
                        {initialData ? "Update Block" : "Block Dates"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
