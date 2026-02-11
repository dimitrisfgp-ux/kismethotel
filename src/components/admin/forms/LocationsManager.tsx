"use client";

import { Convenience, LocationCategory, PageContent } from "@/types";
import { useLocationsManager } from "@/hooks/useLocationsManager";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CategoryRow } from "@/components/admin/locations/CategoryRow";
import { Save, Plus, MapPin, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_CATEGORY_COLOR } from "@/lib/constants";

interface LocationsManagerProps {
    initialLocations: Convenience[];
    initialCategories: LocationCategory[];
    initialPageContent: PageContent;
}

export function LocationsManager({ initialLocations, initialCategories, initialPageContent }: LocationsManagerProps) {
    const {
        locations,
        categories,
        sectionTitle,
        sectionSubtitle,
        isLoading,
        expandedCategoryIds,
        editingCategoryId,
        editingLocationId,
        setSectionTitle,
        setSectionSubtitle,
        setEditingCategoryId,
        setEditingLocationId,
        toggleCategory,
        addCategory,
        updateCategory,
        deleteCategory,
        addLocation,
        updateLocation,
        deleteLocation,
        saveChanges
    } = useLocationsManager({ initialLocations, initialCategories, initialPageContent });


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
                <Button onClick={saveChanges} isLoading={isLoading} className="gap-2">
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
