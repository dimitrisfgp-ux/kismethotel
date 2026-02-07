"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Room } from "@/types";
import { deleteRoomAction } from "@/app/actions";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/admin/Table";
import { Button } from "@/components/ui/Button";
import { Edit2, Trash2, Plus, ImageOff } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

interface RoomDataTableProps {
    initialRooms: Room[];
}

export function RoomDataTable({ initialRooms }: RoomDataTableProps) {
    const [rooms, setRooms] = useState<Room[]>(initialRooms);
    const { showToast } = useToast();

    // Sync state with props when server revalidates
    useEffect(() => {
        setRooms(initialRooms);
    }, [initialRooms]);

    const handleDelete = async (roomId: string) => {
        if (!confirm("Are you sure you want to delete this room?")) return;

        try {
            const success = await deleteRoomAction(roomId);
            if (success) {
                // Optimistic update, though useEffect will likely handle it too due to revalidatePath
                setRooms(prev => prev.filter(r => r.id !== roomId));
                showToast("Room deleted successfully", "success");
            } else {
                showToast("Failed to delete room", "error");
            }
        } catch (_error) {
            showToast("An error occurred", "error");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-montserrat text-[var(--color-charcoal)]">
                    All Rooms ({rooms.length})
                </h2>
                <Link href="/admin/rooms/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Room
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border border-[var(--color-sand)] bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Occupancy</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rooms.map((room) => (
                            <TableRow key={room.id}>
                                <TableCell>
                                    <div className="relative h-12 w-20 overflow-hidden rounded-md bg-gray-100">
                                        {room.images?.[0] ? (
                                            <Image
                                                src={room.images[0]}
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
                                <TableCell className="font-medium">{room.name}</TableCell>
                                <TableCell>€{room.pricePerNight} / night</TableCell>
                                <TableCell>{room.maxOccupancy} Guests</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/rooms/${room.slug}`}>
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => handleDelete(room.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {rooms.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No rooms found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
