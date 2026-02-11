import { LocationCategory, Convenience } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { IconPicker } from "@/components/ui/admin/IconPicker";
import { Pencil, Trash2, ChevronUp, ChevronDown, Plus, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { iconMap } from "@/components/ui/icons/iconMap";
import { useState } from "react";
import { LocationItem } from "./LocationItem";

interface CategoryRowProps {
    category: LocationCategory;
    locations: Convenience[];
    isExpanded: boolean;
    onToggle: (id: string) => void;
    onUpdate: (id: string, field: keyof LocationCategory, value: string) => void;
    onDelete: (id: string) => void;
    onAddLocation: (categoryId: string) => void;
    onUpdateLocation: (id: string, field: keyof Convenience, value: any) => void;
    onDeleteLocation: (id: string) => void;
}

export function CategoryRow({
    category,
    locations,
    isExpanded,
    onToggle,
    onUpdate,
    onDelete,
    onAddLocation,
    onUpdateLocation,
    onDeleteLocation
}: CategoryRowProps) {
    const [isEditing, setIsEditing] = useState(false);
    const CategoryIcon = iconMap[category.icon] || MapPin;

    return (
        <div className="border border-[var(--color-sand)] rounded-md bg-white shadow-sm transition-all relative">

            {/* Category Header Row */}
            <div
                className={cn(
                    "flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-sand)]/10 transition-colors",
                    isExpanded ? "bg-[var(--color-sand)]/10" : ""
                )}
                onClick={() => onToggle(category.id)}
            >
                <div className="flex items-center gap-3 flex-1">
                    {isEditing ? (
                        <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                            <div className="w-[140px] shrink-0">
                                <IconPicker value={category.icon} onChange={(val) => onUpdate(category.id, 'icon', val)} />
                            </div>
                            <Input
                                value={category.label}
                                onChange={(e) => onUpdate(category.id, 'label', e.target.value)}
                                className="h-11 max-w-[300px]"
                                placeholder="Category Name"
                                autoFocus
                            />
                            <input
                                type="color"
                                value={category.color}
                                onChange={(e) => onUpdate(category.id, 'color', e.target.value)}
                                className="w-11 h-11 rounded border bg-transparent cursor-pointer p-0 overflow-hidden"
                                title="Category Color"
                            />
                            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-11 px-4">Done</Button>
                        </div>
                    ) : (
                        <>
                            <div className="p-2 rounded-full bg-white border border-[var(--color-sand)]" style={{ color: category.color }}>
                                <CategoryIcon className="h-4 w-4" />
                            </div>
                            <span className="font-bold font-montserrat text-[var(--color-charcoal)]">{category.label || "Unnamed Category"}</span>
                            <span className="text-xs text-[var(--color-charcoal)]/40 ml-2">({locations.length} locations)</span>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="ml-auto p-2 h-8 w-8 rounded-full text-[var(--color-charcoal)]/60 hover:text-[var(--color-aegean-blue)] hover:bg-[var(--color-aegean-blue)]/10"
                                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                                title="Edit Group"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(category.id); }}
                        className="p-2 text-[var(--color-charcoal)]/40 hover:text-red-500 rounded-full"
                        title="Delete Category"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </div>
            </div>

            {/* Expanded Content: Locations List */}
            {isExpanded && (
                <div className="bg-[var(--color-warm-white)]/30 border-t border-[var(--color-sand)] p-4 space-y-3 animate-slide-down">

                    {locations.length === 0 && (
                        <p className="text-sm text-center text-gray-400 italic py-2">No locations in this category.</p>
                    )}

                    {locations.map((location) => (
                        <div key={location.id} className="bg-white border border-[var(--color-sand)]/50 rounded-md p-3">
                            <LocationItem
                                location={location}
                                onUpdate={onUpdateLocation}
                                onDelete={onDeleteLocation}
                            />
                        </div>
                    ))}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAddLocation(category.id)}
                        className="w-full border border-dashed border-[var(--color-sand)] text-[var(--color-charcoal)]/60 hover:text-[var(--color-aegean-blue)] hover:border-[var(--color-aegean-blue)]"
                    >
                        <Plus className="h-3 w-3 mr-2" />
                        Add Location to {category.label}
                    </Button>
                </div>
            )}
        </div>
    );
}
