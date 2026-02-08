"use client";

import { Room, BlockedDate, Booking } from "@/types";
import { useDateContext } from "@/contexts/DateContext";
import { Calendar } from "../ui/Calendar";
import { Button } from "../ui/Button";
import { formatCurrency, calculateTotal } from "@/lib/priceCalculator";
import { differenceInDays, addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { TIMEZONE_DISCLAIMER } from "@/data/constants";

interface BookingCardProps {
    room: Room;
    blockedDates?: BlockedDate[];
    bookings?: Booking[];
}

export function BookingCard({ room, blockedDates = [], bookings = [] }: BookingCardProps) {
    const { dateRange, setDateRange } = useDateContext();
    const router = useRouter();

    // Prepare disabled dates for DayPicker (including past dates)
    const disabledDates = [
        { before: new Date() }, // Disable all past dates
        ...blockedDates.map(b => ({ from: new Date(b.from), to: new Date(b.to) })),
        ...bookings.filter(b => b.status === 'confirmed').map(b => ({ from: new Date(b.checkIn), to: new Date(b.checkOut) }))
    ];

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

    // Modifiers Calculation
    const bookedMatchers = bookings
        .filter(b => b.status === "confirmed")
        .map(b => ({ from: new Date(b.checkIn), to: new Date(b.checkOut) }));

    const maintenanceMatchers = blockedDates
        .filter(b => b.reason === "Maintenance")
        .map(b => ({ from: new Date(b.from), to: new Date(b.to) }));

    const renovationMatchers = blockedDates
        .filter(b => b.reason === "Renovations")
        .map(b => ({ from: new Date(b.from), to: new Date(b.to) }));

    const seasonMatchers = blockedDates
        .filter(b => b.reason === "Out of Season")
        .map(b => ({ from: new Date(b.from), to: new Date(b.to) }));

    const otherMatchers = blockedDates
        .filter(b => b.reason === "Other")
        .map(b => ({ from: new Date(b.from), to: new Date(b.to) }));

    return (
        <div className="sticky top-28 bg-white border border-[var(--color-sand)] rounded-card shadow-xl animate-slide-up overflow-hidden">
            {/* Header: Price */}
            <div className="p-6 bg-[var(--color-warm-white)] border-b border-[var(--color-sand)] text-center">
                <span className="font-montserrat text-3xl font-bold text-[var(--color-aegean-blue)]">{formatCurrency(room.pricePerNight)}</span>
                <span className="text-sm font-inter opacity-60 ml-1">/ night</span>
            </div>

            <div className="p-6 space-y-6">
                {/* Inline Calendar */}
                <div className="flex justify-center booking-calendar-wrapper">
                    <Calendar
                        className="calendar-light p-3"
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={1}
                        disabled={disabledDates}
                        modifiers={{
                            booked: bookedMatchers,
                            maintenance: maintenanceMatchers,
                            renovation: renovationMatchers,
                            season: seasonMatchers,
                            other: otherMatchers
                        }}
                        modifiersClassNames={{
                            booked: "rdp-day_booked",
                            maintenance: "rdp-day_maintenance",
                            renovation: "rdp-day_renovation",
                            season: "rdp-day_season",
                            other: "rdp-day_other"
                        }}
                    />
                </div>
                <p className="text-[10px] text-center text-[var(--color-charcoal)]/50 mt-2">
                    {TIMEZONE_DISCLAIMER}
                </p>


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
