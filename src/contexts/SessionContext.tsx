"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface SessionContextType {
    sessionId: string | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        // Ensure we only run on client
        let id = localStorage.getItem('booking_session_id');
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem('booking_session_id', id);
        }
        setSessionId(id);
    }, []);

    return (
        <SessionContext.Provider value={{ sessionId }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
