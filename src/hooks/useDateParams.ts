"use client";

import { useEffect } from 'react';
import { useDateContext } from '@/contexts/DateContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';

export function useDateParams() {
    const { dateRange, setDateRange, guestCount, setGuestCount } = useDateContext();
    const searchParams = useSearchParams();
    const router = useRouter();

    // 1. Sync URL -> State (Initial Load)
    useEffect(() => {
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');
        const guests = searchParams.get('guests');

        if (checkIn && checkOut && (!dateRange || !dateRange.from)) {
            setDateRange({
                from: parseISO(checkIn),
                to: parseISO(checkOut)
            });
        }

        if (guests) {
            setGuestCount(parseInt(guests));
        }
    }, [searchParams, setDateRange, setGuestCount, dateRange]);

    // 2. Sync State -> URL (When user changes dates)
    useEffect(() => {
        if (dateRange?.from && dateRange?.to) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('checkIn', format(dateRange.from, 'yyyy-MM-dd'));
            params.set('checkOut', format(dateRange.to, 'yyyy-MM-dd'));
            params.set('guests', guestCount.toString());

            // Update URL without full reload
            router.replace(`?${params.toString()}`, { scroll: false });
        }
    }, [dateRange, guestCount, router, searchParams]);
}
