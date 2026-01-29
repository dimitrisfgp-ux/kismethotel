"use client";

import { cn } from "@/lib/utils";

import { useState, useMemo, useEffect } from "react";
import { Room, RoomFilters } from "@/types";
import { RoomCard } from "../rooms/RoomCard";
import { DateSelectorBar } from "./DateSelectorBar";
import { FilterWidget } from "./FilterWidget";
import { FilterPanel } from "./FilterPanel";
import { filterRooms } from "@/lib/filterHelpers";

interface RoomsGridProps {
    rooms: Room[];
}

import { useDateContext } from "@/contexts/DateContext";

// ... inside component
export function RoomsGrid({ rooms }: RoomsGridProps) {
    const { dateRange, guestCount } = useDateContext(); // Consume context
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false); // For loading effect

    // Sync context guestCount with local filters or just use it in calculation
    const [filters, setFilters] = useState<RoomFilters>({
        priceRange: [0, 1000],
        minOccupancy: 1,
        sizeCategories: [],
        floors: [],
        minBedrooms: 0,
        bedTypes: [],
        amenityIds: []
    });

    // Simulate search loading when dates change
    useEffect(() => {
        if (dateRange) {
            setIsSearching(true);
            const timer = setTimeout(() => setIsSearching(false), 600);
            return () => clearTimeout(timer);
        }
    }, [dateRange, guestCount]);

    const filteredRooms = useMemo(() => {
        // Override local minOccupancy with context guestCount
        const activeFilters = { ...filters, minOccupancy: guestCount };

        let results = filterRooms(rooms, activeFilters);

        // Mock Availability Check (filter out room '2' if date range spans more than 3 days, just to show effect)
        if (dateRange && dateRange.from && dateRange.to) {
            const duration = dateRange.to.getTime() - dateRange.from.getTime();
            const days = duration / (1000 * 3600 * 24);
            // Example: 'Knossos' (id:2) is unavailable for stays > 3 days
            if (days > 3) {
                results = results.filter(r => r.id !== "2");
            }
        }

        return results;
    }, [rooms, filters, guestCount, dateRange]);

    const ITEMS_PER_PAGE = 4;
    const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);

    // ... visibleRooms slice logic remains ...
    const visibleRooms = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRooms.slice(start, start + ITEMS_PER_PAGE);
    }, [currentPage, filteredRooms]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        document.getElementById("room-grid-start")?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleApplyFilters = (newFilters: RoomFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    const [isWidgetVisible, setIsWidgetVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsWidgetVisible(entry.isIntersecting);
            },
            {
                threshold: 0,
                // Strict "Center Focus": Only active when intersecting the middle 10% of screen.
                // Ensures widget fades out immediately when section is not the primary focus.
                rootMargin: "-45% 0px -45% 0px"
            }
        );

        const section = document.getElementById("rooms");
        if (section) {
            observer.observe(section);
        }

        return () => {
            if (section) {
                observer.unobserve(section);
            }
        };
    }, []);

    return (
        <section id="rooms" className="bg-white pb-0 relative min-h-screen">
            <DateSelectorBar
                onPrev={() => handlePageChange(currentPage - 1)}
                onNext={() => handlePageChange(currentPage + 1)}
                canPrev={currentPage > 1}
                canNext={currentPage < totalPages}
                onFilterClick={() => setIsFilterOpen(true)}
            />

            <div id="room-grid-start" className="w-full relative min-h-[400px]">
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
                        <button onClick={() => setFilters({ ...filters, priceRange: [0, 1000] })} className="text-[var(--color-aegean-blue)] underline mt-4">Reset Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white border-y border-white transition-opacity duration-500 ease-in-out">
                        {visibleRooms.map((room, i) => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                index={(currentPage - 1) * ITEMS_PER_PAGE + i}
                            />
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
            />
        </section>
    );
}
