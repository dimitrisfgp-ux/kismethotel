import { roomService } from "@/services/roomService";
import { RoomDataTable } from "@/components/admin/rooms/RoomDataTable";

export default async function RoomsPage() {
    const rooms = await roomService.getRoomsSummary();

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="border-b border-[var(--color-sand)] pb-6">
                <h1 className="text-3xl font-bold font-montserrat text-[var(--color-charcoal)]">Rooms Management</h1>
                <p className="text-[var(--color-charcoal)]/60 mt-2">Create, edit, and manage your hotel rooms.</p>
            </div>

            <RoomDataTable initialRooms={rooms} />
        </div>
    );
}
