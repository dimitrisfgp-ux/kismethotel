"use client";

import * as React from "react";
import { formatDate } from "@/lib/dateUtils";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { TIMEZONE_DISCLAIMER } from "@/data/constants";
import { useClickOutside } from "@/hooks/useClickOutside";

// Dynamic import for Calendar to avoid initial bundle weight & CSS blocking
// Only loads when the popover is opened
const Calendar = dynamic(() => import("../ui/Calendar").then(m => m.Calendar), {
    ssr: false,
    loading: () => <div className="h-[310px] w-full bg-[var(--color-warm-white)] animate-pulse rounded-card" />
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
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Predictive Preload Strategy
    const preloadCalendar = () => {
        // Manually trigger the dynamic import to prime the cache
        import("../ui/Calendar");
    };

    // 1. Idle Preload (Wait 2s then load - helps mobile/fast path)
    React.useEffect(() => {
        const timer = setTimeout(preloadCalendar, 2000);
        return () => clearTimeout(timer);
    }, []);

    useClickOutside(containerRef, () => setIsOpen(false));

    return (
        <div ref={containerRef} className={cn("relative grid gap-2", className)} onMouseEnter={preloadCalendar}>
            {customTrigger ? (
                <div onClick={() => setIsOpen(!isOpen)}>{customTrigger}</div>
            ) : (
                <button
                    id="date"
                    onClick={() => setIsOpen(!isOpen)}
                    onMouseEnter={preloadCalendar}
                    onFocus={preloadCalendar}
                    className={cn(
                        "w-auto min-w-[220px] justify-center text-center font-normal flex items-center px-4 py-2 border border-[var(--color-sand)] rounded-[var(--radius-subtle)] bg-white hover:bg-[var(--color-warm-white)] transition-colors",
                        !date && "text-muted-foreground"
                    )}
                >

                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                        date.to ? (
                            <>
                                {formatDate(date.from)} -{" "}
                                {formatDate(date.to)}
                            </>
                        ) : (
                            formatDate(date.from)
                        )
                    ) : (
                        <span>Pick your dates</span>
                    )}
                </button>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none md:absolute md:inset-auto md:top-12 md:left-0 md:block">
                    <div className="pointer-events-auto bg-white border border-[var(--color-sand)] shadow-2xl rounded-card p-4 md:p-4 animate-slide-up md:animate-slide-up w-auto max-w-[90vw] md:max-w-none overflow-hidden min-h-[340px] min-w-[300px]">
                        {/* Mobile Header (Optional close button) */}
                        <div className="flex md:hidden justify-between items-center mb-4 pb-2 border-b border-[var(--color-sand)]">
                            <span className="font-montserrat font-bold text-[var(--color-aegean-blue)]">Select Dates</span>
                            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-[var(--color-sand)]">
                                <span className="sr-only">Close</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        <Calendar
                            className="calendar-light p-3"
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={1}
                            disabled={{ before: new Date() }}
                        />
                        <p className="text-[10px] text-center text-[var(--color-charcoal)]/50 mt-2">
                            {TIMEZONE_DISCLAIMER}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
