import { notFound } from "next/navigation";
import { roomService } from "@/services/roomService";
import { bookingService } from "@/services/bookingService";
import { Container } from "@/components/ui/Container";
import { ImageGallery } from "@/components/rooms/ImageGallery";
import { RoomInfo } from "@/components/rooms/RoomInfo";
import { BookingCard } from "@/components/rooms/BookingCard";
import { ContactCTA } from "@/components/rooms/ContactCTA";

interface RoomPageProps {
    params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    const rooms = await roomService.getRooms();
    return rooms.map((room) => ({
        slug: room.slug,
    }));
}

export default async function RoomPage({ params }: RoomPageProps) {
    const { slug } = await params;
    const room = await roomService.getRoomBySlug(slug);

    if (!room) {
        notFound();
    }

    const blockedDates = await bookingService.getBlockedDates(room.id);
    const bookings = await bookingService.getBookings(room.id);

    return (
        <article className="">
            {/* 1. Gallery */}
            <ImageGallery media={room.media} roomName={room.name} />

            {/* 2. Content Grid */}
            <Container className="py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                    {/* Main Info (Left 2 cols) */}
                    <div className="lg:col-span-2">
                        <RoomInfo room={room} />
                    </div>

                    {/* Sticky Sidebar (Right 1 col) */}
                    <div className="relative">
                        <BookingCard room={room} blockedDates={blockedDates} bookings={bookings} />
                    </div>

                </div>
            </Container>

            {/* 3. CTA */}
            <ContactCTA />
        </article>
    );
}
