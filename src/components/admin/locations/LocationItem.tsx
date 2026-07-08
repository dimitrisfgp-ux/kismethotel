import { Convenience } from "@/types";
import { Input } from "@/components/ui/Input";
import { LocationPicker } from "@/components/admin/inputs/LocationPicker";
import { MapPin, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Collapse } from "@/components/ui/Collapse";
import { cn } from "@/lib/utils";
import { usePermission } from "@/contexts/PermissionContext";

interface LocationItemProps {
    location: Convenience;
    onUpdate: (id: string, field: keyof Convenience, value: any) => void;
    onDelete: (id: string) => void;
}

export function LocationItem({ location, onUpdate, onDelete }: LocationItemProps) {
    const [open, setOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);
    const { can } = usePermission();
    const editable = can('content.locations');

    const toggle = () => {
        setOpen((o) => {
            if (!o) setHasOpened(true);
            return !o;
        });
    };

    return (
        <div>
            {/* Header — click anywhere to expand the pin's configuration */}
            <div
                onClick={toggle}
                className={cn(
                    "flex items-center justify-between gap-2 cursor-pointer px-3 py-2.5 rounded-md hover:bg-[var(--color-sand)]/10 transition-colors",
                    open && "bg-[var(--color-sand)]/10"
                )}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="font-medium text-sm truncate">{location.name || "New Location"}</span>
                    {location.distanceLabel && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 shrink-0">{location.distanceLabel}</span>
                    )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    {editable && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onDelete(location.id); }}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-full"
                            title="Delete location"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    )}
                    <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", open && "rotate-180")} />
                </div>
            </div>

            {/* Collapsible configuration */}
            <Collapse open={open}>
                <div className="px-3 pt-3 pb-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                            label="Name"
                            value={location.name}
                            disabled={!editable}
                            onChange={(e) => onUpdate(location.id, 'name', e.target.value)}
                        />
                        <Input
                            label="Distance Label"
                            value={location.distanceLabel || ""}
                            disabled={!editable}
                            onChange={(e) => onUpdate(location.id, 'distanceLabel', e.target.value)}
                        />
                    </div>
                    {/* Lazy-mount the Leaflet map only after the first expand, so we
                        don't spin up a map instance for every collapsed pin. */}
                    {hasOpened && (
                        <LocationPicker
                            value={{ lat: location.lat, lng: location.lng }}
                            onChange={(val) => {
                                onUpdate(location.id, 'lat', val.lat);
                                onUpdate(location.id, 'lng', val.lng);
                            }}
                        />
                    )}
                </div>
            </Collapse>
        </div>
    );
}
