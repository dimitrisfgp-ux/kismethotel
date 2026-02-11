import { useState } from "react";
import { Convenience, LocationCategory, PageContent } from "@/types";
import { updateLocationsAction, updateCategoriesAction, updatePageContentAction, deleteCategoryAction } from "@/app/actions/content";
import { useToast } from "@/contexts/ToastContext";
import { DEFAULT_CATEGORY_COLOR } from "@/lib/constants";

interface UseLocationsManagerProps {
    initialLocations: Convenience[];
    initialCategories: LocationCategory[];
    initialPageContent: PageContent;
}

export function useLocationsManager({ initialLocations, initialCategories, initialPageContent }: UseLocationsManagerProps) {
    const [locations, setLocations] = useState<Convenience[]>(initialLocations);
    const [categories, setCategories] = useState<LocationCategory[]>(initialCategories);
    const [sectionTitle, setSectionTitle] = useState(initialPageContent.locationsSection?.title || "Easy Access to Conveniences");
    const [sectionSubtitle, setSectionSubtitle] = useState(initialPageContent.locationsSection?.subtitle || "Discover local essentials just steps away.");

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([]);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingLocationId, setEditingLocationId] = useState<string | null>(null);

    // Tracking
    const [deletedCategoryIds, setDeletedCategoryIds] = useState<string[]>([]);
    const [persistedIds, setPersistedIds] = useState<Set<string>>(new Set(initialCategories.map(c => c.id)));

    const { showToast } = useToast();

    // --- Actions ---

    const toggleCategory = (id: string) => {
        setExpandedCategoryIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const addCategory = () => {
        const newId = `cat_${Date.now()}`;
        const newCategory: LocationCategory = {
            id: newId,
            label: "",
            icon: "MapPin",
            color: DEFAULT_CATEGORY_COLOR
        };
        setCategories([...categories, newCategory]);
        setEditingCategoryId(newId);
        setExpandedCategoryIds(prev => [...prev, newId]);
    };

    const updateCategory = (id: string, field: keyof LocationCategory, value: string) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const deleteCategory = (id: string) => {
        if (confirm("Delete this category? Locations inside will be deleted or need reassignment.")) {
            if (persistedIds.has(id)) {
                setDeletedCategoryIds(prev => [...prev, id]);
            }
            setCategories(prev => prev.filter(c => c.id !== id));
            setLocations(prev => prev.filter(l => l.categoryId !== id));
        }
    };

    const addLocation = (categoryId: string) => {
        const newId = `loc_${Date.now()}`;
        const newLocation: Convenience = {
            id: newId,
            name: "",
            categoryId: categoryId,
            lat: 35.3375,
            lng: 25.1340,
            type: "Attraction", // Default type
            distanceLabel: ""
        };
        setLocations([...locations, newLocation]);
        setEditingLocationId(newId);
        if (!expandedCategoryIds.includes(categoryId)) {
            toggleCategory(categoryId);
        }
    };

    const updateLocation = (id: string, field: keyof Convenience, value: any) => {
        setLocations(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
    };

    const deleteLocation = (id: string) => {
        setLocations(prev => prev.filter(l => l.id !== id));
    };

    const saveChanges = async () => {
        setIsLoading(true);
        try {
            const updatedContent = {
                ...initialPageContent,
                locationsSection: {
                    title: sectionTitle,
                    subtitle: sectionSubtitle
                }
            };

            if (deletedCategoryIds.length > 0) {
                await Promise.all(deletedCategoryIds.map(id => deleteCategoryAction(id)));
            }

            const results = await Promise.all([
                updateCategoriesAction(categories),
                updateLocationsAction(locations),
                updatePageContentAction(updatedContent)
            ]);

            if (results.every(r => r)) {
                showToast("All changes saved successfully", "success");
                setPersistedIds(new Set(categories.map(c => c.id)));
                setDeletedCategoryIds([]);
                setEditingCategoryId(null);
                setEditingLocationId(null);
            } else {
                showToast("Saved with some errors", "error");
            }
        } catch (_error) {
            showToast("An error occurred while saving", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        // State
        locations,
        categories,
        sectionTitle,
        sectionSubtitle,
        isLoading,
        expandedCategoryIds,
        editingCategoryId,
        editingLocationId,

        // Setters
        setSectionTitle,
        setSectionSubtitle,
        setEditingCategoryId,
        setEditingLocationId,

        // Actions
        toggleCategory,
        addCategory,
        updateCategory,
        deleteCategory,
        addLocation,
        updateLocation,
        deleteLocation,
        saveChanges
    };
}
