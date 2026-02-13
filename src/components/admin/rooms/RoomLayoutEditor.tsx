import { Room, RoomLayoutCategory, Amenity } from "@/types";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { AmenityPickerModal } from "@/components/admin/modals/AmenityPickerModal";
import { FeaturePickerModal } from "@/components/admin/modals/FeaturePickerModal";
import { RoomLayoutSection } from "./RoomLayoutSection";

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
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h3 className="text-lg font-bold font-montserrat">Room Layout & Amenities</h3>
                <Button type="button" variant="secondary" onClick={addSection} className="w-full md:w-auto"><Plus className="h-4 w-4 mr-2" /> Add Section</Button>
            </div>

            {room.layout.map((section, idx) => (
                <RoomLayoutSection
                    key={idx}
                    section={section}
                    index={idx}
                    updateSection={updateSection}
                    removeSection={removeSection}
                    onOpenFeaturePicker={(index) => setFeaturePickerState({ isOpen: true, sectionIndex: index })}
                    onRemoveFeature={removeFeatureFromSection}
                    onOpenAmenityPicker={(index) => setPickerState({ isOpen: true, sectionIndex: index })}
                    onRemoveAmenity={removeAmenityFromSection}
                />
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
