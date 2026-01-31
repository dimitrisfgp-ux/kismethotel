"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Convenience } from "@/types";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin, Home, Plus, Minus, Waves, Utensils, Bus, Car, ShoppingBasket, Pill, Coffee, Wine } from "lucide-react";
import { HOTEL_COORDINATES } from "@/config/constants";

// Fix Leaflet's default icon path issues in Next.js
// (L.Icon.Default.prototype as any)._getIconUrl = null;

interface InteractiveMapProps {
    conveniences: Convenience[];
    center: [number, number];
    highlightedTypes: string[] | null;
}

// Component to update center when prop changes
function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

// Component to fit bounds to active markers
function BoundsController({ markers, activeTypes }: { markers: Convenience[], activeTypes: string[] | null }) {
    const map = useMap();

    useEffect(() => {
        if (!activeTypes || activeTypes.length === 0) {
            return;
        }

        const activeMarkers = markers.filter(m => activeTypes.includes(m.type));
        if (activeMarkers.length > 0) {
            const targetBounds = L.latLngBounds(activeMarkers.map(m => [m.lat, m.lng]));
            // Add hotel to bounds too so context is kept
            targetBounds.extend(HOTEL_COORDINATES);

            // Check if target bounds are already fully visible
            const currentBounds = map.getBounds().pad(-0.1);

            if (!currentBounds.contains(targetBounds)) {
                // User requirement: Zoom out to fit if locations are far
                map.flyToBounds(targetBounds, {
                    padding: [50, 50], // Add padding so markers aren't on the edge
                    duration: 1.5,
                    maxZoom: 17 // Don't zoom in closer than our default
                });
            } else {
                // If they fit but we are zoomed way out, maybe zoom in? 
                // For now, let's strictly respect the user's request to "zoom-out to fit if too far".
                // If we are already fitting them, we might not need to do anything, or we could recenter nicely.
                // Let's ensure we focus nicely even if they are visible but off-center
                map.flyToBounds(targetBounds, {
                    padding: [50, 50],
                    duration: 1.5,
                    maxZoom: 17
                });
            }
        }
    }, [activeTypes, markers, map]);

    return null;
}

// Custom Marker styling function
const createCustomIcon = (type: string, isHotel = false) => {
    // Determine color based on type
    const getColor = (t: string) => {
        if (isHotel) return "var(--color-deep-med)"; // Primary Brand Color
        switch (t) {
            case 'Supermarket': return "var(--color-accent-gold)";
            case 'Pharmacy': return "var(--color-success)";
            case 'Beach': return "var(--color-map-beach)";
            case 'Bus': return "var(--color-deep-med)"; // Bus can share this or be slightly lighter
            case 'Car Rental': return "var(--color-map-rental)";
            case 'Restaurant':
            case 'Cafe':
            case 'Bar': return "var(--color-map-dining)";
            default: return "var(--color-charcoal)";
        }
    };

    const getInnerIcon = (t: string) => {
        if (isHotel) return Home;
        switch (t) {
            case 'Supermarket': return ShoppingBasket;
            case 'Pharmacy': return Pill;
            case 'Beach': return Waves;
            case 'Bus': return Bus;
            case 'Car Rental': return Car;
            case 'Restaurant': return Utensils;
            case 'Cafe': return Coffee;
            case 'Bar': return Wine;
            default: return MapPin; // Fallback to generic pin icon
        }
    }

    const color = getColor(type);
    const size = isHotel ? 56 : 44; // Hotel is larger
    const InnerIcon = getInnerIcon(type);

    // Hotel specific styling props
    const borderStyle = isHotel ? "border-4 border-white ring-2 ring-[var(--color-accent-gold)]" : "border-2 border-white";
    const iconColor = isHotel ? "var(--color-accent-gold)" : "white";

    const iconMarkup = renderToStaticMarkup(
        <div
            className={`flex items-center justify-center rounded-full shadow-2xl transform transition-transform duration-200 hover:scale-110 ${borderStyle}`}
            style={{
                backgroundColor: color,
                width: `${size}px`,
                height: `${size}px`,
            }}
        >
            <InnerIcon
                size={isHotel ? 28 : 20}
                color={iconColor}
                strokeWidth={isHotel ? 2.5 : 2}
            />
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'bg-transparent',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2], // Centered anchor for circle
        popupAnchor: [0, -size / 2 - 5], // Popup slightly above
    });
};

