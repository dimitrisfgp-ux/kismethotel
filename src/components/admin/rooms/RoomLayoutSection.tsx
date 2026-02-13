"use client";

import { RoomLayoutCategory } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/admin/Select";
import { X, Tag, Plus } from "lucide-react";

interface RoomLayoutSectionProps {
    section: RoomLayoutCategory;
    index: number;
    updateSection: <K extends keyof RoomLayoutCategory>(index: number, field: K, value: RoomLayoutCategory[K]) => void;
    removeSection: (index: number) => void;

    // Feature Handlers
    onOpenFeaturePicker: (index: number) => void;
    onRemoveFeature: (index: number, feature: string) => void;

    // Amenity Handlers
    onOpenAmenityPicker: (index: number) => void;
    onRemoveAmenity: (index: number, amenityId: number) => void;
}

export function RoomLayoutSection({
    section,
    index,
    updateSection,
    removeSection,
    onOpenFeaturePicker,
    onRemoveFeature,
    onOpenAmenityPicker,
    onRemoveAmenity
}: RoomLayoutSectionProps) {
    return (
        <div className="p-4 border border-[var(--color-sand)] rounded-md bg-[var(--color-warm-white)]/30 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 relative">
                <Input
                    label="Section Title"
                    value={section.title}
                    onChange={e => updateSection(index, 'title', e.target.value)}
                    className="flex-1"
                />
                <div className="w-full md:w-[200px]">
                    <Select
                        label="Type"
                        options={[
                            { label: 'Bedroom', value: 'bedroom' },
                            { label: 'Bathroom', value: 'bathroom' },
                            { label: 'Kitchen', value: 'kitchen' },
                            { label: 'Living', value: 'living' },
                            { label: 'Outdoor', value: 'outdoor' },
                            { label: 'Other', value: 'other' }
                        ]}
                        value={section.type}
                        onChange={e => updateSection(index, 'type', e.target.value)}
                    />
                </div>
                <div className="absolute top-0 right-0 md:static md:mt-7">
                    <Button type="button" variant="ghost" onClick={() => removeSection(index)} className="p-2 h-8 w-8 text-gray-400 hover:text-red-500">
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Features */}
            <div className="mb-4 pb-4 border-b border-[var(--color-sand)]/50">
                <label className="text-xs font-bold uppercase text-[var(--color-charcoal)]/60 mb-2 block">Features</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {(section.details || []).map((feature, fIdx) => (
                        <span key={fIdx} className="inline-flex items-center gap-1 bg-white border border-[var(--color-sand)] px-2 py-1 rounded-full text-xs text-[var(--color-charcoal)]">
                            <Tag className="w-3 h-3 opacity-50" />
                            {feature}
                            <button type="button" onClick={() => onRemoveFeature(index, feature)} className="hover:text-red-500 ml-1"><X className="h-3 w-3" /></button>
                        </span>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => onOpenFeaturePicker(index)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-dashed border-[var(--color-sand)] text-[var(--color-charcoal)]/70 text-xs font-medium rounded-full hover:border-[var(--color-aegean-blue)] hover:text-[var(--color-aegean-blue)] transition-colors"
                >
                    <Plus className="w-3 h-3" />
                    Add {section.type === 'bedroom' ? 'Feature' : 'Detail'}
                </button>
            </div>

            {/* Amenities */}
            <div>
                <label className="text-xs font-bold uppercase text-[var(--color-charcoal)]/60 mb-2 block">Amenities</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {section.amenities.map(amenity => (
                        <span key={amenity.id} className="inline-flex items-center gap-1 bg-white border border-[var(--color-sand)] px-2 py-1 rounded-full text-xs">
                            {amenity.name}
                            <button type="button" onClick={() => onRemoveAmenity(index, amenity.id)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                        </span>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => onOpenAmenityPicker(index)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-2 bg-white border border-dashed border-[var(--color-aegean-blue)] text-[var(--color-aegean-blue)] text-xs font-medium rounded-full hover:bg-[var(--color-aegean-blue)]/5 transition-colors"
                >
                    <Plus className="w-3 h-3" />
                    Add Amenities
                </button>
            </div>
        </div>
    );
}
