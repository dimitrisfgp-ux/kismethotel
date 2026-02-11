import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Room, RoomLayoutCategory, Amenity, RoomMedia, MediaAsset, RoomMediaCategory } from "@/types";
import { createRoomAction, saveRoomAction, getAmenitiesAction } from "@/app/actions";
import { useToast } from "@/contexts/ToastContext";

const EMPTY_ROOM: Room = {
    id: "",
    slug: "",
    name: "",
    description: "",
    sizeSqm: 30,
    floor: 0,
    maxOccupancy: 2,
    pricePerNight: 100,
    beds: [],
    layout: [],
    highlights: [],
    media: []
};

interface UseRoomFormProps {
    initialRoom?: Room;
    isNew?: boolean;
}

export function useRoomForm({ initialRoom, isNew = false }: UseRoomFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [room, setRoom] = useState<Room>(initialRoom || { ...EMPTY_ROOM, id: crypto.randomUUID() });
    const [isLoading, setIsLoading] = useState(false);
    const [availableAmenities, setAvailableAmenities] = useState<Amenity[]>([]);

    // Media State
    const [attachedMedia, setAttachedMedia] = useState<RoomMedia[]>(initialRoom?.media || []);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [pickingCategory, setPickingCategory] = useState<RoomMediaCategory | null>(null);

    // Picker States
    const [featurePickerState, setFeaturePickerState] = useState<{ isOpen: boolean; sectionIndex: number | null }>({
        isOpen: false,
        sectionIndex: null
    });
    const [pickerState, setPickerState] = useState<{ isOpen: boolean; sectionIndex: number | null }>({
        isOpen: false,
        sectionIndex: null
    });

    const [availableFeatures, setAvailableFeatures] = useState<string[]>([
        "Sea View", "Garden View", "King Size Bed", "En-suite Bathroom",
        "Balcony", "Mini Bar", "Work Desk", "Walk-in Closet",
        "Soundproof", "Air Conditioning", "Rain Shower", "Smart TV"
    ]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getAmenitiesAction().then(setAvailableAmenities);
    }, []);

    // --- Validation ---
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

    // --- Submit ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            showToast("Please fix the errors in the form", "error");
            return;
        }

        const hasNewMedia = attachedMedia.length > 0;
        if (!hasNewMedia) {
            if (!window.confirm("⚠️ No Images Detected. Proceed?")) return;
        }

        setIsLoading(true);
        try {
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

    // --- Basic Updates ---
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

    const getBedCount = (type: 'single' | 'double') => {
        return room.beds.find(b => b.type === type)?.count || 0;
    };

    const updateBedCount = (type: 'single' | 'double', count: number) => {
        let newBeds = [...room.beds];
        const existingIndex = newBeds.findIndex(b => b.type === type);

        if (count > 0) {
            if (existingIndex >= 0) newBeds[existingIndex].count = count;
            else newBeds.push({ type, count });
        } else {
            if (existingIndex >= 0) newBeds = newBeds.filter(b => b.type !== type);
        }

        updateField('beds', newBeds);
    };

    // --- Layout Updates ---
    const addSection = () => {
        const newSection: RoomLayoutCategory = {
            title: "New Section",
            type: "generic",
            details: [],
            amenities: []
        };
        updateField('layout', [...room.layout, newSection]);
    };

    const removeSection = (index: number) => {
        updateField('layout', room.layout.filter((_, i) => i !== index));
    };

    const updateSection = <K extends keyof RoomLayoutCategory>(index: number, field: K, value: RoomLayoutCategory[K]) => {
        const newLayout = [...room.layout];
        newLayout[index] = { ...newLayout[index], [field]: value };
        updateField('layout', newLayout);
    };

    // --- Items Updates (Amenities/Features) ---
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

    // --- Media ---
    const getMediaByCategory = (category: 'primary' | 'secondary' | 'gallery') => {
        return attachedMedia.filter(m => m.category === category).sort((a, b) => a.displayOrder - b.displayOrder);
    };

    const handleAddMediaToCategory = (asset: MediaAsset, category: RoomMediaCategory) => {
        if (category === 'primary') {
            setAttachedMedia(prev => {
                const others = prev.filter(m => m.category !== category);
                return [...others, { ...asset, category, displayOrder: 0, isPrimary: true }];
            });
        } else {
            setAttachedMedia(prev => [...prev, { ...asset, category, displayOrder: prev.length, isPrimary: false }]);
        }
        setIsMediaPickerOpen(false);
    };

    const removeMedia = (id: string) => {
        setAttachedMedia(prev => prev.filter(m => m.id !== id));
    };

    const openPickerFor = (category: RoomMediaCategory) => {
        setPickingCategory(category);
        setIsMediaPickerOpen(true);
    };

    return {
        room, isLoading, errors, availableAmenities, availableFeatures,
        attachedMedia, isMediaPickerOpen, setIsMediaPickerOpen, pickingCategory,
        featurePickerState, setFeaturePickerState, pickerState, setPickerState,
        handleSubmit, updateField, getBedCount, updateBedCount,
        addSection, removeSection, updateSection,
        handleAddAmenity, removeAmenityFromSection,
        handleAddFeature, removeFeatureFromSection,
        getMediaByCategory, handleAddMediaToCategory, removeMedia, openPickerFor
    };
}
