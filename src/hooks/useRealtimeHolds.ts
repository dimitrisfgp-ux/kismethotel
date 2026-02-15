"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookingHold } from "@/types";
import { createHoldAction, releaseHoldAction, extendHoldAction, getRoomHoldsAction, checkBookingStatusAction } from "@/app/actions/bookings";

/** Shape of a booking_holds row as returned by Supabase realtime payloads */
interface BookingHoldRow {
    id: string;
    room_id: string;
    check_in: string;
    check_out: string;
    session_id: string;
    expires_at: string;
    has_contention: boolean;
    contention_cleared: boolean;
    contention_deadline: string | null;
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
    contentionCleared: boolean;
    contentionDeadline: string | null;
    isConnected: boolean;
    isLoading: boolean;
}

export function useRealtimeHolds({
    roomId,
    checkIn,
    checkOut,
    mySessionId
}: UseRealtimeHoldsOptions): UseRealtimeHoldsResult {
    const [allHolds, setAllHolds] = useState<BookingHold[]>([]);
    const [hasContention, setHasContention] = useState(false);
    const [contentionCleared, setContentionCleared] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ── Derived: activeHold is computed synchronously from allHolds ──
    // This eliminates the race condition where async fetch hadn't completed
    // before the user clicked "Book Now"
    const activeHold = useMemo(() => {
        if (!checkIn || !checkOut) return null;
        return allHolds.find(h => {
            if (h.sessionId === mySessionId) return false; // Not my own hold
            const holdStart = new Date(h.checkIn);
            const holdEnd = new Date(h.checkOut);
            return holdStart < checkOut && holdEnd > checkIn;
        }) ?? null;
    }, [allHolds, checkIn, checkOut, mySessionId]);

    // ── Initial fetch of all holds for this room ──
    useEffect(() => {
        let isMounted = true;

        async function fetchHolds() {
            try {
                const roomHolds = await getRoomHoldsAction(roomId);
                if (isMounted) {
                    setAllHolds(roomHolds);
                }
            } catch (error) {
                console.error('Error fetching holds:', error);
            }
            if (isMounted) setIsLoading(false);
        }

        fetchHolds();
        return () => { isMounted = false; };
    }, [roomId]); // Only re-fetch when roomId changes

    // ── Client-side expiry pruning ──
    // Removes holds whose expiresAt has passed (heartbeat stopped = UserA left)
    // This is the reliable fallback when Realtime DELETE events are missed
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().toISOString();
            setAllHolds(prev => {
                const filtered = prev.filter(h => h.expiresAt > now);
                return filtered.length !== prev.length ? filtered : prev; // Avoid unnecessary re-renders
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Ping is now triggered explicitly by UserB clicking "Inform me"
    // in HoldContentionContext.selectWatching, NOT on auto-detection.

    // Refs for stable access inside the realtime handler
    const stateRef = useRef({ mySessionId });
    useEffect(() => {
        stateRef.current = { mySessionId };
    });

    // ── Realtime subscription ──
    // IMPORTANT: Channel name must be unique per hook instance AND per effect invocation.
    // The Supabase browser client is a singleton. useRef persists across StrictMode re-mounts,
    // so generating the ID inside the effect ensures each mount gets a truly unique channel.
    useEffect(() => {
        const channelName = `holds-${roomId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const supabase = createClient();
        const channel = supabase
            .channel(channelName)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'booking_holds'
            }, (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => {
                const eventType = payload.eventType;
                const current = stateRef.current;

                if (eventType === 'INSERT') {
                    const newRecord = payload.new as unknown as BookingHoldRow;
                    // Client-side room filter
                    if (newRecord.room_id !== roomId) return;

                    const hold: BookingHold = {
                        id: newRecord.id,
                        roomId: newRecord.room_id,
                        checkIn: newRecord.check_in,
                        checkOut: newRecord.check_out,
                        sessionId: newRecord.session_id,
                        expiresAt: newRecord.expires_at,
                        hasContention: newRecord.has_contention,
                        contentionDeadline: newRecord.contention_deadline,
                        createdAt: newRecord.created_at
                    };

                    setAllHolds(prev => {
                        if (prev.some(h => h.id === hold.id)) return prev;
                        return [...prev, hold];
                    });
                }

                if (eventType === 'UPDATE') {
                    const newRecord = payload.new as unknown as BookingHoldRow;
                    // Client-side room filter
                    if (newRecord.room_id !== roomId) return;

                    setAllHolds(prev => prev.map(h => h.id === newRecord.id ? {
                        ...h,
                        hasContention: newRecord.has_contention,
                        expiresAt: newRecord.expires_at,
                        contentionDeadline: newRecord.contention_deadline
                    } : h));

                    // Contention check — UserA's hold was marked as contention
                    if (newRecord.session_id === current.mySessionId && newRecord.has_contention) {
                        setHasContention(true);
                        setContentionCleared(false);
                    }

                    // Contention cleared — UserB backed off
                    if (newRecord.session_id === current.mySessionId && newRecord.contention_cleared) {
                        setContentionCleared(true);
                        setHasContention(false);
                    }
                }

                if (eventType === 'DELETE') {
                    const oldRecord = payload.old as { id: string };
                    // DELETE only has the primary key — match against existing allHolds
                    setAllHolds(prev => prev.filter(h => h.id !== oldRecord.id));
                }
            })
            .subscribe((status: string) => {
                setIsConnected(status === 'SUBSCRIBED');
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId]);

    // Derive contentionDeadline from own hold (set when UserB triggers contention)
    const ownContentionDeadline = useMemo(() => {
        if (!mySessionId) return null;
        const ownHold = allHolds.find(h => h.sessionId === mySessionId);
        return ownHold?.contentionDeadline ?? null;
    }, [allHolds, mySessionId]);

    return { activeHold, allHolds, hasContention, contentionCleared, contentionDeadline: ownContentionDeadline, isConnected, isLoading };
}

