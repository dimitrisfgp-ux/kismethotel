"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { IconPicker } from "@/components/ui/admin/IconPicker";
import { Amenity } from "@/types";
import * as Icons from "lucide-react";

interface AmenityPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (amenity: Amenity) => void;
    availableAmenities: Amenity[];
}

export function AmenityPickerModal({ isOpen, onClose, onSelect, availableAmenities }: AmenityPickerModalProps) {
    const [mode, setMode] = useState<'select' | 'create'>('select');
    const [newAmenityName, setNewAmenityName] = useState("");
    const [newAmenityIcon, setNewAmenityIcon] = useState("Star"); // Default icon
    const [searchTerm, setSearchTerm] = useState("");
    const modalRef = useRef<HTMLDivElement>(null);

    // Filter existing amenities
    const filteredAmenities = availableAmenities.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleCreateWrapper = () => {
        if (!newAmenityName.trim()) return;

        // Construct a new temporary amenity object
        // In a real app, this might save to DB immediately or wait until Room save
        // For now, we generate a random ID to satisfy the type
        const newAmenity: Amenity = {
            id: Math.floor(Math.random() * 10000) + 1000,
            name: newAmenityName,
            iconName: newAmenityIcon
        };

        onSelect(newAmenity);
        onClose();

        // Reset form
        setNewAmenityName("");
        setNewAmenityIcon("Star");
        setMode('select');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-sand">
                    <h3 className="font-montserrat font-bold text-lg text-charcoal">
                        {mode === 'select' ? "Add Amenity" : "Create Custom Amenity"}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">

                    {mode === 'select' ? (
                        <div className="space-y-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search amenities..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-sand rounded-md focus:outline-none focus:border-aegean-blue transition-colors"
                                />
                            </div>

                            {/* List */}
                            <div className="flex flex-wrap gap-2">
                                {filteredAmenities.map(amenity => {
                                    // Dynamic Icon from lucide-react
                                    const IconComponent = ((Icons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[amenity.iconName] || Icons.Star;
                                    return (
                                        <button
                                            key={amenity.id}
                                            onClick={() => { onSelect(amenity); onClose(); }}
                                            className="flex items-center gap-2 px-3 py-2 bg-warm-white border border-sand rounded-full hover:border-aegean-blue hover:text-aegean-blue transition-all group"
                                        >
                                            <IconComponent className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                                            <span className="text-sm font-medium">{amenity.name}</span>
                                        </button>
                                    );
                                })}
                                {filteredAmenities.length === 0 && (
                                    <p className="text-xs text-gray-400 w-full text-center py-4">No matching amenities found.</p>
                                )}
                            </div>

                            {/* Create Option */}
                            <div className="pt-4 border-t border-sand">
                                <button
                                    onClick={() => setMode('create')}
                                    className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-aegean-blue hover:text-aegean-blue transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="text-sm">Create New Custom Amenity</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Input
                                label="Amenity Name"
                                placeholder="e.g. Smart TV"
                                value={newAmenityName}
                                onChange={(e) => setNewAmenityName(e.target.value)}
                                autoFocus
                            />

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-charcoal pl-1">Select Icon</label>
                                <IconPicker
                                    value={newAmenityIcon}
                                    onChange={setNewAmenityIcon}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button variant="ghost" onClick={() => setMode('select')} className="flex-1">Back</Button>
                                <Button onClick={handleCreateWrapper} disabled={!newAmenityName.trim()} className="flex-1">Create & Add</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
