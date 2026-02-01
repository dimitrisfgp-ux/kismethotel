"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamic import for Calendar to avoid initial bundle weight & CSS blocking
// Only loads when the popover is opened
const Calendar = dynamic(() => import("../ui/Calendar").then(m => m.Calendar), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-[var(--color-warm-white)] animate-pulse rounded-card" />
});

interface DatePickerWithRangeProps {
    className?: string;
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    customTrigger?: React.ReactNode;
}

export function DatePickerWithRange({
    className,
    date,
    setDate,
    customTrigger,
}: DatePickerWithRangeProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className={cn("relative grid gap-2", className)}>
            {customTrigger ? (
                <div onClick={() => setIsOpen(!isOpen)}>{customTrigger}</div>
            ) : (
                <button
                    id="date"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-auto min-w-[220px] justify-center text-center font-normal flex items-center px-4 py-2 border border-[var(--color-sand)] rounded-[var(--radius-subtle)] bg-white hover:bg-[var(--color-warm-white)] transition-colors",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                        date.to ? (
                            <>
                                {format(date.from, "MM/dd/yy")} -{" "}
                                {format(date.to, "MM/dd/yy")}
                            </>
                        ) : (
                            format(date.from, "MM/dd/yy")
                        )
                    ) : (
                        <span>Pick your dates</span>
                    )}
                </button>
            )}

            {isOpen && (
                <>
                    {/* Backdrop / Overlay - Mobile Fixed, Desktop Transparent click-off */}
                    <div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Content Container */}
                    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none md:absolute md:inset-auto md:top-12 md:left-0 md:block">
                        <div className="pointer-events-auto bg-white border border-[var(--color-sand)] shadow-2xl rounded-card p-4 md:p-4 animate-slide-up md:animate-slide-up w-auto max-w-[90vw] md:max-w-none overflow-hidden">
                            {/* Mobile Header (Optional close button) */}
                            <div className="flex md:hidden justify-between items-center mb-4 pb-2 border-b border-[var(--color-sand)]">
                                <span className="font-montserrat font-bold text-[var(--color-aegean-blue)]">Select Dates</span>
                                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-[var(--color-sand)]">
                                    <span className="sr-only">Close</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>

                            <Calendar
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={1}
                            // showOutsideDays={false}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
