import { notFound } from "next/navigation";
import { roomService } from "@/services/roomService";
import { RoomForm } from "@/components/admin/rooms/RoomForm";

interface RoomEditPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function RoomEditPage({ params }: RoomEditPageProps) {
    const { slug } = await params;
    const room = await roomService.getRoom(slug);

    if (!room) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <RoomForm initialRoom={room} />
        </div>
    );
}
