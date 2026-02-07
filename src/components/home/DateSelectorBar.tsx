import { useDateContext } from "@/contexts/DateContext";
import { DatePickerWithRange } from "../booking/DateRangePicker";
import { Container } from "../ui/Container";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, BedDouble } from "lucide-react";
import { BedSelector } from "../ui/BedSelector";
import { MOBILE_FILTER_BTN_CLASS } from "@/data/constants";

interface DateSelectorBarProps {
    onPrev?: () => void;
    onNext?: () => void;
    canPrev?: boolean;
    canNext?: boolean;
    onFilterClick?: () => void;
    maxDoubleBeds?: number;
    maxSingleBeds?: number;
}

// Helper Component for Navigation Buttons
function NavButton({ onClick, disabled, icon: Icon, ariaLabel }: { onClick?: () => void, disabled?: boolean, icon: React.ElementType, ariaLabel: string }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className="p-2 rounded-full hover:bg-[var(--color-sand)] disabled:opacity-20 transition-colors active:scale-95 touch-manipulation"
        >
            <Icon className="h-6 w-6 text-[var(--color-charcoal)]" />
        </button>
    );
}

export function DateSelectorBar({ onPrev, onNext, canPrev, canNext, onFilterClick, maxDoubleBeds, maxSingleBeds }: DateSelectorBarProps) {
    const { dateRange, setDateRange, doubleBeds, setDoubleBeds, singleBeds, setSingleBeds } = useDateContext();

    return (
        <div className="sticky top-16 md:top-[var(--header-height)] z-40 bg-white/95 backdrop-blur-sm border-y border-[var(--color-sand)] shadow-sm py-3 md:py-4 transition-all duration-300">
            <Container className="relative">

                {/* DESKTOP LAYOUT (Hidden on Mobile) */}
                <div className="hidden md:flex items-center justify-center gap-8">
                    <NavButton onClick={onPrev} disabled={!canPrev} icon={ChevronLeft} ariaLabel="Previous Date" />

                    {/* Wrapper for inputs */}
                    <div className="flex items-center justify-center gap-6">
                        {/* Dates */}
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-[var(--color-charcoal)] opacity-60 font-semibold mb-1 text-center">Stay Dates</span>
                            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                        </div>

                        <div className="h-10 w-[1px] bg-[var(--color-sand)]" />

                        {/* Beds */}
                        <div className="flex flex-col min-w-[140px]">
                            <span className="text-[10px] uppercase tracking-widest text-[var(--color-charcoal)] opacity-60 font-semibold mb-1 text-center">Beds</span>
                            <BedSelector
                                doubleBeds={doubleBeds}
                                setDoubleBeds={setDoubleBeds}
                                singleBeds={singleBeds}
                                setSingleBeds={setSingleBeds}
                                maxDoubleBeds={maxDoubleBeds}
                                maxSingleBeds={maxSingleBeds}
                            />
                        </div>
                    </div>

                    <NavButton onClick={onNext} disabled={!canNext} icon={ChevronRight} ariaLabel="Next Date" />
                </div>


                {/* MOBILE LAYOUT (Flex Row: Arrow | Icon | Icon | Arrow) */}
                <div className="md:hidden flex items-center justify-between w-full px-2">
                    <NavButton onClick={onPrev} disabled={!canPrev} icon={ChevronLeft} ariaLabel="Previous Date Mobile" />

                    {/* Filter Icons Centered */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onFilterClick}
                            aria-label="Filter Dates"
                            className={MOBILE_FILTER_BTN_CLASS}
                        >
                            <CalendarIcon className="h-6 w-6" />
                        </button>

                        <button
                            onClick={onFilterClick}
                            aria-label="Filter Guests"
                            className={MOBILE_FILTER_BTN_CLASS}
                        >
                            <BedDouble className="h-6 w-6" />
                        </button>
                    </div>

                    <NavButton onClick={onNext} disabled={!canNext} icon={ChevronRight} ariaLabel="Next Date Mobile" />
                </div>

            </Container>
        </div>
    );
}


