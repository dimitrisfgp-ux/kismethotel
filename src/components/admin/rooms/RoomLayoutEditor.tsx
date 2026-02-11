import { Room, RoomLayoutCategory, Amenity } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/admin/Select";
import { Plus, X, Tag } from "lucide-react";
import { AmenityPickerModal } from "@/components/admin/modals/AmenityPickerModal";
import { FeaturePickerModal } from "@/components/admin/modals/FeaturePickerModal";

interface RoomLayoutEditorProps {
    room: Room;
    availableAmenities: Amenity[];
    availableFeatures: string[];
    addSection: () => void;
    removeSection: (index: number) => void;
    updateSection: <K extends keyof RoomLayoutCategory>(index: number, field: K, value: RoomLayoutCategory[K]) => void;

    // Pickers State Managers (passed from hook)
    featurePickerState: { isOpen: boolean; sectionIndex: number | null };
    setFeaturePickerState: (s: { isOpen: boolean; sectionIndex: number | null }) => void;
    pickerState: { isOpen: boolean; sectionIndex: number | null };
    setPickerState: (s: { isOpen: boolean; sectionIndex: number | null }) => void;

    // Handlers
    handleAddAmenity: (idx: number, amenity: Amenity) => void;
    removeAmenityFromSection: (idx: number, id: number) => void;
    handleAddFeature: (idx: number, feature: string) => void;
    removeFeatureFromSection: (idx: number, feature: string) => void;
}

export function RoomLayoutEditor(props: RoomLayoutEditorProps) {
    const {
        room, addSection, removeSection, updateSection,
        availableAmenities, availableFeatures,
        featurePickerState, setFeaturePickerState,
        pickerState, setPickerState,
        handleAddAmenity, removeAmenityFromSection,
        handleAddFeature, removeFeatureFromSection
    } = props;

    return (
        <div className="space-y-6 pt-4 border-t">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-montserrat">Room Layout & Amenities</h3>
                <Button type="button" variant="secondary" onClick={addSection}><Plus className="h-4 w-4 mr-2" /> Add Section</Button>
            </div>

            {room.layout.map((section, idx) => (
                <div key={idx} className="p-4 border border-[var(--color-sand)] rounded-md bg-[var(--color-warm-white)]/30 space-y-4">
                    <div className="flex gap-4">
                        <Input
                            label="Section Title"
                            value={section.title}
                            onChange={e => updateSection(idx, 'title', e.target.value)}
                            className="flex-1"
                        />
                        <div className="w-[200px]">
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
                                onChange={e => updateSection(idx, 'type', e.target.value)}
                            />
                        </div>
                        <div className="mt-7">
                            <Button type="button" variant="ghost" onClick={() => removeSection(idx)}>
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
                                    <button type="button" onClick={() => removeFeatureFromSection(idx, feature)} className="hover:text-red-500 ml-1"><X className="h-3 w-3" /></button>
                                </span>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setFeaturePickerState({ isOpen: true, sectionIndex: idx })}
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
                                    <button type="button" onClick={() => removeAmenityFromSection(idx, amenity.id)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                                </span>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setPickerState({ isOpen: true, sectionIndex: idx })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-2 bg-white border border-dashed border-[var(--color-aegean-blue)] text-[var(--color-aegean-blue)] text-xs font-medium rounded-full hover:bg-[var(--color-aegean-blue)]/5 transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                            Add Amenities
                        </button>
                    </div>
                </div>
            ))}

            {/* Modals placed here for access to props */}
            <AmenityPickerModal
                isOpen={pickerState.isOpen}
                onClose={() => setPickerState({ isOpen: false, sectionIndex: null })}
                onSelect={(amenity) => {
                    if (pickerState.sectionIndex !== null) {
                        handleAddAmenity(pickerState.sectionIndex, amenity);
                    }
                }}
                availableAmenities={availableAmenities}
            />

            <FeaturePickerModal
                isOpen={featurePickerState.isOpen}
                onClose={() => setFeaturePickerState({ isOpen: false, sectionIndex: null })}
                onSelect={(feature) => {
                    if (featurePickerState.sectionIndex !== null) {
                        handleAddFeature(featurePickerState.sectionIndex, feature);
                    }
                }}
                availableFeatures={availableFeatures}
            />
        </div>
    );
}
