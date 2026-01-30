"use client";

import { cn } from "@/lib/utils";

interface BurgerIconProps {
    isOpen: boolean;
    onClick: () => void;
    dark?: boolean;
}

export function BurgerIcon({ isOpen, onClick, dark = false }: BurgerIconProps) {
    const lineClass = cn(
        "h-[2px] w-6 rounded-full transition-all duration-300 ease-premium",
        dark ? "bg-white" : "bg-[var(--color-charcoal)]"
    );

    return (
        <button onClick={onClick} aria-label={isOpen ? "Close Menu" : "Open Menu"} className="flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none z-50 relative">
            <span className={cn(lineClass, isOpen && "rotate-45 translate-y-2")} />
            <span className={cn(lineClass, isOpen && "opacity-0")} />
            <span className={cn(lineClass, isOpen && "-rotate-45 -translate-y-2")} />
        </button>
    );
}
