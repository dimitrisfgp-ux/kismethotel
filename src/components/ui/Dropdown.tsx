"use client";

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@/hooks/useClickOutside';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
    label: string;
    onClick: () => void;
}

interface DropdownProps {
    label: string;
    items: DropdownItem[];
    className?: string;
}

export function Dropdown({ label, items, className }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useClickOutside(containerRef, () => setIsOpen(false));

    return (
        <div className={cn("relative inline-block text-left", className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex w-full justify-between items-center rounded-[var(--radius-subtle)] border border-[var(--color-sand)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-charcoal)] shadow-sm hover:bg-[var(--color-warm-white)] focus:outline-none focus:ring-1 focus:ring-[var(--color-aegean-blue)]"
            >
                {label}
                <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-[var(--radius-subtle)] bg-white border border-[var(--color-sand)] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in"
                >
                    <div className="py-1">
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.onClick();
                                    setIsOpen(false);
                                }}
                                className="block w-full px-4 py-2 text-left text-sm text-[var(--color-charcoal)] hover:bg-[var(--color-warm-white)] hover:text-[var(--color-aegean-blue)] transition-colors duration-200"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
