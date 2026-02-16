"use client";

import { useEffect, useState } from "react";
import { Room, BlockedDate, BlockReason } from "@/types";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/Calendar";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/admin/Select";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { formatLocalDate } from "@/lib/dateUtils";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";

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
                from: formatLocalDate(dateRange.from),
                to: formatLocalDate(dateRange.to),
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
        <Modal isOpen={true} onClose={onClose} size="sm">
            <ModalHeader onClose={onClose}>
                {initialData ? "Edit Blocked Dates" : "Block New Dates"}
            </ModalHeader>

            <ModalBody className="space-y-6">
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
            </ModalBody>

            <ModalFooter>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSave}
                    isLoading={isLoading}
                    disabled={!dateRange?.from || !dateRange?.to}
                >
                    {initialData ? "Update Block" : "Block Dates"}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
