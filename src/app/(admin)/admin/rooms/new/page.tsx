import { RoomForm } from "@/components/admin/rooms/RoomForm";

export default function NewRoomPage() {
    return (
        <div className="max-w-4xl mx-auto pb-12">
            <RoomForm isNew={true} />
        </div>
    );
}
