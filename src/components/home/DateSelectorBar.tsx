import { useRef, useState, useEffect } from "react";
import { useDateContext } from "@/contexts/DateContext";
import { DatePickerWithRange } from "../booking/DateRangePicker";
import { Container } from "../ui/Container";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";
import { GuestSelector } from "../ui/GuestSelector";

interface DateSelectorBarProps {
    onPrev?: () => void;
    onNext?: () => void;
    canPrev?: boolean;
    canNext?: boolean;
    onFilterClick?: () => void;
}

export function DateSelectorBar({ onPrev, onNext, canPrev, canNext, onFilterClick }: DateSelectorBarProps) {
    const { dateRange, setDateRange, guestCount, setGuestCount } = useDateContext();

    return (
        <div className="sticky top-16 md:top-[var(--header-height)] z-40 bg-white/95 backdrop-blur-sm border-y border-[var(--color-sand)] shadow-sm py-3 md:py-4 transition-all duration-300">
            <Container className="relative">

                {/* DESKTOP LAYOUT (Hidden on Mobile) */}
                <div className="hidden md:flex items-center justify-center gap-8">
                    {/* Prev Button */}
                    <button
                        onClick={onPrev}
                        disabled={!canPrev}
                        className="p-2 rounded-full hover:bg-[var(--color-sand)] disabled:opacity-20 transition-colors"
                    >
                        <ChevronLeft className="h-6 w-6 text-[var(--color-charcoal)]" />
                    </button>

                    {/* Wrapper for inputs */}
                    <div className="flex items-center justify-center gap-6">
                        {/* Dates */}
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-[var(--color-charcoal)] opacity-60 font-semibold mb-1 text-center">Stay Dates</span>
                            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                        </div>

                        <div className="h-10 w-[1px] bg-[var(--color-sand)]" />

                        {/* Guests */}
                        <div className="flex flex-col min-w-[120px]">
                            <span className="text-[10px] uppercase tracking-widest text-[var(--color-charcoal)] opacity-60 font-semibold mb-1 text-center">Guests & Beds</span>
                            <GuestSelector value={guestCount} onChange={setGuestCount} />
                        </div>
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={onNext}
                        disabled={!canNext}
                        className="p-2 rounded-full hover:bg-[var(--color-sand)] disabled:opacity-20 transition-colors"
                    >
                        <ChevronRight className="h-6 w-6 text-[var(--color-charcoal)]" />
                    </button>
                </div>


                {/* MOBILE LAYOUT (Flex Row: Arrow | Icon | Icon | Arrow) */}
                <div className="md:hidden flex items-center justify-between w-full px-2">
                    {/* Prev */}
                    <button onClick={onPrev} disabled={!canPrev} className="p-2 disabled:opacity-20">
                        <ChevronLeft className="h-6 w-6 text-[var(--color-charcoal)]" />
                    </button>

                    {/* Filter Icons Centered */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onFilterClick}
                            className="p-3 bg-white border-2 border-[var(--color-accent-gold)] rounded-full text-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)] hover:text-white transition-all duration-300 active:scale-95 shadow-sm"
                        >
                            <CalendarIcon className="h-6 w-6" />
                        </button>

                        <button
                            onClick={onFilterClick}
                            className="p-3 bg-white border-2 border-[var(--color-accent-gold)] rounded-full text-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)] hover:text-white transition-all duration-300 active:scale-95 shadow-sm"
                        >
                            <BedDouble className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Next */}
                    <button onClick={onNext} disabled={!canNext} className="p-2 disabled:opacity-20">
                        <ChevronRight className="h-6 w-6 text-[var(--color-charcoal)]" />
                    </button>
                </div>

            </Container>
        </div>
    );
}


