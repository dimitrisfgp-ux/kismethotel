"use client";

import { cn } from "@/lib/utils";

interface Category {
    label: string;
    types: string[];
    icon: React.ReactNode;
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
                "fixed bottom-6 left-4 right-4 md:hidden z-30 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
            )}
        >
            <div className="bg-white/90 backdrop-blur-md border border-[var(--color-sand)] rounded-full shadow-lg py-2 px-2">
                <div className="flex items-center justify-center w-full gap-2 overflow-x-auto overflow-y-hidden no-scrollbar px-1">
                    {categories.map((cat, index) => {
                        const isActive = activeCategoryIndex === index;
                        return (
                            <button
                                key={cat.label}
                                onClick={() => onCategorySelect(index)}
                                className={cn(
                                    "flex-shrink-0 p-2 rounded-full transition-all duration-300 relative",
                                    isActive
                                        ? "bg-[var(--color-aegean-blue)] text-white shadow-md border border-transparent"
                                        : "bg-white border border-[var(--color-sand)] text-[var(--color-aegean-blue)] shadow-sm hover:bg-[var(--color-sand)]/20"
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
