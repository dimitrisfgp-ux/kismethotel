"use client";

import { Room } from "@/types";
import { useDateContext } from "@/contexts/DateContext";
import { DayPicker, useNavigation } from "react-day-picker";
import "react-day-picker/style.css";
import { Button } from "../ui/Button";
import { formatCurrency, calculateTotal } from "@/lib/priceCalculator";
import { differenceInDays, format, addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingCardProps {
    room: Room;
}

function CustomCaption(props: { calendarMonth: { date: Date } }) {
    const { goToMonth, nextMonth, previousMonth } = useNavigation();
    return (
        <div className="flex items-center justify-center gap-4 pb-4 pt-2 relative">
            <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-transparent text-[var(--color-aegean-blue)] hover:text-[var(--color-deep-med)]"
                onClick={() => previousMonth && goToMonth(previousMonth)}
                disabled={!previousMonth}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-montserrat font-bold text-sm text-[var(--color-charcoal)] uppercase tracking-widest min-w-[140px] text-center">
                {format(props.calendarMonth.date, 'MMMM yyyy')}
            </span>
            <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-transparent text-[var(--color-aegean-blue)] hover:text-[var(--color-deep-med)]"
                onClick={() => nextMonth && goToMonth(nextMonth)}
                disabled={!nextMonth}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}

export function BookingCard({ room }: BookingCardProps) {
    const { dateRange, setDateRange } = useDateContext();
    const router = useRouter();

    // Logic: If 'from' is selected but 'to' is not, consider it 1 night (User selecting just check-in for 1 night stay)
    const nights = dateRange?.from
        ? (dateRange.to ? Math.max(1, differenceInDays(dateRange.to, dateRange.from)) : 1)
        : 0;

    const total = calculateTotal(room.pricePerNight, nights);

    const handleBookNow = () => {
        if (!dateRange?.from) {
            alert("Please select dates first."); // Or use Toast
            return;
        }

        // If single day selected, assume 1 night for booking flow
        // The context in book page will likely need 'to' to be defined, but we pass roomId. 
        // We might want to set the context 'to' here before navigating? 
        // Or better, let the book page handle it via URL params if implemented, but here we just push.
        // Actually, let's update local context to ensure consistency if we rely on it.
        if (!dateRange.to) {
            setDateRange({ from: dateRange.from, to: addDays(dateRange.from, 1) });
        }

        // Navigate to booking flow
        router.push(`/book?roomId=${room.id}`);
    };

    return (
        <div className="sticky top-28 bg-white border border-[var(--color-sand)] rounded-card shadow-xl animate-slide-up overflow-hidden">
            {/* Header: Price */}
            <div className="p-6 bg-[var(--color-warm-white)] border-b border-[var(--color-sand)] text-center">
                <span className="font-montserrat text-3xl font-bold text-[var(--color-aegean-blue)]">{formatCurrency(room.pricePerNight)}</span>
                <span className="text-sm font-inter opacity-60 ml-1">/ night</span>
            </div>

            <div className="p-6 space-y-6">
                {/* Inline Calendar */}
                <div className="flex justify-center">
                    <DayPicker
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
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
                    />
                </div>

                {/* Totals & Action */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-4 border-t border-[var(--color-sand)] font-inter">
                        <span className="text-sm uppercase tracking-widest opacity-60">Total Stay</span>
                        <div className="text-right">
                            {nights > 0 ? (
                                <>
                                    <span className="block font-bold text-lg text-[var(--color-charcoal)]">{formatCurrency(total)}</span>
                                    <span className="text-xs opacity-50">{nights} nights</span>
                                </>
                            ) : (
                                <span className="text-sm opacity-40">- -</span>
                            )}
                        </div>
                    </div>

                    <Button
                        onClick={handleBookNow}
                        className="w-full rounded-subtle h-14 text-lg"
                        disabled={nights === 0}
                    >
                        {nights > 0 ? "Book Now" : "Select Dates"}
                    </Button>

                    <p className="text-center text-[10px] opacity-50 uppercase tracking-widest">You won&apos;t be charged yet</p>
                </div>
            </div>
        </div>
    );
}
