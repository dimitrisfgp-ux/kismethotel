"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookingHold } from "@/types";
import { getActiveHoldAction, pingHoldAction, getRoomHoldsAction } from "@/app/actions/booking";

/** Shape of a booking_holds row as returned by Supabase realtime payloads */
interface BookingHoldRow {
    id: string;
    room_id: string;
    check_in: string;
    check_out: string;
    session_id: string;
    expires_at: string;
    has_contention: boolean;
    created_at: string;
}

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
        let isMounted = true;

        async function checkExistingHolds() {
            try {
                // 1. Fetch ALL active holds for this room (for the Calendar)
                const roomHolds = await getRoomHoldsAction(roomId);

                if (isMounted) {
                    setAllHolds(roomHolds);

                    // 2. If I have selected dates, check if any EXISTING hold blocks me
                    if (checkIn && checkOut) {
                        const overlappingHold = roomHolds.find(h =>
                            datesOverlap({ check_in: h.checkIn, check_out: h.checkOut }) &&
                            h.sessionId !== mySessionId
                        );

                        if (overlappingHold) {
                            setActiveHold(overlappingHold);
                            await pingHoldAction(overlappingHold.id);
                        }
                    }
                }
            } catch (error) {
                console.error('Error checking existing holds:', error);
            }

            if (isMounted) setIsLoading(false);
        }

        checkExistingHolds();

        return () => { isMounted = false; };
    }, [roomId, checkIn, checkOut, mySessionId, datesOverlap]);

    // Refs for stable access inside the effect without triggering re-runs
    const stateRef = useRef({ checkIn, checkOut, mySessionId, activeHold, datesOverlap });
    // Update refs on every render
    useEffect(() => {
        stateRef.current = { checkIn, checkOut, mySessionId, activeHold, datesOverlap };
    });

    // Realtime subscription - Depends ONLY on roomId to prevent thrashing
    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel(`room-${roomId}-holds`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'booking_holds',
                filter: `room_id=eq.${roomId}`
            }, async (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => {
                const eventType = payload.eventType;
                const current = stateRef.current; // Access fresh state via ref

                if (eventType === 'INSERT') {
                    // Type hack for payload.new because the types are loose in supabase-js
                    const newRecord = payload.new as unknown as BookingHoldRow;

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
                    if (current.datesOverlap(newRecord) && newRecord.session_id !== current.mySessionId) {
                        setActiveHold(hold);
                        await pingHoldAction(hold.id);
                    }
                }

                if (eventType === 'UPDATE') {
                    const newRecord = payload.new as unknown as BookingHoldRow;
                    setAllHolds(prev => prev.map(h => h.id === newRecord.id ? {
                        ...h,
                        hasContention: newRecord.has_contention,
                        expiresAt: newRecord.expires_at
                    } : h));

                    // Contention check
                    if (newRecord.session_id === current.mySessionId && newRecord.has_contention) {
                        setHasContention(true);
                    }
                }

                if (eventType === 'DELETE') {
                    const oldRecord = payload.old as { id: string };
                    setAllHolds(prev => prev.filter(h => h.id !== oldRecord.id));

                    // STALE CLOSURE FIXED: Check against ref, not captured variable
                    if (oldRecord.id === current.activeHold?.id) {
                        setActiveHold(null);
                    }
                }
            })
            .subscribe((status: string) => {
                setIsConnected(status === 'SUBSCRIBED');
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId]); // <-- Only roomId!

    return { activeHold, allHolds, hasContention, isConnected, isLoading };
}
