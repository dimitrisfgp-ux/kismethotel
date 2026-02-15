"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

import { useRef, useState, useMemo, useEffect } from "react";
import { Room, RoomFilters, Booking, BlockedDate } from "@/types";
import { DEFAULT_FILTERS } from "@/lib/constants";
import { RoomCard } from "../rooms/RoomCard";
import { DateSelectorBar } from "./DateSelectorBar";
import { FilterWidget } from "./FilterWidget";
import { useRoomFilters } from "@/hooks/useRoomFilters";
import { scrollToElement } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useDateContext } from "@/contexts/DateContext";
import { getAvailabilityAction } from "@/app/actions/bookings";

// Dynamic import for FilterPanel - only loads when filter drawer is opened
const FilterPanel = dynamic(() => import("./FilterPanel").then(m => m.FilterPanel), {
    ssr: false,
    loading: () => null // Invisible loading state
});

interface RoomsGridProps {
    rooms: Room[];
}

export function RoomsGrid({ rooms }: RoomsGridProps) {
    const { dateRange, doubleBeds, singleBeds } = useDateContext(); // Consume context
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false); // For loading effect
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);

    useEffect(() => {
        getAvailabilityAction().then(({ bookings, blockedDates }) => {
            setBookings(bookings);
            setBlockedDates(blockedDates);
        });
    }, []);

    // Sync context guestCount with local filters or just use it in calculation
    const [filters, setFilters] = useState<RoomFilters>(DEFAULT_FILTERS);

    // Derive max bed counts for the Sticky Bar Selector
    const maxDoubleBeds = useMemo(() => Math.max(0, ...rooms.map(r => r.beds?.find(b => b.type === 'double')?.count || 0)), [rooms]);
    const maxSingleBeds = useMemo(() => Math.max(0, ...rooms.map(r => r.beds?.find(b => b.type === 'single')?.count || 0)), [rooms]);

    // Simulate search loading when dates or beds change
    useEffect(() => {
        if (dateRange || doubleBeds > 0 || singleBeds > 0) {
            setIsSearching(true);
            const timer = setTimeout(() => setIsSearching(false), 600);
            return () => clearTimeout(timer);
        }
    }, [dateRange, doubleBeds, singleBeds]);

    // Predictive Preload for FilterPanel (Mobile & Desktop Drawer)
    // Loads the heavy FilterPanel + Calendar chunk 2.5s after mount (Idle time)
    useEffect(() => {
        const timer = setTimeout(() => {
            import("./FilterPanel");
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    // Merge Context Filters with Local Filters
    const effectiveFilters = useMemo(() => ({
        ...filters,
        doubleBeds: filters.doubleBeds > 0 ? filters.doubleBeds : doubleBeds,
        singleBeds: filters.singleBeds > 0 ? filters.singleBeds : singleBeds
    }), [filters, doubleBeds, singleBeds]);

    const filteredRooms = useRoomFilters({
        rooms,
        filters: effectiveFilters,
        dateRange,
        bookings,
        blockedDates
    });

    const ITEMS_PER_PAGE = 4;
    const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);

    // ... visibleRooms slice logic remains ...
    const visibleRooms = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRooms.slice(start, start + ITEMS_PER_PAGE);
    }, [currentPage, filteredRooms]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to grid top with a faster, smoother duration (600ms) to avoid "fighting" feel
        // Offset 160px (Header ~80px + Sticky DateBar ~80px) to prevent hiding content
        scrollToElement("room-grid-start", 600, 160);
    };

    const handleApplyFilters = (newFilters: RoomFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    const sectionRef = useRef<HTMLElement>(null);
    const isWidgetVisible = useIntersectionObserver(sectionRef, {
        threshold: 0,
        // Strict "Center Focus": Match LocationSection to sync exit timing
        rootMargin: "-45% 0px -45% 0px"
    });

    return (
        <section ref={sectionRef} id="rooms" className="bg-white pb-0 relative min-h-screen">
            <h2 className="sr-only">Our Rooms</h2>
            <DateSelectorBar
                onPrev={() => handlePageChange(currentPage - 1)}
                onNext={() => handlePageChange(currentPage + 1)}
                canPrev={currentPage > 1}
                canNext={currentPage < totalPages}
                onFilterClick={() => setIsFilterOpen(true)}
                maxDoubleBeds={maxDoubleBeds}
                maxSingleBeds={maxSingleBeds}
            />

            <div id="room-grid-start" className="w-full relative min-h-[800px]">
                {/* Loading Overlay */}
                <div className={cn(
                    "absolute inset-0 bg-white/80 z-20 flex items-center justify-center transition-opacity duration-300",
                    isSearching ? "opacity-100" : "opacity-0 pointer-events-none"
                )}>
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-aegean-blue)] mb-4"></div>
                        <p className="text-[var(--color-aegean-blue)] font-montserrat tracking-widest text-sm animate-pulse">FINDING YOUR SANCTUARY...</p>
                    </div>
                </div>

                {visibleRooms.length === 0 && !isSearching ? (
                    <div className="text-center py-20">
                        <p className="font-montserrat text-lg text-[var(--color-charcoal)]">No rooms match your criteria.</p>
                        <button onClick={() => setFilters(DEFAULT_FILTERS)} className="text-[var(--color-aegean-blue)] underline mt-4">Reset Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white border-y border-white">
                        {visibleRooms.map((room, i) => (
                            <div key={room.id} className="animate-[fade-in_600ms_var(--ease-premium)_forwards]">
                                <RoomCard
                                    room={room}
                                    index={(currentPage - 1) * ITEMS_PER_PAGE + i}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <FilterWidget onOpen={() => setIsFilterOpen(true)} visible={isWidgetVisible} />
            <FilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                currentFilters={filters}
                onApply={handleApplyFilters}
                rooms={rooms}
            />
        </section>
    );
}
