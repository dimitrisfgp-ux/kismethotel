"use client";

import { useState } from "react";
import { iconMap } from "@/components/ui/icons/iconMap";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconPickerProps {
    value: string;
    onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const SelectedIcon = iconMap[value] || iconMap["Star"];

    // Filter logic
    const filteredIcons = Object.keys(iconMap).filter(key =>
        key.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative">
            {/* Trigger */}
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full justify-between px-3 h-11"
                >
                    <span className="flex items-center gap-2">
                        <SelectedIcon className="h-4 w-4" />
                        {value || "Select Icon"}
                    </span>
                    <span className="text-xs text-muted-foreground">Change</span>
                </Button>
            </div>

            {/* Popover */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full min-w-[300px] bg-white rounded-[var(--radius-subtle)] border border-[var(--color-sand)] shadow-xl p-4 animate-fade-in">

                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search icons..."
                                className="pl-9 h-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                        {filteredIcons.map((iconName) => {
                            const Icon = iconMap[iconName];
                            return (
                                <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => {
                                        onChange(iconName);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "p-2 rounded-md hover:bg-[var(--color-warm-white)] hover:text-[var(--color-aegean-blue)] flex items-center justify-center transition-colors",
                                        value === iconName ? "bg-[var(--color-aegean-blue)] text-white hover:bg-[var(--color-aegean-blue)] hover:text-white" : "text-gray-600"
                                    )}
                                    title={iconName}
                                >
                                    <Icon className="h-5 w-5" />
                                </button>
                            );
                        })}
                        {filteredIcons.length === 0 && (
                            <div className="col-span-6 text-center py-4 text-sm text-gray-400">
                                No icons found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
