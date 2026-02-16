"use client";

import { Modal, ModalHeader, ModalBody } from "@/components/ui/Modal";
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalHeader onClose={onClose} className="bg-[var(--color-warm-white)]">
                <div className="flex items-center gap-4">
                    <h3 className="font-montserrat font-bold text-sm uppercase tracking-wider text-[var(--color-aegean-blue)]">
                        Filter: {title}
                    </h3>
                    {onClear && (
                        <button
                            onClick={onClear}
                            className="text-xs text-[var(--color-charcoal)]/60 hover:text-[var(--color-aegean-blue)] transition-colors underline"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </ModalHeader>

            <ModalBody>
                {children}
            </ModalBody>
        </Modal>
    );
}
