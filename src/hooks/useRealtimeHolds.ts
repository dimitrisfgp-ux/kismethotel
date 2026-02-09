"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { BookingHold } from "@/types";
import { getActiveHoldAction, pingHoldAction } from "@/app/actions";

interface UseRealtimeHoldsOptions {
    roomId: string;
    checkIn: Date;
    checkOut: Date;
    mySessionId?: string;
}

interface UseRealtimeHoldsResult {
    activeHold: BookingHold | null;
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
    const [hasContention, setHasContention] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check if dates overlap with a hold
    const datesOverlap = useCallback((hold: { check_in: string; check_out: string }) => {
        const holdStart = new Date(hold.check_in);
        const holdEnd = new Date(hold.check_out);
        return holdStart < checkOut && holdEnd > checkIn;
    }, [checkIn, checkOut]);

    // Initial check for existing holds
    useEffect(() => {
        async function checkExistingHolds() {
            setIsLoading(true);
            try {
                const hold = await getActiveHoldAction(
                    roomId,
                    checkIn.toISOString(),
                    checkOut.toISOString(),
                    mySessionId
                );

                if (hold) {
                    setActiveHold(hold);
                    // Ping the holder to notify them of contention
                    await pingHoldAction(hold.id);
                }
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
                    const record = payload.new as {
                        id: string;
                        room_id: string;
                        check_in: string;
                        check_out: string;
                        session_id: string;
                        expires_at: string;
                        has_contention: boolean;
                        created_at: string;
                    };

                    // Check if this hold affects our dates
                    if (datesOverlap(record) && record.session_id !== mySessionId) {
                        setActiveHold({
                            id: record.id,
                            roomId: record.room_id,
                            checkIn: record.check_in,
                            checkOut: record.check_out,
                            sessionId: record.session_id,
                            expiresAt: record.expires_at,
                            hasContention: record.has_contention,
                            createdAt: record.created_at
                        });
                        // Ping the holder
                        await pingHoldAction(record.id);
                    }
                }

                if (eventType === 'UPDATE') {
                    const record = payload.new as { session_id: string; has_contention: boolean };
                    // If this is MY hold and contention was set
                    if (record.session_id === mySessionId && record.has_contention) {
                        setHasContention(true);
                    }
                }

                if (eventType === 'DELETE') {
                    const oldRecord = payload.old as { id: string };
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

    return { activeHold, hasContention, isConnected, isLoading };
}