// Restore CustomZoomControl
function CustomZoomControl() {
    const map = useMap();

    return (
        <div className="absolute bottom-6 left-6 md:left-auto md:right-6 z-[400] flex flex-col bg-white shadow-xl rounded-lg">
            <button
                onClick={() => map.zoomIn()}
                className="p-2 text-[var(--color-aegean-blue)] hover:bg-[var(--color-sand)] rounded-t-lg transition-colors duration-300 ease-premium focus:outline-none border-b border-[var(--color-sand)]/30"
                aria-label="Zoom In"
            >
                <Plus className="w-5 h-5" />
            </button>
            <button
                onClick={() => map.zoomOut()}
                className="p-2 text-[var(--color-aegean-blue)] hover:bg-[var(--color-sand)] rounded-b-lg transition-colors duration-300 ease-premium focus:outline-none"
                aria-label="Zoom Out"
            >
                <Minus className="w-5 h-5" />
            </button>
        </div>
    );
}

// Component to handle Two-Finger Pan Logic (Cooperative Gesture)
function GestureController() {
    const map = useMap();
    const [showWarning, setShowWarning] = useState(false);
    const [hasLearned, setHasLearned] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Check session storage on mount
        const learned = sessionStorage.getItem("hasLearnedMapGesture") === "true";
        setHasLearned(learned);

        const container = map.getContainer();

        // 1. Ensure page can scroll vertically when touching map (1 finger)
        container.style.touchAction = "pan-y";

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 1) {
                map.dragging.enable();
                setShowWarning(false);

                // User has "used the functionality correctly" -> Mark as learned
                if (!hasLearned) {
                    sessionStorage.setItem("hasLearnedMapGesture", "true");
                    setHasLearned(true);
                }
            } else {
                map.dragging.disable();
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                // User is trying to pan with 1 finger -> Warn them ONLY if not learned
                if (!showWarning && !hasLearned && sessionStorage.getItem("hasLearnedMapGesture") !== "true") {
                    setShowWarning(true);

                    // Auto-hide after 2s
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    timeoutRef.current = setTimeout(() => setShowWarning(false), 2000);
                }
            } else if (e.touches.length > 1) {
                setShowWarning(false);
            }
        };

        const handleTouchEnd = () => {
            map.dragging.disable();
            // Don't hide warning immediately so user sees it, let timeout handle it
        };

        // Add non-capturing listeners to allow scrolling
        container.addEventListener("touchstart", handleTouchStart, { passive: true });
        container.addEventListener("touchmove", handleTouchMove, { passive: true });
        container.addEventListener("touchend", handleTouchEnd, { passive: true });

        // Initial State: Disable drag ONLY on mobile devices to allow scroll
        if (L.Browser.mobile) {
            map.dragging.disable();
            if ((map as any).tap) (map as any).tap.disable();
        } else {
            map.dragging.enable();
        }

        return () => {
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [map, hasLearned]);

    if (!showWarning) return null;

    return (
        <div className="absolute inset-0 z-[500] pointer-events-none flex items-center justify-center bg-black/20 backdrop-blur-[1px] transition-opacity duration-300">
            <style jsx>{`
                @keyframes swipe-up {
                    0% { transform: translateY(20px); opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translateY(-30px); opacity: 0; }
                }
            `}</style>
            <div style={{ animation: 'swipe-up 1.5s ease-in-out infinite' }}>
                <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-2xl opacity-90"
                >
                    <g stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {/* User Uploaded Icon Paths */}
                        <path d="M12,12.94V7.28A1.84,1.84,0,0,0,11.44,6a1.8,1.8,0,0,0-1.5-.55,2,2,0,0,0-1.72,2v8.4l-1.3-1.31a2,2,0,0,0-1.42-.58,2,2,0,0,0-1.41,3.42l5.08,5.08" />
                        <path d="M12,12.94V6.44a2,2,0,0,1,1.42-1.93,1.89,1.89,0,0,1,2.36,1.82v6.21l3.09.26a1.79,1.79,0,0,1,1.63,1.78h0a17.16,17.16,0,0,1-1.8,7.64l-.09.17" />
                        <path d="M8.22,11.6a4.19,4.19,0,0,1-1.45-1,4.72,4.72,0,0,1,4.18-8,4.73,4.73,0,0,1,6.28,7.05,4.48,4.48,0,0,1-1.45,1" />
                    </g>
                </svg>
            </div>
        </div>
    );
}

