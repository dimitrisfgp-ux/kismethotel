"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Room, RoomLayoutCategory, Amenity } from "@/types";
// import { roomService } from "@/services/roomService"; // Removed client-side service
import { createRoomAction, saveRoomAction } from "@/app/actions";
import { contentService } from "@/services/contentService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/admin/TextArea";
import { Select } from "@/components/ui/admin/Select";
import { useToast } from "@/contexts/ToastContext";
import { AmenityPickerModal } from "@/components/admin/modals/AmenityPickerModal";
import { FeaturePickerModal } from "@/components/admin/modals/FeaturePickerModal";
import { Save, Plus, Trash2, X, Tag, BedDouble, BedSingle, Users } from "lucide-react";

interface RoomFormProps {
    initialRoom?: Room;
    isNew?: boolean;
}

const EMPTY_ROOM: Room = {
    id: "",
    slug: "",
    name: "",
    description: "",
    sizeSqm: 30,
    floor: 0,
    maxOccupancy: 2,
    pricePerNight: 100,
    images: [""],
    beds: [], // Simplified for now
    layout: [],
    highlights: []
};

export function RoomForm({ initialRoom, isNew = false }: RoomFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [room, setRoom] = useState<Room>(initialRoom || { ...EMPTY_ROOM, id: crypto.randomUUID() });
    const [isLoading, setIsLoading] = useState(false);
    const [availableAmenities, setAvailableAmenities] = useState<Amenity[]>([]);

    // Features (Details) Logic
    const [availableFeatures, setAvailableFeatures] = useState<string[]>([
        "Sea View", "Garden View", "King Size Bed", "En-suite Bathroom",
        "Balcony", "Mini Bar", "Work Desk", "Walk-in Closet",
        "Soundproof", "Air Conditioning", "Rain Shower", "Smart TV"
    ]);
    const [featurePickerState, setFeaturePickerState] = useState<{ isOpen: boolean; sectionIndex: number | null }>({
        isOpen: false,
        sectionIndex: null
    });

    const [pickerState, setPickerState] = useState<{ isOpen: boolean; sectionIndex: number | null }>({
        isOpen: false,
        sectionIndex: null
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        contentService.getAmenities().then(setAvailableAmenities);
    }, []);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!room.name.trim()) {
            newErrors.name = "Empty Room Name. How will the customer recognise what they paid for?";
        }
        if (!room.slug.trim()) {
            newErrors.slug = "This creates the online address. Please fill it contextually and meaningfully for the user";
        }
        if (!room.pricePerNight || room.pricePerNight <= 0) {
            newErrors.pricePerNight = "How much does the room cost?";
        }
        if (!room.maxOccupancy || room.maxOccupancy <= 0) {
            newErrors.maxOccupancy = "Missing Max Occupancy Specification. The customer buys an affordable room and brings 15 friends and relatives. Are you ok with that? If not, specify the Max Occupancy";
        }
        if (!room.sizeSqm || room.sizeSqm <= 0) {
            newErrors.sizeSqm = "Specify the size of the room";
        }
        if (room.beds.length === 0) {
            newErrors.beds = "Please specify at least one bed (Single or Double). Guests cannot sleep on the floor!";
        }
        if (room.layout.length === 0) {
            newErrors.layout = "Accomodation should have at least one living space to offer. It would be camping otherwise";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Run Validation
        if (!validateForm()) {
            showToast("Please fix the errors in the form", "error");
            return;
        }

        // 2. Warning for missing images
        if (!room.images || room.images.length === 0 || room.images.every(img => !img.trim())) {
            const proceed = window.confirm(
                "⚠️ No Images Detected\n\nThis room will be displayed with an 'Available Soon' placeholder on the website.\n\nDo you want to proceed?"
            );
            if (!proceed) return;
        }

        setIsLoading(true);
        try {
            const success = isNew
                ? await createRoomAction(room)
                : await saveRoomAction(room);

            if (success) {
                showToast(`Room ${isNew ? 'created' : 'updated'} successfully`, "success");
                router.push("/admin/rooms");
                // router.refresh(); // Actions handle revalidation
            } else {
                showToast("Failed to save room", "error");
            }
        } catch (_error) {
            showToast("An error occurred", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Basic Field Updates ---
    const updateField = <K extends keyof Room>(field: K, value: Room[K]) => {
        setRoom(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // --- Image Updates ---
    const updateImage = (index: number, value: string) => {
        const newImages = [...room.images];
        newImages[index] = value;
        updateField('images', newImages);
    };

    const addImage = () => updateField('images', [...room.images, ""]);
    const removeImage = (index: number) => updateField('images', room.images.filter((_, i) => i !== index));

    const getBedCount = (type: 'single' | 'double') => {
        return room.beds.find(b => b.type === type)?.count || 0;
    };

    const updateBedCount = (type: 'single' | 'double', count: number) => {
        let newBeds = [...room.beds];
        const existingIndex = newBeds.findIndex(b => b.type === type);

        if (count > 0) {
            if (existingIndex >= 0) {
                newBeds[existingIndex].count = count;
            } else {
                newBeds.push({ type, count });
            }
        } else {
            // Remove if count is 0
            if (existingIndex >= 0) {
                newBeds = newBeds.filter(b => b.type !== type);
            }
        }

        updateField('beds', newBeds);

        // Clear bed error
        if (errors.beds && (newBeds.length > 0)) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.beds;
                return newErrors;
            });
        }
    };

    // --- Layout (Section) Updates ---
    const addSection = () => {
        const newSection: RoomLayoutCategory = {
            title: "New Section",
            type: "generic",
            details: [],
            amenities: []
        };
        updateField('layout', [...room.layout, newSection]);
        // Clear layout error
        if (errors.layout) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.layout;
                return newErrors;
            });
        }
    };

    const removeSection = (index: number) => {
        updateField('layout', room.layout.filter((_, i) => i !== index));
    };

    const updateSection = <K extends keyof RoomLayoutCategory>(index: number, field: K, value: RoomLayoutCategory[K]) => {
        const newLayout = [...room.layout];
        newLayout[index] = { ...newLayout[index], [field]: value };
        updateField('layout', newLayout);
    };



    // ...

    // --- Amenity Updates (Nested in Section) ---
    const handleAddAmenity = (sectionIndex: number, amenity: Amenity) => {
        // If it's a new custom amenity, add it to our available pool so it can be reused
        if (!availableAmenities.some(a => a.id === amenity.id)) {
            setAvailableAmenities(prev => [...prev, amenity]);
        }

        const newLayout = [...room.layout];
        const section = newLayout[sectionIndex];

        // Avoid duplicates in this specific section
        if (!section.amenities.some(a => a.id === amenity.id)) {
            section.amenities = [...section.amenities, amenity];
            updateField('layout', newLayout);
        }
    };

    /* Deprecated old handler
    const addAmenityToSection = (sectionIndex: number, amenityName: string) => {
        ...
    };
    */

    const removeAmenityFromSection = (sectionIndex: number, amenityId: number) => {
        const newLayout = [...room.layout];
        newLayout[sectionIndex].amenities = newLayout[sectionIndex].amenities.filter(a => a.id !== amenityId);
        updateField('layout', newLayout);
    };

    // --- Feature Updates ---
    const handleAddFeature = (sectionIndex: number, feature: string) => {
        // Add to pool if new
        if (!availableFeatures.includes(feature)) {
            setAvailableFeatures(prev => [...prev, feature]);
        }

        const newLayout = [...room.layout];
        const section = newLayout[sectionIndex];

        // Avoid duplicates in section
        if (!section.details.includes(feature)) {
            // Ensure details array exists (defensive)
            section.details = [...(section.details || []), feature];
            updateField('layout', newLayout);
        }
    };

    const removeFeatureFromSection = (sectionIndex: number, feature: string) => {
        const newLayout = [...room.layout];
        newLayout[sectionIndex].details = newLayout[sectionIndex].details.filter(f => f !== feature);
        updateField('layout', newLayout);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg border border-[var(--color-sand)] shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-sand)] pb-4">
                <h2 className="text-xl font-bold font-montserrat text-[var(--color-charcoal)]">
                    {isNew ? "Create Room" : "Edit Room"}
                </h2>
                <Button type="submit" isLoading={isLoading} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Room
                </Button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input error={errors.name} label="Name" value={room.name} onChange={e => updateField('name', e.target.value)} />
                <Input error={errors.slug} label="Slug (URL)" value={room.slug} onChange={e => updateField('slug', e.target.value)} />
                <Input error={errors.pricePerNight} label="Price (€)" type="number" value={room.pricePerNight} onChange={e => updateField('pricePerNight', Number(e.target.value))} />
                <Input icon={Users} error={errors.maxOccupancy} label="Occupancy" type="number" value={room.maxOccupancy} onChange={e => updateField('maxOccupancy', Number(e.target.value))} />
                <Input error={errors.sizeSqm} label="Size (m²)" type="number" value={room.sizeSqm} onChange={e => updateField('sizeSqm', Number(e.target.value))} />
                <Input label="Floor" type="number" value={room.floor} onChange={e => updateField('floor', Number(e.target.value))} />

                {/* Bed Configuration */}
                <div className="md:col-span-2 space-y-3 p-4 border border-[var(--color-sand)] rounded-md bg-[var(--color-warm-white)]/30">
                    <label className="text-sm font-medium text-[var(--color-charcoal)]">Bed Configuration</label>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            icon={BedDouble}
                            label="Double Beds"
                            type="number"
                            min={0}
                            value={getBedCount('double')}
                            onChange={e => updateBedCount('double', Number(e.target.value))}
                        />
                        <Input
                            icon={BedSingle}
                            label="Single Beds"
                            type="number"
                            min={0}
                            value={getBedCount('single')}
                            onChange={e => updateBedCount('single', Number(e.target.value))}
                        />
                    </div>
                    {errors.beds && <p className="text-xs text-red-500 font-medium mt-1">{errors.beds}</p>}
                </div>
            </div>

            <TextArea label="Description" value={room.description} onChange={e => updateField('description', e.target.value)} rows={4} />

            {/* Images */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[var(--color-aegean-blue)]">Images (URLs)</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addImage}><Plus className="h-3 w-3 mr-1" /> Add URL</Button>
                </div>
                {room.images.map((url, i) => (
                    <div key={i} className="flex gap-2">
                        <Input value={url} onChange={e => updateImage(i, e.target.value)} placeholder="https://..." className="flex-1" />
                        <Button type="button" variant="ghost" onClick={() => removeImage(i)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                    </div>
                ))}
            </div>

            {/* Dynamic Layout Sections */}
            <div className="space-y-6 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold font-montserrat">Room Layout & Amenities</h3>
                    <Button type="button" variant="secondary" onClick={addSection}><Plus className="h-4 w-4 mr-2" /> Add Section</Button>
                </div>

                {errors.layout && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                        {errors.layout}
                    </div>
                )}

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

                        {/* Features in Section */}
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

                        {/* Amenities in Section */}
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
                ))}
            </div>

            {/* Amenity Picker Modal */}
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

            {/* Feature Picker Modal */}
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
        </form>
    );
}
