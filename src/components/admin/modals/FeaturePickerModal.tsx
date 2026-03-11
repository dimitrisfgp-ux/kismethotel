import { useState } from "react";
import { Plus, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/Modal";

interface FeaturePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (feature: string) => void;
    availableFeatures: string[];
}

export function FeaturePickerModal({ isOpen, onClose, onSelect, availableFeatures }: FeaturePickerModalProps) {
    const [mode, setMode] = useState<'select' | 'create'>('select');
    const [newFeatureName, setNewFeatureName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    // Filter existing features
    const filteredFeatures = availableFeatures.filter(f =>
        f.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        if (!newFeatureName.trim()) return;
        onSelect(newFeatureName.trim());
        onClose();

        // Reset form
        setNewFeatureName("");
        setMode('select');
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={true} onClose={onClose} size="md">
            <ModalHeader onClose={onClose} className="bg-[var(--color-warm-white)]">
                {mode === 'select' ? "Add Feature" : "Create Custom Feature"}
            </ModalHeader>

            <ModalBody className="max-h-[70vh] overflow-y-auto">
                {mode === 'select' ? (
                    <div className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search features (e.g. 'Sea View')..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--color-sand)] rounded-md focus:outline-none focus:border-[var(--color-aegean-blue)] transition-colors"
                            />
                        </div>

                        {/* List */}
                        <div className="flex flex-wrap gap-2">
                            {filteredFeatures.map((feature, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { onSelect(feature); onClose(); }}
                                    className="flex items-center gap-2 px-3 py-2 bg-[var(--color-warm-white)] border border-[var(--color-sand)] rounded-full hover:border-[var(--color-aegean-blue)] hover:text-[var(--color-aegean-blue)] transition-all group"
                                >
                                    <Tag className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                                    <span className="text-sm font-medium">{feature}</span>
                                </button>
                            ))}
                            {filteredFeatures.length === 0 && (
                                <p className="text-xs text-gray-400 w-full text-center py-4">
                                    No matching features found.
                                </p>
                            )}
                        </div>

                        {/* Create Option */}
                        <div className="pt-4 border-t border-[var(--color-sand)]">
                            <button
                                onClick={() => setMode('create')}
                                className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[var(--color-aegean-blue)] hover:text-[var(--color-aegean-blue)] transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="text-sm">Create New Custom Feature</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Input
                            label="Feature Name"
                            placeholder="e.g. Walk-in Closet"
                            value={newFeatureName}
                            onChange={(e) => setNewFeatureName(e.target.value)}
                            autoFocus
                        />

                        <div className="pt-4 flex gap-3">
                            <Button variant="ghost" onClick={() => setMode('select')} className="flex-1">Back</Button>
                            <Button onClick={handleCreate} disabled={!newFeatureName.trim()} className="flex-1">Create & Add</Button>
                        </div>
                    </div>
                )}
            </ModalBody>
        </Modal>
    );
}
