import { RoomForm } from "@/components/admin/rooms/RoomForm";
import { requireSelfContainedAdmin } from "@/lib/auth/modeGuards";

export default async function NewRoomPage() {
    await requireSelfContainedAdmin();

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <RoomForm isNew={true} />
        </div>
    );
}
