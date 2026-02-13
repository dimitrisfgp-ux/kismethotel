import { Room } from "@/types";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/admin/TextArea";
import { Users, BedDouble, BedSingle } from "lucide-react";

interface RoomBasicInfoProps {
    room: Room;
    errors: Record<string, string>;
    updateField: <K extends keyof Room>(field: K, value: Room[K]) => void;
    getBedCount: (type: 'single' | 'double') => number;
    updateBedCount: (type: 'single' | 'double', count: number) => void;
}

export function RoomBasicInfo({ room, errors, updateField, getBedCount, updateBedCount }: RoomBasicInfoProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input error={errors.name} label="Name" value={room.name} onChange={e => updateField('name', e.target.value)} />
                <Input error={errors.slug} label="Slug (URL)" value={room.slug} onChange={e => updateField('slug', e.target.value)} />
                <Input error={errors.pricePerNight} label="Price (€)" type="number" value={room.pricePerNight} onChange={e => updateField('pricePerNight', Number(e.target.value))} />
                <Input icon={Users} error={errors.maxOccupancy} label="Occupancy" type="number" value={room.maxOccupancy} onChange={e => updateField('maxOccupancy', Number(e.target.value))} />
                <Input error={errors.sizeSqm} label="Size (m²)" type="number" value={room.sizeSqm} onChange={e => updateField('sizeSqm', Number(e.target.value))} />
                <Input label="Floor" type="number" value={room.floor} onChange={e => updateField('floor', Number(e.target.value))} />

                {/* Time Configuration */}
                <Input
                    label="Check-in Time"
                    type="time"
                    value={room.checkInTime || "15:00"}
                    onChange={e => updateField('checkInTime', e.target.value)}
                />
                <Input
                    label="Check-out Time"
                    type="time"
                    value={room.checkOutTime || "11:00"}
                    onChange={e => updateField('checkOutTime', e.target.value)}
                />

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
        </div>
    );
}
