"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useDateContext } from "@/contexts/DateContext";
import { roomService } from "@/services/roomService";
import { Room } from "@/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { Loader2 } from "lucide-react";

function BookContent() {
    const searchParams = useSearchParams();
    const roomId = searchParams.get("roomId");
    const { dateRange } = useDateContext();
    const router = useRouter();

    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!roomId) {
            // router.push("/#rooms"); 
            // Don't redirect immediately to avoid loops or flash, show empty invalid state
            return;
        }

        // Check if dates are selected ?? 
        // Usually we want to persist context. If missing, maybe just prompt selection.
        // For now assuming flow holds.

        roomService.getRooms().then(rooms => {
            const found = rooms.find(r => r.id === roomId);
            if (found) setRoom(found);
            setLoading(false);
        });
    }, [roomId]);

    if (loading || !roomId) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--color-aegean-blue)]" />
            </div>
        );
    }

    if (!room) {
        return (
            <Container className="py-20 text-center">
                <p>Room not found.</p>
            </Container>
        );
    }

    // If no dates, we could show a blocker or just let them pick?
    // Wizard requires dateRange. 
    if (!dateRange || !dateRange.from || !dateRange.to) {
        return (
            <Container className="py-20 text-center">
                <p>Please select dates first.</p>
            </Container>
        );
    }

    return (
        <div className="pt-[var(--header-height)] min-h-screen bg-[var(--color-warm-white)] py-12">
            <Container>
                <SectionHeading title="Confirm Your Stay" subtitle="You are just a few steps away from paradise." />
                <BookingWizard room={room} dateRange={{ from: dateRange.from!, to: dateRange.to! }} />
            </Container>
        </div>
    );
}

export default function BookPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--color-aegean-blue)]" />
            </div>
        }>
            <BookContent />
        </Suspense>
    );
}
