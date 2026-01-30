"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { DateRange } from 'react-day-picker';

interface DateContextType {
    dateRange: DateRange | undefined;
    setDateRange: (range: DateRange | undefined) => void;
    guestCount: number;
    setGuestCount: (count: number) => void;
    doubleBeds: number;
    setDoubleBeds: (count: number) => void;
    singleBeds: number;
    setSingleBeds: (count: number) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export function DateProvider({ children }: { children: ReactNode }) {
    // Default values
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [guestCount, setGuestCount] = useState<number>(2);
    // Initialize strict bed preferences to 0 (Any)
    const [doubleBeds, setDoubleBeds] = useState<number>(0);
    const [singleBeds, setSingleBeds] = useState<number>(0);

    return (
        <DateContext.Provider value={{
            dateRange, setDateRange,
            guestCount, setGuestCount,
            doubleBeds, setDoubleBeds,
            singleBeds, setSingleBeds
        }}>
            {children}
        </DateContext.Provider>
    );
}

export function useDateContext() {
    const context = useContext(DateContext);
    if (context === undefined) {
        throw new Error('useDateContext must be used within a DateProvider');
    }
    return context;
}
