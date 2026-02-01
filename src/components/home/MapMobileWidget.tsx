"use client";

import { cn } from "@/lib/utils";

interface Category {
    label: string;
    types: string[];
    icon: React.ReactNode;
    color?: string;
}

interface MapMobileWidgetProps {
    isVisible: boolean;
    categories: Category[];
    activeCategoryIndex: number | null;
    onCategorySelect: (index: number) => void;
}

export function MapMobileWidget({ isVisible, categories, activeCategoryIndex, onCategorySelect }: MapMobileWidgetProps) {
    return (
        <div
            className={cn(
                "fixed bottom-6 left-4 right-4 md:hidden z-[1000] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
            )}
        >
            <div className="bg-white/95 backdrop-blur-md border border-[var(--color-sand)] rounded-full shadow-2xl drop-shadow-lg py-2 px-2">
                <div className="flex items-center justify-center w-full gap-2 overflow-x-auto overflow-y-hidden no-scrollbar px-1">
                    {categories.map((cat, index) => {
                        const isActive = activeCategoryIndex === index;
                        const activeColor = cat.color || "var(--color-deep-med)";

                        return (
                            <button
                                key={cat.label}
                                onClick={() => onCategorySelect(index)}
                                style={{
                                    backgroundColor: isActive ? activeColor : 'white',
                                    borderColor: isActive ? activeColor : 'var(--color-accent-gold)',
                                    color: isActive ? 'white' : 'var(--color-deep-med)'
                                }}
                                className={cn(
                                    "flex-shrink-0 p-2 rounded-full transition-all duration-300 relative border shadow-sm",
                                    isActive
                                        ? "shadow-md"
                                        : "hover:bg-[var(--color-sand)]/20"
                                )}
                                aria-label={cat.label}
                            >
                                {cat.icon}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
