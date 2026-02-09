"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Convenience, LocationCategory } from "@/types";
import { useEffect, useCallback, useState } from "react";
import { iconMap } from "@/components/ui/icons/iconMap";
import { renderToString } from "react-dom/server";
import { MapPin } from "lucide-react";
import { HOTEL_LOCATION_ID, HOTEL_COORDINATES, DEFAULT_HOTEL_COLOR, DEFAULT_CATEGORY_COLOR } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Component to handle map center updates
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

interface InteractiveMapProps {
    conveniences: Convenience[];
    categories: LocationCategory[];
    activeCategoryId: string | null;
}

// Mobile Gesture Handler Component
function MobileGestureHandler() {
    const map = useMap();
    const [showGestureHint, setShowGestureHint] = useState(false);

    useEffect(() => {
        // Only run on mobile
        if (!L.Browser.mobile) return;

        // Disable dragging initially on mobile to allow page scroll
        map.dragging.disable();
        (map as any).tap?.disable();

        const container = map.getContainer();

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 1) {
                map.dragging.enable();
                setShowGestureHint(false);
                // Mark as "got it right" in session storage
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('hasUsedTwoFingers', 'true');
                }
            } else {
                map.dragging.disable();
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                // Check if user has already "got it right" this session
                const hasLearned = typeof window !== 'undefined' && sessionStorage.getItem('hasUsedTwoFingers') === 'true';

                if (!hasLearned) {
                    setShowGestureHint(true);
                    // Hide hint after a delay
                    setTimeout(() => setShowGestureHint(false), 2000);
                }
            }
        };

        const handleTouchEnd = () => {
            // Re-disable dragging on touch end to reset state for next interaction
            // map.dragging.disable(); // Optional: keeps it strictly "two fingers only" for every discrete interaction
        };

        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: true });
        container.addEventListener('touchend', handleTouchEnd);

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [map]);

    return (
        <div className={cn(
            "absolute inset-0 z-[1000] pointer-events-none flex items-center justify-center bg-black/40 transition-opacity duration-300",
            showGestureHint ? "opacity-100" : "opacity-0"
        )}>
            <div className="text-white font-bold text-center flex flex-col items-center justify-center">
                <div className="mb-2 animate-bounce flex items-center justify-center">
                    <img
                        src="/images/double-finger-svgrepo-com.svg"
                        alt="Use two fingers"
                        className="w-16 h-16 invert"
                    />
                </div>
                <p>Use two fingers to move the map</p>
            </div>
        </div>
    );
}

export default function InteractiveMap({ conveniences, categories, activeCategoryId }: InteractiveMapProps) {

    useEffect(() => {
        // Fix Leaflet Default Icon Issue within Effect to avoid SSR/Hydration mismatch
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
    }, []);

    // Determine Center Logic
    // If category active & has locations -> center on first matching location
    // Else -> Hotel Center
    const activeLocations = activeCategoryId
        ? conveniences.filter((c: Convenience) => c.categoryId === activeCategoryId)
        : [];

    const activeCenter: [number, number] = (activeCategoryId && activeLocations.length > 0)
        ? [activeLocations[0].lat, activeLocations[0].lng]
        : HOTEL_COORDINATES;

    const activeZoom = activeCategoryId ? 15 : 14;

    // --- Dynamic Icon Creator ---
    const createCustomIcon = useCallback((location: Convenience, isDimmed: boolean) => {
        const isHotelLocation = location.id === HOTEL_LOCATION_ID;

        if (isHotelLocation) {
            return L.icon({
                iconUrl: "/images/PIN.svg",
                iconSize: [52, 65], // Slightly smaller
                iconAnchor: [26, 65], // Bottom center
                popupAnchor: [0, -65],
                className: isDimmed ? "opacity-50" : "" // Handle dimming via class if needed
            });
        }

        let color = DEFAULT_CATEGORY_COLOR;
        let IconComponent = MapPin;

        if (location.categoryId) {
            const category = categories.find((c: LocationCategory) => c.id === location.categoryId);
            if (category) {
                color = category.color;
                IconComponent = iconMap[category.icon] || MapPin;
            }
        }

        // Render the Icon Component to an HTML string
        const iconHtml = renderToString(<IconComponent className="w-4 h-4 text-white" />);

        return L.divIcon({
            className: "custom-map-marker",
            html: `
                <div style="
                    background-color: ${color};
                    width: 32px;
                    height: 32px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 2px solid white;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: ${isDimmed ? 0.4 : 1};
                    transition: opacity 0.3s ease;
                ">
                    <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
                        ${iconHtml}
                    </div>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32], // Tip at bottom
            popupAnchor: [0, -32],
        });
    }, [categories]);

    // Add Hotel Location
    const allLocations = [
        { id: HOTEL_LOCATION_ID, name: "Kismet Hotel", lat: HOTEL_COORDINATES[0], lng: HOTEL_COORDINATES[1], categoryId: "hotel", type: "Hotel" } as unknown as Convenience,
        ...conveniences
    ];

    return (
        <MapContainer
            center={HOTEL_COORDINATES}
            zoom={14}
            scrollWheelZoom={false}
            zoomControl={false} // Disable default zoom control
            className="w-full h-full z-10 relative" // Added relative for overlay positioning
            style={{ height: '100%', width: '100%' }} // Explicit style often needed for v5
        >
            {/* Restored CartoDB Voyager Tiles */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <MapUpdater center={activeCenter} zoom={activeZoom} />
            <MobileGestureHandler />
            <ZoomControl position="bottomright" />

            {allLocations.map((location) => {
                const isHotel = location.id === HOTEL_LOCATION_ID;
                // isDimmed if: a category is active AND this location is NOT in it AND it's NOT the hotel
                const isDimmed = activeCategoryId !== null && location.categoryId !== activeCategoryId && !isHotel;

                return (
                    <Marker
                        key={location.id}
                        position={[location.lat, location.lng]}
                        icon={createCustomIcon(location, isDimmed)}
                        zIndexOffset={isDimmed ? -100 : 100}
                        opacity={isDimmed ? 0.5 : 1}
                    >
                        <Popup className="font-inter">
                            <div className="p-1 min-w-[150px]">
                                <h3 className="font-bold text-[var(--color-charcoal)] text-sm mb-1">{location.name}</h3>
                                {location.distanceLabel && (
                                    <p className="text-xs text-gray-500">{location.distanceLabel}</p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
