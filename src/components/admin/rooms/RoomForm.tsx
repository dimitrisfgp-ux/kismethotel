"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Room, RoomLayoutCategory, Amenity, RoomMedia, MediaAsset, RoomMediaCategory } from "@/types";
import { createRoomAction, saveRoomAction, getAmenitiesAction } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/admin/TextArea";
import { Select } from "@/components/ui/admin/Select";
import { useToast } from "@/contexts/ToastContext";
import { AmenityPickerModal } from "@/components/admin/modals/AmenityPickerModal";
import { FeaturePickerModal } from "@/components/admin/modals/FeaturePickerModal";
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";
import { Save, Plus, Trash2, X, Tag, BedDouble, BedSingle, Users, Image as ImageIcon, Video } from "lucide-react";
import Image from "next/image";

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
    // images: [""], // Removed Legacy
    beds: [],
    layout: [],
    highlights: [],
    media: []
};

export function RoomForm({ initialRoom, isNew = false }: RoomFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [room, setRoom] = useState<Room>(initialRoom || { ...EMPTY_ROOM, id: crypto.randomUUID() });
    const [isLoading, setIsLoading] = useState(false);
    const [availableAmenities, setAvailableAmenities] = useState<Amenity[]>([]);

    // Media State
    const [attachedMedia, setAttachedMedia] = useState<RoomMedia[]>(initialRoom?.media || []);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

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
        getAmenitiesAction().then(setAvailableAmenities);
    }, []);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!room.name.trim()) newErrors.name = "Empty Room Name";
        if (!room.slug.trim()) newErrors.slug = "Missing URL Slug";
        if (!room.pricePerNight || room.pricePerNight <= 0) newErrors.pricePerNight = "Invalid Price";
        if (!room.maxOccupancy || room.maxOccupancy <= 0) newErrors.maxOccupancy = "Invalid Occupancy";
        if (!room.sizeSqm || room.sizeSqm <= 0) newErrors.sizeSqm = "Invalid Size";
        if (room.beds.length === 0) newErrors.beds = "At least one bed required";
        if (room.layout.length === 0) newErrors.layout = "At least one layout section required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast("Please fix the errors in the form", "error");
            return;
        }

        // Legacy check removed. Rely only on new media.
        const hasNewMedia = attachedMedia.length > 0;

        if (!hasNewMedia) {
            if (!window.confirm("⚠️ No Images Detected. Proceed?")) return;
        }

        setIsLoading(true);
        try {
            // Prepare room object with attached media
            const roomData = { ...room, media: attachedMedia };

            const success = isNew
                ? await createRoomAction(roomData)
                : await saveRoomAction(roomData);

            if (success) {
                showToast(`Room ${isNew ? 'created' : 'updated'} successfully`, "success");
                router.push("/admin/rooms");
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
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // --- Legacy Image Updates Removed ---

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
            if (existingIndex >= 0) {
                newBeds = newBeds.filter(b => b.type !== type);
            }
        }

        updateField('beds', newBeds);
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

    // --- Amenity Updates ---
    const handleAddAmenity = (sectionIndex: number, amenity: Amenity) => {
        if (!availableAmenities.some(a => a.id === amenity.id)) {
            setAvailableAmenities(prev => [...prev, amenity]);
        }
        const newLayout = [...room.layout];
        const section = newLayout[sectionIndex];
        if (!section.amenities.some(a => a.id === amenity.id)) {
            section.amenities = [...section.amenities, amenity];
            updateField('layout', newLayout);
        }
    };

    const removeAmenityFromSection = (sectionIndex: number, amenityId: number) => {
        const newLayout = [...room.layout];
        newLayout[sectionIndex].amenities = newLayout[sectionIndex].amenities.filter(a => a.id !== amenityId);
        updateField('layout', newLayout);
    };

    // --- Feature Updates ---
    const handleAddFeature = (sectionIndex: number, feature: string) => {
        if (!availableFeatures.includes(feature)) {
            setAvailableFeatures(prev => [...prev, feature]);
        }
        const newLayout = [...room.layout];
        const section = newLayout[sectionIndex];
        if (!section.details.includes(feature)) {
            section.details = [...(section.details || []), feature];
            updateField('layout', newLayout);
        }
    };

    const removeFeatureFromSection = (sectionIndex: number, feature: string) => {
        const newLayout = [...room.layout];
        newLayout[sectionIndex].details = newLayout[sectionIndex].details.filter(f => f !== feature);
        updateField('layout', newLayout);
    };

    // --- Media Helpers ---
    const getMediaByCategory = (category: 'primary' | 'secondary' | 'gallery') => {
        return attachedMedia.filter(m => m.category === category).sort((a, b) => a.displayOrder - b.displayOrder);
    };

    const handleAddMediaToCategory = (asset: MediaAsset, category: RoomMediaCategory) => {
        // Validation: Primary can only have 1
        if (category === 'primary') {
            setAttachedMedia(prev => {
                // Remove any existing media of this category to strictly enforce 1.
                const others = prev.filter(m => m.category !== category);
                return [...others, { ...asset, category, displayOrder: 0, isPrimary: category === 'primary' }];
            });
        } else if (category === 'secondary') {
            // limit to 2?
            setAttachedMedia(prev => {
                const updated = [...prev, { ...asset, category, displayOrder: prev.length, isPrimary: false }];
                return updated;
            });
        } else { // gallery
            setAttachedMedia(prev => [...prev, { ...asset, category, displayOrder: prev.length, isPrimary: false }]);
        }
        setIsMediaPickerOpen(false);
    };

    const removeMedia = (id: string) => {
        setAttachedMedia(prev => prev.filter(m => m.id !== id));
    };

    // --- Tab State ---
    const [activeTab, setActiveTab] = useState<'details' | 'media'>('details');
    // Track which category we are currently picking for
    const [pickingCategory, setPickingCategory] = useState<RoomMediaCategory | null>(null);

    const openPickerFor = (category: RoomMediaCategory) => {
        setPickingCategory(category);
        setIsMediaPickerOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-sand)] pb-4 bg-white p-6 rounded-lg shadow-sm">
                <div>
                    <h2 className="text-xl font-bold font-montserrat text-[var(--color-charcoal)]">
                        {isNew ? "Create Room" : "Edit Room"}
                    </h2>
                    <p className="text-sm text-gray-500">{room.name || "New Room"}</p>
                </div>
                <Button type="button" onClick={handleSubmit} isLoading={isLoading} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Room
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'details' ? 'border-[var(--color-aegean-blue)] text-[var(--color-aegean-blue)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Room Details
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('media')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'media' ? 'border-[var(--color-aegean-blue)] text-[var(--color-aegean-blue)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Media Config
                </button>
            </div>

            {/* ERROR SUMMARY */}
            {Object.keys(errors).length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    <p className="font-bold">Please fix field errors:</p>
                    <ul className="list-disc list-inside text-sm mt-1">
                        {Object.entries(errors).map(([k, v]) => <li key={k}>{v}</li>)}
                    </ul>
                </div>
            )}

            {/* DETAILS TAB */}
            {activeTab === 'details' && (
                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg border border-[var(--color-sand)] shadow-sm animate-in fade-in duration-300">

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

                    {/* Room Layout & Amenities */}
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
                    </div>
                </form>
            )}

            {/* MEDIA TAB */}
            {activeTab === 'media' && (
                <div className="space-y-8 bg-white p-6 rounded-lg border border-[var(--color-sand)] shadow-sm animate-in fade-in duration-300">

                    {/* Primary Image Slot */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <h3 className="text-lg font-bold text-[var(--color-aegean-blue)]">Primary Image</h3>
                            <span className="text-xs text-gray-500">Appears in Hero background (Desktop)</span>
                        </div>
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex justify-center">
                            {/* Single Slot */}
                            {(() => {
                                const primary = getMediaByCategory('primary')[0];
                                return primary ? (
                                    <div className="relative aspect-video w-full max-w-2xl bg-gray-200 rounded-lg overflow-hidden group">
                                        <Image src={primary.url} alt="Primary" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeMedia(primary.id)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">Primary</div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => openPickerFor('primary')}
                                        className="aspect-video w-full max-w-2xl border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                                    >
                                        <ImageIcon className="w-12 h-12 mb-2" />
                                        <span className="font-medium">Select Primary Image</span>
                                    </button>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Secondary Images Slots */}
                    <div className="space-y-4 pt-6 border-t">
                        <div className="flex justify-between items-end">
                            <h3 className="text-lg font-bold text-[var(--color-charcoal)]">Secondary Images</h3>
                            <span className="text-xs text-gray-500">Appear next to Hero (Desktop)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[0, 1].map(i => {
                                const secondaries = getMediaByCategory('secondary');
                                const item = secondaries[i];
                                return (
                                    <div key={i} className="aspect-[4/3] bg-gray-50 border border-gray-200 rounded-lg relative group">
                                        {item ? (
                                            <>
                                                <Image src={item.url} alt="Secondary" fill className="object-cover rounded-lg" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedia(item.id)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => openPickerFor('secondary')}
                                                className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                                            >
                                                <Plus className="w-8 h-8 mb-1" />
                                                <span className="text-xs font-medium">Add Secondary</span>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className="space-y-4 pt-6 border-t">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-[var(--color-charcoal)]">Gallery</h3>
                            <Button type="button" variant="outline" size="sm" onClick={() => openPickerFor('gallery')}>
                                <Plus className="h-4 w-4 mr-2" /> Add Photos
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {getMediaByCategory('gallery').map(m => (
                                <div key={m.id} className="aspect-square relative group rounded-lg overflow-hidden bg-gray-100">
                                    <Image src={m.url} alt="Gallery" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeMedia(m.id)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => openPickerFor('gallery')}
                                className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                            >
                                <Plus className="w-8 h-8" />
                            </button>
                        </div>
                    </div>

                    {/* Legacy Fallback removed */}
                </div>
            )}

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

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSelect={(media) => pickingCategory && handleAddMediaToCategory(media, pickingCategory)}
            />
        </div>
    );
}

