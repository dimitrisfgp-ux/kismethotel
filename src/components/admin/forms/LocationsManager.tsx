"use client";

import { useState } from "react";
import { Convenience, LocationCategory, PageContent } from "@/types";
import { updateLocationsAction, updateCategoriesAction, updatePageContentAction, deleteCategoryAction } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CategoryRow } from "@/components/admin/locations/CategoryRow";
import { useToast } from "@/contexts/ToastContext";
import { Save, Plus, MapPin, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_CATEGORY_COLOR } from "@/lib/constants";

interface LocationsManagerProps {
    initialLocations: Convenience[];
    initialCategories: LocationCategory[];
    initialPageContent: PageContent;
}

export function LocationsManager({ initialLocations, initialCategories, initialPageContent }: LocationsManagerProps) {
    const [locations, setLocations] = useState<Convenience[]>(initialLocations);
    const [categories, setCategories] = useState<LocationCategory[]>(initialCategories);
    const [sectionTitle, setSectionTitle] = useState(initialPageContent.locationsSection?.title || "Easy Access to Conveniences");
    const [sectionSubtitle, setSectionSubtitle] = useState(initialPageContent.locationsSection?.subtitle || "Discover local essentials just steps away.");

    const [isLoading, setIsLoading] = useState(false);
    const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([]);
    const [editingLocationId, setEditingLocationId] = useState<number | null>(null);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [deletedCategoryIds, setDeletedCategoryIds] = useState<string[]>([]);
    // Track IDs that are known to be in the database
    const [persistedIds, setPersistedIds] = useState<Set<string>>(new Set(initialCategories.map(c => c.id)));

    const { showToast } = useToast();

    // Toggle Category Accordion
    const toggleCategory = (id: string) => {
        setExpandedCategoryIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    // --- Category Logic ---

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
            // Track for deletion on Save if it's a persisted category
            if (persistedIds.has(id)) {
                setDeletedCategoryIds(prev => [...prev, id]);
            }
            setCategories(prev => prev.filter(c => c.id !== id));
            // Also delete (or orphan) locations? Let's delete for now as per "Nested" concept
            setLocations(prev => prev.filter(l => l.categoryId !== id));
        }
    };

    // --- Location Logic ---

    const addLocation = (categoryId: string) => {
        const newId = Math.max(0, ...locations.map(l => l.id)) + 1;
        const newLocation: Convenience = {
            id: newId,
            name: "",
            categoryId: categoryId,
            lat: 35.3375,
            lng: 25.1340,
            distanceLabel: ""
        };
        setLocations([...locations, newLocation]);
        setEditingLocationId(newId);
        if (!expandedCategoryIds.includes(categoryId)) {
            toggleCategory(categoryId);
        }
    };

    const updateLocation = (id: number, field: keyof Convenience, value: any) => {
        setLocations(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
    };

    const deleteLocation = (id: number) => {
        setLocations(prev => prev.filter(l => l.id !== id));
    };

    // --- Save ---

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Save Content (Title/Subtitle)
            const updatedContent = {
                ...initialPageContent,
                locationsSection: {
                    title: sectionTitle,
                    subtitle: sectionSubtitle
                }
            };

            // Process Deletions First
            if (deletedCategoryIds.length > 0) {
                await Promise.all(deletedCategoryIds.map(id => deleteCategoryAction(id)));
            }



            // Parallel save
            // NOTE: In a real DB, we might want a transaction or single endpoint.
            // Here we have separate actions.
            const results = await Promise.all([
                updateCategoriesAction(categories),
                updateLocationsAction(locations),
                updatePageContentAction(updatedContent)
            ]);

            if (results.every(r => r)) {
                showToast("All changes saved successfully", "success");
                // Update persisted IDs: All current categories are now saved
                setPersistedIds(new Set(categories.map(c => c.id)));
            } else {
                showToast("Saved with some errors", "error");
            }
        } catch (_error) {
            showToast("An error occurred while saving", "error");
        } finally {
            setIsLoading(false);
            setEditingCategoryId(null);
            setEditingLocationId(null);
            setDeletedCategoryIds([]);
        }
    };

    return (
        <div className="space-y-8 bg-white p-6 rounded-lg border border-[var(--color-sand)] shadow-sm mt-8">

            {/* Header / Toolbar */}
            <div className="flex items-center justify-between border-b border-[var(--color-sand)] pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--color-aegean-blue)]/10 rounded-full">
                        <MapPin className="h-5 w-5 text-[var(--color-aegean-blue)]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold font-montserrat text-[var(--color-charcoal)]">Locations & Categories</h2>
                        <p className="text-sm text-[var(--color-charcoal)]/60">Manage map groups and pins.</p>
                    </div>
                </div>
                <Button onClick={handleSave} isLoading={isLoading} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            {/* Section Title Settings */}
            <div className="bg-[var(--color-warm-white)]/30 p-4 rounded-md border border-[var(--color-sand)]/50 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-charcoal)]/60 flex items-center gap-2">
                    <Settings className="h-3 w-3" /> Section Headers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Section Title"
                        value={sectionTitle}
                        onChange={(e) => setSectionTitle(e.target.value)}
                    />
                    <Input
                        label="Subtitle"
                        value={sectionSubtitle}
                        onChange={(e) => setSectionSubtitle(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories List */}
            <div className="space-y-4">
                {categories.map((category) => (
                    <CategoryRow
                        key={category.id}
                        category={category}
                        locations={locations.filter(l => l.categoryId === category.id)}
                        isExpanded={expandedCategoryIds.includes(category.id)}
                        onToggle={toggleCategory}
                        onUpdate={updateCategory}
                        onDelete={deleteCategory}
                        onAddLocation={addLocation}
                        onUpdateLocation={updateLocation}
                        onDeleteLocation={deleteLocation}
                    />
                ))}
            </div>

            <Button
                variant="outline"
                onClick={addCategory}
                className="w-full py-4 border-2 border-dashed text-[var(--color-charcoal)]/60 font-medium"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add New Category Group
            </Button>

        </div>
    );
}
