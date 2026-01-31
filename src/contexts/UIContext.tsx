"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
    isFloatingWidgetVisible: boolean;
    setFloatingWidgetVisible: (visible: boolean) => void;
    isFloatingWidgetOpen: boolean;
    setFloatingWidgetOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isFloatingWidgetVisible, setFloatingWidgetVisible] = useState(true);
    const [isFloatingWidgetOpen, setFloatingWidgetOpen] = useState(false);

    return (
        <UIContext.Provider value={{ isFloatingWidgetVisible, setFloatingWidgetVisible, isFloatingWidgetOpen, setFloatingWidgetOpen }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUIContext() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error("useUIContext must be used within a UIProvider");
    }
    return context;
}
