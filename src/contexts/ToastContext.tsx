"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Toast } from "@/components/ui/Toast";

type ToastType = 'success' | 'error';

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState<ToastType>('success');

    const showToast = useCallback((msg: string, t: ToastType) => {
        setMessage(msg);
        setType(t);
        setIsVisible(true);
    }, []);

    const hideToast = useCallback(() => {
        setIsVisible(false);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast
                message={message}
                type={type}
                isVisible={isVisible}
                onClose={hideToast}
            />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
