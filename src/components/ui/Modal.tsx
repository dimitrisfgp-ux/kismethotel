"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
}

export function Modal({ isOpen, onClose, children, className, size = "md" }: ModalProps) {
    const [mounted, setMounted] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        full: "max-w-[95vw] h-[95vh]"
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={overlayRef}
                className="absolute inset-0"
                onClick={onClose}
            />
            <div
                className={cn(
                    "relative bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200",
                    sizeClasses[size],
                    className
                )}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}

export function ModalHeader({ children, className, onClose }: { children: ReactNode, className?: string, onClose?: () => void }) {
    return (
        <div className={cn("flex items-center justify-between px-6 py-4 border-b border-gray-100", className)}>
            <div className="text-lg font-semibold text-gray-900">{children}</div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}

export function ModalBody({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <div className={cn("p-6", className)}>
            {children}
        </div>
    );
}

export function ModalFooter({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <div className={cn("flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50", className)}>
            {children}
        </div>
    );
}
