"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
    isFloatingWidgetVisible: boolean;
    setFloatingWidgetVisible: (visible: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isFloatingWidgetVisible, setFloatingWidgetVisible] = useState(true);

    return (
        <UIContext.Provider value={{ isFloatingWidgetVisible, setFloatingWidgetVisible }}>
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
