"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Room } from "@/types";
import { deleteRoomAction } from "@/app/actions/room";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/admin/Table";
import { Button } from "@/components/ui/Button";
import { Edit2, Trash2, Plus, ImageOff, Copy, Eye } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { BulkEditModal } from "@/components/admin/rooms/BulkEditModal";
import { RoomsMobileCard } from "./RoomsMobileCard";
import { usePermission } from "@/contexts/PermissionContext";

// Define the summary type expected by this component
interface RoomSummary {
    id: string;
    name: string;
    slug: string;
    pricePerNight: number;
    maxOccupancy: number;
    sizeSqm: number;
    floor: number;
    checkInTime?: string;
    checkOutTime?: string;
    imageUrl?: string;
    // We keep optional fields for compatibility if we want to pass full Room objects casted
    media?: { url: string }[];
}

interface RoomDataTableProps {
    initialRooms: RoomSummary[];
}

export function RoomDataTable({ initialRooms }: RoomDataTableProps) {
    const { can } = usePermission();
    const [rooms, setRooms] = useState<RoomSummary[]>(initialRooms);
    const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);
    const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
    const { showToast } = useToast();

    // Sync state with props when server revalidates
    useEffect(() => {
        setRooms(initialRooms);
        setSelectedRoomIds([]); // Reset selection on refresh
    }, [initialRooms]);

    const handleDelete = async (roomId: string) => {
        if (!confirm("Are you sure you want to delete this room?")) return;

        try {
            const success = await deleteRoomAction(roomId);
            if (success) {
                setRooms(prev => prev.filter(r => r.id !== roomId));
                showToast("Room deleted successfully", "success");
            } else {
                showToast("Failed to delete room", "error");
            }
        } catch (_error) {
            showToast("An error occurred", "error");
        }
    };

    const toggleSelectAll = () => {
        if (selectedRoomIds.length === rooms.length) {
            setSelectedRoomIds([]);
        } else {
            setSelectedRoomIds(rooms.map(r => r.id));
        }
    };

    const toggleSelectRoom = (roomId: string) => {
        setSelectedRoomIds(prev =>
            prev.includes(roomId)
                ? prev.filter(id => id !== roomId)
                : [...prev, roomId]
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-montserrat text-[var(--color-charcoal)]">
                    All Rooms ({rooms.length})
                </h2>
                <div className="flex gap-2">
                    {(selectedRoomIds.length > 0 && can('rooms.update')) && (
                        <Button
                            variant="secondary"
                            onClick={() => setIsBulkEditOpen(true)}
                            className="bg-[var(--color-aegean-blue)] text-white hover:bg-[var(--color-aegean-blue)]/90"
                        >
                            Bulk Edit ({selectedRoomIds.length})
                        </Button>
                    )}
                    {can('rooms.create') && (
                        <Link href="/admin/rooms/new">
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Room
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="rounded-md border border-[var(--color-sand)] bg-white hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300"
                                    checked={rooms.length > 0 && selectedRoomIds.length === rooms.length}
                                    onChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Occupancy</TableHead>
                            <TableHead>Times</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rooms.map((room) => (
                            <TableRow key={room.id}>
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300"
                                        checked={selectedRoomIds.includes(room.id)}
                                        onChange={() => toggleSelectRoom(room.id)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="relative h-12 w-20 overflow-hidden rounded-md bg-gray-100">
                                        {room.imageUrl || (room.media && room.media.length > 0) ? (
                                            <Image
                                                src={room.imageUrl || room.media?.[0]?.url || ""}
                                                alt={room.name || "Room Image"}
                                                fill
                                                className="object-cover"
                                                sizes="100px"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-[var(--color-sand)]/20 text-[var(--color-charcoal)]/40 p-1">
                                                <ImageOff className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {room.name}
                                    <div className="text-xs text-gray-400">{room.sizeSqm}m² • Floor {room.floor}</div>
                                </TableCell>
                                <TableCell>€{room.pricePerNight} / night</TableCell>
                                <TableCell>{room.maxOccupancy} Guests</TableCell>
                                <TableCell className="text-xs text-gray-500">
                                    In: {room.checkInTime || '15:00'}<br />
                                    Out: {room.checkOutTime || '11:00'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {can('rooms.update') && (
                                            <Link href={`/admin/rooms/${room.slug}`}>
                                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        {can('rooms.delete') && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => handleDelete(room.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {rooms.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No rooms found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>



            {/* Mobile List View */}
            <div className="md:hidden space-y-3 p-2 bg-[var(--color-warm-white)]/30">
                {rooms.length === 0 ? (
                    <div className="text-center py-8 text-[var(--color-charcoal)]/60 italic border border-dashed border-[var(--color-sand)] rounded-lg">
                        No rooms found.
                    </div>
                ) : (
                    rooms.map((room) => (
                        <RoomsMobileCard
                            key={room.id}
                            room={room}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            <BulkEditModal
                isOpen={isBulkEditOpen}
                onClose={() => setIsBulkEditOpen(false)}
                selectedRoomIds={selectedRoomIds}
                onSuccess={() => setSelectedRoomIds([])}
            />
        </div>
    );
}