export default function InteractiveMap({ conveniences, center, highlightedTypes }: InteractiveMapProps) {
    // Hotel Location (Heraklion Center)
    const hotelPosition = HOTEL_COORDINATES;

    return (
        <div className="relative w-full h-full group">
            <MapContainer
                center={hotelPosition}
                zoom={17}
                scrollWheelZoom={false} // Default false, controller manages it
                zoomControl={false}   // Disable default top-left controls
                dragging={true}       // Default true, GestureController disables it for Touch devices
                touchZoom={true}      // Allow touch zoom (2 fingers)
                doubleClickZoom={false}
                maxBounds={[
                    [35.3000, 25.0800], // Southwest (Inland)
                    [35.3600, 25.1900]  // Northeast (Sea/Amnissos)
                ]}
                maxBoundsViscosity={1.0} // Sticky bounds (hard stop)
                minZoom={13} // Prevent zooming out to see the whole world
                className="w-full h-full z-0"
                style={{ background: 'var(--color-sand)' }}
            >
                {/* Brand Styled Tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    className="map-tiles-brand"
                />

                <MapController center={center} />
                <BoundsController markers={conveniences} activeTypes={highlightedTypes} />
                <GestureController />
                <CustomZoomControl />

                {/* Hotel Marker (Always Visible) */}
                <Marker position={hotelPosition} icon={createCustomIcon("hotel", true)}>
                    <Popup className="font-montserrat text-sm text-[var(--color-deep-med)]">
                        <strong>Kismet Hotel</strong><br />
                        Heart of Heraklion
                    </Popup>
                </Marker>

                {/* Convenience Markers */}
                {conveniences.map(spot => {
                    const isDimmed = highlightedTypes !== null && highlightedTypes.length > 0 && !highlightedTypes.includes(spot.type);
                    return (
                        <ConvenienceMarker
                            key={spot.id}
                            spot={spot}
                            isDimmed={isDimmed}
                        />
                    );
                })}
            </MapContainer>
        </div>
    );
}

// Memoized Marker Component to prevent re-creation of Icon object on every render
// This fixes the "wobble" during map animations
function ConvenienceMarker({ spot, isDimmed }: { spot: Convenience, isDimmed: boolean }) {
    // Memoize the icon instance so it's referentially stable
    // only re-create if type changes (rare/never for same marker)
    // We intentionally ignore isDimmed here because opacity is handled by Marker prop, not Icon
    const icon = useState(() => createCustomIcon(spot.type))[0];

    return (
        <Marker
            position={[spot.lat, spot.lng]}
            icon={icon}
            opacity={isDimmed ? 0.15 : 1}
            zIndexOffset={isDimmed ? -100 : 100}
        >
            <Popup className="font-inter text-xs">
                <strong>{spot.name}</strong><br />
                {spot.distanceLabel}
            </Popup>
        </Marker>
    );
}
