import { Convenience } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LocationPicker } from "@/components/admin/inputs/LocationPicker";
import { MapPin, Trash2 } from "lucide-react";
import { useState } from "react";

interface LocationItemProps {
    location: Convenience;
    onUpdate: (id: number, field: keyof Convenience, value: any) => void;
    onDelete: (id: number) => void;
}

export function LocationItem({ location, onUpdate, onDelete }: LocationItemProps) {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-[var(--color-aegean-blue)]">Editing Location</h4>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Close</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                        label="Name"
                        value={location.name}
                        onChange={(e) => onUpdate(location.id, 'name', e.target.value)}
                    />
                    <Input
                        label="Distance Label"
                        value={location.distanceLabel || ""}
                        onChange={(e) => onUpdate(location.id, 'distanceLabel', e.target.value)}
                    />
                </div>
                <div className="h-[250px] w-full mt-2">
                    <LocationPicker
                        value={{ lat: location.lat, lng: location.lng }}
                        onChange={(val) => {
                            onUpdate(location.id, 'lat', val.lat);
                            onUpdate(location.id, 'lng', val.lng);
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-sm">{location.name || "New Location"}</span>
                {location.distanceLabel && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">{location.distanceLabel}</span>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
                <button
                    onClick={() => onDelete(location.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                >
                    <Trash2 className="h-3 w-3" />
                </button>
            </div>
        </div>
    );
}
