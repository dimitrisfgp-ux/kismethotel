"use client";

import { useState } from "react";
import { Room, BlockedDate } from "@/types";
import { addBlockedDateAction, removeBlockedDateAction, getRoomAvailabilityAction } from "@/app/actions/bookings";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { BlockedDatesTable } from "./BlockedDatesTable";
import { BlockDateModal } from "./BlockDateModal";

interface AvailabilityManagerProps {
    rooms: Room[];
    initialBlockedDates: BlockedDate[];
}

export function AvailabilityManager({ rooms, initialBlockedDates }: AvailabilityManagerProps) {
    const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(initialBlockedDates);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlock, setEditingBlock] = useState<BlockedDate | undefined>(undefined);
    const { showToast } = useToast();

    // Handlers
    const handleSaveBlock = async (block: BlockedDate) => {
        try {
            // Update local state optimistic UI
            if (editingBlock) {
                // Remove old, add new (simulating update since we don't have an update action yet)
                // In real app, we would have an update action.
                // For now, let's just 'overwrite' in local state.
                setBlockedDates(prev => prev.map(b => b.id === block.id ? block : b));
            } else {
                setBlockedDates(prev => [...prev, block]);
            }

            // Server Action
            // Note: Since we don't have 'updateBlockedDateAction', we technically just 'add' it again 
            // or we might need to assume 'add' handles upsert if ID exists, or we remove/add.
            // For this prototype, we'll just call addBlockedDateAction which pushes to mock array.
            // Ideally: updateBlockedDateAction(block).
            await addBlockedDateAction(block);

            showToast(editingBlock ? "Block updated successfully" : "Dates blocked successfully", "success");
        } catch (_error) {
            showToast("Failed to save blocked dates", "error");
        }
    };

    const handleDeleteBlock = async (id: string) => {
        if (!confirm("Are you sure you want to remove this block?")) return;

        try {
            await removeBlockedDateAction(id);
            setBlockedDates(prev => prev.filter(b => b.id !== id));
            showToast("Block removed", "success");
        } catch (_error) {
            showToast("Failed to remove block", "error");
        }
    };

    const openAddModal = () => {
        setEditingBlock(undefined);
        setIsModalOpen(true);
    };

    const openEditModal = (block: BlockedDate) => {
        setEditingBlock(block);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-sm text-[var(--color-charcoal)]/70 max-w-2xl">
                    Block dates for maintenance, renovations, or seasonal closures. These dates will be disabled on the public calendar.
                </p>
                <Button onClick={openAddModal} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Date Block
                </Button>
            </div>

            <BlockedDatesTable
                blocks={blockedDates}
                rooms={rooms}
                onEdit={openEditModal}
                onDelete={handleDeleteBlock}
            />

            <BlockDateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveBlock}
                rooms={rooms}
                initialData={editingBlock}
            />
        </div>
    );
}
