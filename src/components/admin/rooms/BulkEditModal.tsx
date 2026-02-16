"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { bulkUpdateRoomsAction } from "@/app/actions/room-bulk-update";
import { useToast } from "@/contexts/ToastContext";
import { Room } from "@/types";
import { Loader2 } from "lucide-react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";

interface BulkEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRoomIds: string[];
    onSuccess: () => void;
}

type EditableField = 'pricePerNight' | 'maxOccupancy' | 'sizeSqm' | 'floor' | 'checkInTime' | 'checkOutTime' | 'highlights';

import { usePermission } from "@/contexts/PermissionContext";

export function BulkEditModal({ isOpen, onClose, selectedRoomIds, onSuccess }: BulkEditModalProps) {
    const { can } = usePermission();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    // Which fields are we editing?
    const [selectedFields, setSelectedFields] = useState<EditableField[]>([]);

    // Values for those fields
    const [values, setValues] = useState<Partial<Room>>({
        highlights: []
    });

    const [highlightInput, setHighlightInput] = useState("");

    const toggleField = (field: EditableField) => {
        setSelectedFields(prev =>
            prev.includes(field)
                ? prev.filter(f => f !== field)
                : [...prev, field]
        );
    };

    const handleSubmit = async () => {
        if (selectedFields.length === 0) {
            showToast("Select at least one field to update", "error");
            return;
        }

        if (!confirm(`Are you sure you want to update ${selectedRoomIds.length} rooms? This cannot be undone.`)) {
            return;
        }

        setLoading(true);
        try {
            // Construct updates object with ONLY selected fields
            const updates: Partial<Room> = {};
            selectedFields.forEach(field => {
                // @ts-ignore - dynamic assignment
                updates[field] = values[field];
            });

            const result = await bulkUpdateRoomsAction(selectedRoomIds, updates);

            if (result.success) {
                showToast(result.message, "success");
                onSuccess();
                onClose();
                // Reset state
                setSelectedFields([]);
                setValues({ highlights: [] });
            } else {
                showToast(result.message, "error");
            }
        } catch (error) {
            showToast("Failed to run bulk update", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={true} onClose={onClose} className="max-w-2xl max-h-[90vh]">
            <ModalHeader onClose={onClose}>
                <h2 className="text-xl font-bold font-montserrat text-[var(--color-charcoal)]">
                    Bulk Edit Rooms ({selectedRoomIds.length} selected)
                </h2>
            </ModalHeader>

            <ModalBody className="space-y-6">
                <p className="text-sm text-gray-500">
                    Select properties to update. Only the selected fields will be changed.
                    Values will overwrite existing data for all selected rooms.
                </p>

                <div className="grid gap-4">
                    {/* 1. Price */}
                    <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                            type="checkbox"
                            id="field-price"
                            className="mt-1.5 h-4 w-4 rounded border-gray-300 text-[var(--color-aegean-blue)] focus:ring-[var(--color-aegean-blue)]"
                            checked={selectedFields.includes('pricePerNight')}
                            onChange={() => toggleField('pricePerNight')}
                        />
                        <div className="flex-1 space-y-2">
                            <label htmlFor="field-price" className="cursor-pointer font-bold block text-sm">Base Price per Night</label>
                            {selectedFields.includes('pricePerNight') && (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">€</span>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={values.pricePerNight || ''}
                                        onChange={e => setValues({ ...values, pricePerNight: parseFloat(e.target.value) })}
                                        placeholder="e.g. 150"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. Occupancy & Size */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                id="field-occupancy"
                                className="mt-1.5 h-4 w-4 rounded border-gray-300"
                                checked={selectedFields.includes('maxOccupancy')}
                                onChange={() => toggleField('maxOccupancy')}
                            />
                            <div className="flex-1 space-y-2">
                                <label htmlFor="field-occupancy" className="cursor-pointer font-bold block text-sm">Max Occupancy</label>
                                {selectedFields.includes('maxOccupancy') && (
                                    <Input
                                        type="number"
                                        min="1"
                                        value={values.maxOccupancy || ''}
                                        onChange={e => setValues({ ...values, maxOccupancy: parseInt(e.target.value) })}
                                        placeholder="e.g. 2"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                id="field-size"
                                className="mt-1.5 h-4 w-4 rounded border-gray-300"
                                checked={selectedFields.includes('sizeSqm')}
                                onChange={() => toggleField('sizeSqm')}
                            />
                            <div className="flex-1 space-y-2">
                                <label htmlFor="field-size" className="cursor-pointer font-bold block text-sm">Size (m²)</label>
                                {selectedFields.includes('sizeSqm') && (
                                    <Input
                                        type="number"
                                        min="1"
                                        value={values.sizeSqm || ''}
                                        onChange={e => setValues({ ...values, sizeSqm: parseFloat(e.target.value) })}
                                        placeholder="e.g. 35"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. Check-In / Check-Out Times */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                id="field-checkin"
                                className="mt-1.5 h-4 w-4 rounded border-gray-300"
                                checked={selectedFields.includes('checkInTime')}
                                onChange={() => toggleField('checkInTime')}
                            />
                            <div className="flex-1 space-y-2">
                                <label htmlFor="field-checkin" className="cursor-pointer font-bold block text-sm">Check-in Time</label>
                                {selectedFields.includes('checkInTime') && (
                                    <Input
                                        type="time"
                                        value={values.checkInTime || ''}
                                        onChange={e => setValues({ ...values, checkInTime: e.target.value })}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                id="field-checkout"
                                className="mt-1.5 h-4 w-4 rounded border-gray-300"
                                checked={selectedFields.includes('checkOutTime')}
                                onChange={() => toggleField('checkOutTime')}
                            />
                            <div className="flex-1 space-y-2">
                                <label htmlFor="field-checkout" className="cursor-pointer font-bold block text-sm">Check-out Time</label>
                                {selectedFields.includes('checkOutTime') && (
                                    <Input
                                        type="time"
                                        value={values.checkOutTime || ''}
                                        onChange={e => setValues({ ...values, checkOutTime: e.target.value })}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 4. Highlights (Overwrite) */}
                    <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                            type="checkbox"
                            id="field-highlights"
                            className="mt-1.5 h-4 w-4 rounded border-gray-300"
                            checked={selectedFields.includes('highlights')}
                            onChange={() => toggleField('highlights')}
                        />
                        <div className="flex-1 space-y-2">
                            <label htmlFor="field-highlights" className="cursor-pointer font-bold block text-sm">
                                Highlights (Overwrite)
                                <span className="text-red-500 text-xs ml-2 font-normal">Replaces existing list</span>
                            </label>
                            {selectedFields.includes('highlights') && (
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <Input
                                            type="text"
                                            placeholder="Add generic highlight (e.g. WiFi, Sea View)"
                                            value={highlightInput}
                                            onChange={e => setHighlightInput(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (highlightInput.trim()) {
                                                        setValues(prev => ({
                                                            ...prev,
                                                            highlights: [...(prev.highlights || []), highlightInput.trim()]
                                                        }));
                                                        setHighlightInput("");
                                                    }
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => {
                                                if (highlightInput.trim()) {
                                                    setValues(prev => ({
                                                        ...prev,
                                                        highlights: [...(prev.highlights || []), highlightInput.trim()]
                                                    }));
                                                    setHighlightInput("");
                                                }
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {values.highlights?.map((h, i) => (
                                            <span key={i} className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 text-xs rounded-full">
                                                {h}
                                                <button
                                                    type="button"
                                                    onClick={() => setValues(prev => ({
                                                        ...prev,
                                                        highlights: prev.highlights?.filter((_, idx) => idx !== i)
                                                    }))}
                                                    className="hover:text-red-500"
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ModalBody>

            <ModalFooter>
                <div className="flex items-center justify-between w-full">
                    <div className="text-xs text-gray-500">
                        {selectedFields.length} properties selected
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        {can('rooms.update') && (
                            <Button onClick={handleSubmit} disabled={loading || selectedFields.length === 0}>
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Update {selectedRoomIds.length} Rooms
                            </Button>
                        )}
                    </div>
                </div>
            </ModalFooter>
        </Modal>
    );
}
