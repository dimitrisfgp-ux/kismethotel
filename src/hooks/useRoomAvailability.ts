import { useState, useEffect, useCallback } from 'react';
import { getRoomAvailabilityAction } from '@/app/actions/bookings';
import { DateRange } from 'react-day-picker';

interface UnavailableDate {
    from: Date;
    to: Date;
    type: 'booked' | 'blocked';
}

export function useRoomAvailability(roomId: string | undefined) {
    const [unavailableDates, setUnavailableDates] = useState<UnavailableDate[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAvailability = useCallback(async () => {
        if (!roomId) {
            setUnavailableDates([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await getRoomAvailabilityAction(roomId);

            // Convert strings to Date objects for Calendar component
            const parsedDates = data.map(d => ({
                from: new Date(d.from),
                to: new Date(d.to),
                type: d.type as 'booked' | 'blocked'
            }));

            setUnavailableDates(parsedDates);
        } catch (err) {
            console.error("Failed to fetch availability:", err);
            setError("Failed to load availability");
        } finally {
            setIsLoading(false);
        }
    }, [roomId]);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    // Helper to check if a range overlaps with unavailable dates
    const checkAvailability = (range: DateRange | undefined): boolean => {
        if (!range?.from || !range?.to) return true;

        const start = range.from.getTime();
        const end = range.to.getTime();

        return !unavailableDates.some(ud => {
            const udStart = ud.from.getTime();
            const udEnd = ud.to.getTime();

            // Standard overlap check: (StartA < EndB) and (EndA > StartB)
            // Using strict inequality for day ranges usually implies standard hotel logic (check-out morning vs check-in afternoon)
            // But here we want to be safe: if any datte is fully occupied.

            // Simple approach: if range overlaps at all with an existing range.
            return start < udEnd && end > udStart;
        });
    };

    return {
        unavailableDates,
        isLoading,
        error,
        refetch: fetchAvailability,
        checkAvailability
    };
}
