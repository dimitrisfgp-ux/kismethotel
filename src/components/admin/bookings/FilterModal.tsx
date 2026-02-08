"use client";

import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface FilterModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    onClear?: () => void;
}

export function FilterModal({ title, isOpen, onClose, children, onClear }: FilterModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[70] flex items-start justify-center pt-24 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-2xl border border-[var(--color-sand)] w-full max-w-md animate-slide-up overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--color-sand)] bg-[var(--color-warm-white)]">
                    <h3 className="font-montserrat font-bold text-sm uppercase tracking-wider text-[var(--color-aegean-blue)]">
                        Filter: {title}
                    </h3>
                    <div className="flex items-center gap-2">
                        {onClear && (
                            <button
                                onClick={onClear}
                                className="text-xs text-[var(--color-charcoal)]/60 hover:text-[var(--color-aegean-blue)] transition-colors"
                            >
                                Clear
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-[var(--color-sand)] rounded transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
