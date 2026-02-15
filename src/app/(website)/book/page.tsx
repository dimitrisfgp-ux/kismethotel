"use client";


import { useSearchParams } from "next/navigation";
import { addDays } from "date-fns";
import { useEffect, useState, Suspense } from "react";
import { useDateContext } from "@/contexts/DateContext";
import { getRoomByIdAction } from '@/app/actions/bookings';
import { Room } from "@/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { Loader2 } from "lucide-react";



function BookContent() {
    const searchParams = useSearchParams();
    const roomId = searchParams.get("roomId");
    const checkInParam = searchParams.get("checkIn");
    const checkOutParam = searchParams.get("checkOut");
    const { dateRange, setDateRange } = useDateContext();

    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!roomId) {
            // Don't redirect immediately to avoid loops or flash, show empty invalid state
            return;
        }

        // Sync URL dates to Context
        if (checkInParam && checkOutParam) {
            const urlFrom = new Date(checkInParam);
            const urlTo = new Date(checkOutParam);
            // Only update if context is empty or different? 
            // For now, trust URL as source of truth on mount/navigation
            setDateRange({ from: urlFrom, to: urlTo });
        }

        getRoomByIdAction(roomId).then(found => {
            if (found) setRoom(found);
            setLoading(false);
        });
    }, [roomId, checkInParam, checkOutParam, setDateRange]);

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

    // Fallback: use Context if available, otherwise URL
    const effectiveFrom = dateRange?.from || (checkInParam ? new Date(checkInParam) : undefined);

    if (!effectiveFrom) {
        return (
            <Container className="py-20 text-center">
                <p>Please select dates first.</p>
            </Container>
        );
    }

    const effectiveTo = dateRange?.to ||
        (checkOutParam ? new Date(checkOutParam) : addDays(effectiveFrom, 1));

    return (
        <div className="pt-[var(--header-height)] min-h-screen bg-[var(--color-warm-white)] py-12">
            <Container>
                <SectionHeading title="Confirm Your Stay" subtitle="You are just a few steps away from paradise." />
                <BookingWizard room={room} dateRange={{ from: effectiveFrom, to: effectiveTo }} />
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
