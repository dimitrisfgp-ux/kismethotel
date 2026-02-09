"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { BookingHold } from "@/types";
import { getActiveHoldAction, pingHoldAction } from "@/app/actions";

interface UseRealtimeHoldsOptions {
    roomId: string;
    checkIn?: Date;
    checkOut?: Date;
    mySessionId?: string;
}

interface UseRealtimeHoldsResult {
    activeHold: BookingHold | null;
    allHolds: BookingHold[];
    hasContention: boolean;
    isConnected: boolean;
    isLoading: boolean;
}

export function useRealtimeHolds({
    roomId,
    checkIn,
    checkOut,
    mySessionId
}: UseRealtimeHoldsOptions): UseRealtimeHoldsResult {
    const [activeHold, setActiveHold] = useState<BookingHold | null>(null);
    const [allHolds, setAllHolds] = useState<BookingHold[]>([]);
    const [hasContention, setHasContention] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check if dates overlap with a specific hold
    const datesOverlap = useCallback((hold: { check_in: string; check_out: string }) => {
        if (!checkIn || !checkOut) return false;
        const holdStart = new Date(hold.check_in);
        const holdEnd = new Date(hold.check_out);
        return holdStart < checkOut && holdEnd > checkIn;
    }, [checkIn, checkOut]);

    // Initial check for existing holds
    useEffect(() => {
        async function checkExistingHolds() {
            setIsLoading(true);

            try {
                // If we need to check specific dates (Booking Flow)
                if (checkIn && checkOut) {
                    const myHold = await getActiveHoldAction(
                        roomId,
                        checkIn.toISOString(),
                        checkOut.toISOString(),
                        mySessionId
                    );

                    if (myHold) {
                        setActiveHold(myHold);
                        await pingHoldAction(myHold.id);
                    }
                }

                // Note: 'allHolds' will be populated by Realtime events or we could fetch them here.
                // For now, relying on Realtime updates for the list to keep it simple.
                // A future improvement would be to add getRoomHoldsAction(roomId).

            } catch (error) {
                console.error('Error checking existing holds:', error);
            }

            setIsLoading(false);
        }

        checkExistingHolds();
    }, [roomId, checkIn, checkOut, mySessionId]);

    // Realtime subscription
    useEffect(() => {
        const channel = supabase
            .channel(`room-${roomId}-holds`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'booking_holds',
                filter: `room_id=eq.${roomId}`
            }, async (payload) => {
                const eventType = payload.eventType;

                if (eventType === 'INSERT') {
                    // Type hack for payload.new because the types are loose in supabase-js
                    const newRecord = payload.new as any;

                    const hold: BookingHold = {
                        id: newRecord.id,
                        roomId: newRecord.room_id,
                        checkIn: newRecord.check_in,
                        checkOut: newRecord.check_out,
                        sessionId: newRecord.session_id,
                        expiresAt: newRecord.expires_at,
                        hasContention: newRecord.has_contention,
                        createdAt: newRecord.created_at
                    };

                    setAllHolds(prev => {
                        // Avoid duplicates
                        if (prev.some(h => h.id === hold.id)) return prev;
                        return [...prev, hold];
                    });

                    // Check overlap with MY dates
                    if (datesOverlap(newRecord) && newRecord.session_id !== mySessionId) {
                        setActiveHold(hold);
                        await pingHoldAction(hold.id);
                    }
                }

                if (eventType === 'UPDATE') {
                    const newRecord = payload.new as any;
                    setAllHolds(prev => prev.map(h => h.id === newRecord.id ? {
                        ...h,
                        hasContention: newRecord.has_contention,
                        expiresAt: newRecord.expires_at
                    } : h));

                    // Contention check
                    if (newRecord.session_id === mySessionId && newRecord.has_contention) {
                        setHasContention(true);
                    }
                }

                if (eventType === 'DELETE') {
                    const oldRecord = payload.old as { id: string };
                    setAllHolds(prev => prev.filter(h => h.id !== oldRecord.id));

                    if (oldRecord.id === activeHold?.id) {
                        setActiveHold(null);
                    }
                }
            })
            .subscribe((status) => {
                setIsConnected(status === 'SUBSCRIBED');
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, checkIn, checkOut, mySessionId, datesOverlap, activeHold?.id]);

    return { activeHold, allHolds, hasContention, isConnected, isLoading };
}
