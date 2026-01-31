"use client";

import * as React from "react";
import { DayPicker, useNavigation, DayPickerProps } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function CustomCaption(props: { calendarMonth: { date: Date } }) {
    const { goToMonth, nextMonth, previousMonth } = useNavigation();
    return (
        <div className="flex items-center justify-center gap-4 pb-4 pt-2 relative">
            <button
                className="h-7 w-7 p-0 hover:bg-transparent text-[var(--cal-nav-color,var(--color-aegean-blue))] hover:text-[var(--color-deep-med)] flex items-center justify-center disabled:opacity-30 transition-colors"
                onClick={() => previousMonth && goToMonth(previousMonth)}
                disabled={!previousMonth}
                type="button"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-montserrat font-bold text-sm text-[var(--cal-label-color,var(--color-charcoal))] uppercase tracking-widest min-w-[140px] text-center">
                {format(props.calendarMonth.date, 'MMMM yyyy')}
            </span>
            <button
                className="h-7 w-7 p-0 hover:bg-transparent text-[var(--cal-nav-color,var(--color-aegean-blue))] hover:text-[var(--color-deep-med)] flex items-center justify-center disabled:opacity-30 transition-colors"
                onClick={() => nextMonth && goToMonth(nextMonth)}
                disabled={!nextMonth}
                type="button"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}

export type CalendarProps = DayPickerProps;

export function Calendar({ className, classNames, showOutsideDays = false, ...props }: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            hideNavigation
            className={cn("p-0", className)}
            components={{
                MonthCaption: CustomCaption
            }}
            modifiersClassNames={{
                selected: "bg-[var(--color-aegean-blue)] text-white hover:bg-[var(--color-deep-med)] rounded-full",
                range_start: "bg-[var(--color-aegean-blue)] text-white rounded-l-full rounded-r-none",
                range_end: "bg-[var(--color-aegean-blue)] text-white rounded-l-none rounded-r-full",
                range_middle: "!bg-[var(--color-aegean-blue)]/10 !text-[var(--color-charcoal)] rounded-none",
                today: "text-[var(--color-aegean-blue)] font-bold",
                ...classNames
            }}
            styles={{
                head_cell: { color: 'var(--color-charcoal)', opacity: 0.6, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' },
                day: { transition: 'background-color 0.2s', fontFamily: 'var(--font-inter)' }
            }}
            {...props}
        />
    );
}
