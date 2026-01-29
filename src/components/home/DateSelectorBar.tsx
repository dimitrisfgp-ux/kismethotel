import { useRef, useState, useEffect } from "react";
import { useDateContext } from "@/contexts/DateContext";
import { DatePickerWithRange } from "../booking/DateRangePicker";
import { Container } from "../ui/Container";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";

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

// Internal Guest Selector Component (Replaces native select)
function GuestSelector({ value, onChange, customTrigger }: { value: number, onChange: (val: number) => void, customTrigger?: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const options = [
        { value: 1, label: "1 Guest, 1 Bed" },
        { value: 2, label: "2 Guests, 1 Bed" },
        { value: 3, label: "3 Guests, 2 Beds" },
        { value: 4, label: "4 Guests, 2 Beds" },
    ];

    const currentLabel = options.find(o => o.value === value)?.label || "Select Guests";

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger */}
            <div onClick={() => setIsOpen(!isOpen)}>
                {customTrigger ? customTrigger : (
                    <button className="w-full text-left h-[42px] px-3 border border-[var(--color-sand)] rounded-[var(--radius-subtle)] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-aegean-blue)] font-inter flex items-center justify-between min-w-[160px]">
                        <span className="truncate">{currentLabel}</span>
                    </button>
                )}
            </div>

            {/* Dropdown / Modal */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu Container */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none md:absolute md:inset-auto md:top-12 md:left-0 md:translate-x-0">
                        <div className="pointer-events-auto w-[280px] md:w-[200px] bg-white border border-[var(--color-sand)] shadow-2xl md:shadow-lg rounded-card md:rounded-[var(--radius-subtle)] overflow-hidden animate-slide-up p-2 md:p-0">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-4 py-3 text-sm rounded-md md:rounded-none hover:bg-[var(--color-sand)]/20 transition-colors font-inter flex items-center justify-between",
                                        value === option.value ? "bg-[var(--color-aegean-blue)]/5 text-[var(--color-aegean-blue)] font-semibold" : "text-[var(--color-charcoal)]"
                                    )}
                                >
                                    {option.label}
                                    {value === option.value && <div className="h-2 w-2 rounded-full bg-[var(--color-aegean-blue)]" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
