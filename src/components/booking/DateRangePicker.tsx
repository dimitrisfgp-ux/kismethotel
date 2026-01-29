"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange, DayPicker, useNavigation } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerWithRangeProps {
    className?: string;
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    customTrigger?: React.ReactNode;
}

function CustomCaption(props: { calendarMonth: { date: Date } }) {
    const { goToMonth, nextMonth, previousMonth } = useNavigation();
    return (
        <div className="flex items-center justify-center gap-4 pb-4 pt-2 relative">
            <button
                className="h-7 w-7 p-0 hover:bg-transparent text-[var(--color-aegean-blue)] hover:text-[var(--color-deep-med)] flex items-center justify-center disabled:opacity-30"
                onClick={() => previousMonth && goToMonth(previousMonth)}
                disabled={!previousMonth}
            >
                <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-montserrat font-bold text-sm text-[var(--color-charcoal)] uppercase tracking-widest min-w-[140px] text-center">
                {format(props.calendarMonth.date, 'MMMM yyyy')}
            </span>
            <button
                className="h-7 w-7 p-0 hover:bg-transparent text-[var(--color-aegean-blue)] hover:text-[var(--color-deep-med)] flex items-center justify-center disabled:opacity-30"
                onClick={() => nextMonth && goToMonth(nextMonth)}
                disabled={!nextMonth}
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
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

                            <DayPicker
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={1}
                                showOutsideDays={false}
                                hideNavigation
                                components={{
                                    MonthCaption: CustomCaption
                                }}
                                modifiersClassNames={{
                                    selected: "bg-[var(--color-aegean-blue)] text-white hover:bg-[var(--color-deep-med)] rounded-full",
                                    range_start: "bg-[var(--color-aegean-blue)] text-white rounded-l-full rounded-r-none",
                                    range_end: "bg-[var(--color-aegean-blue)] text-white rounded-l-none rounded-r-full",
                                    range_middle: "!bg-[var(--color-aegean-blue)]/10 !text-[var(--color-charcoal)] rounded-none",
                                    today: "text-[var(--color-aegean-blue)] font-bold"
                                }}
                                styles={{
                                    head_cell: { color: 'var(--color-charcoal)', opacity: 0.6, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' },
                                    day: { transition: 'background-color 0.2s', fontFamily: 'var(--font-inter)' }
                                }}
                                className="rdp-custom" // We might need global CSS for responsiveness if 2 months break layout
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
