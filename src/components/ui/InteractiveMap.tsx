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
        if (isHotel) return "var(--color-deep-med)"; // Deep Med Blue
        switch (t) {
            case 'Supermarket': return "var(--color-map-supermarket)";
            case 'Pharmacy': return "var(--color-map-pharmacy)";
            case 'Beach': return "var(--color-map-beach)";
            case 'Bus': return "var(--color-map-transport)";
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

    // Hotel specific styling (Custom SVG Pin)
    if (isHotel) {
        const width = 50;
        const height = 62; // Aspect ratio ~0.81

        const iconMarkup = renderToStaticMarkup(
            <div className="relative drop-shadow-2xl transition-transform duration-300 hover:scale-110 hover:-translate-y-2">
                <svg width={width} height={height} viewBox="0 0 179 221" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="path-1-outside-1_489_15154" maskUnits="userSpaceOnUse" x="0" y="0" width="179" height="221" fill="black">
                        <rect fill="white" width="179" height="221" />
                        <path d="M89.5 13C131.75 13 166 47.2502 166 89.5C166 120.667 147.361 147.48 120.622 159.403C119.838 159.753 119.174 160.332 118.739 161.074L92.9516 205.106C91.4066 207.744 87.5934 207.745 86.0483 205.106L60.2595 161.073C59.8253 160.332 59.1615 159.753 58.3767 159.403C31.6383 147.48 13.0002 120.667 13 89.5C13 47.2502 47.2502 13 89.5 13Z" />
                    </mask>
                    <path d="M89.5 13C131.75 13 166 47.2502 166 89.5C166 120.667 147.361 147.48 120.622 159.403C119.838 159.753 119.174 160.332 118.739 161.074L92.9516 205.106C91.4066 207.744 87.5934 207.745 86.0483 205.106L60.2595 161.073C59.8253 160.332 59.1615 159.753 58.3767 159.403C31.6383 147.48 13.0002 120.667 13 89.5C13 47.2502 47.2502 13 89.5 13Z" fill="#2C5F8D" />
                    <path d="M89.5 13V0V13ZM166 89.5L179 89.5001V89.5H166ZM13 89.5H0V89.5001L13 89.5ZM60.2595 161.073L49.0418 167.643L60.2595 161.073ZM58.3767 159.403L53.0824 171.276L58.3767 159.403ZM92.9516 205.106L81.7338 198.537L92.9516 205.106ZM86.0483 205.106L74.8306 211.676L86.0483 205.106ZM120.622 159.403L115.328 147.53V147.53L120.622 159.403ZM118.739 161.074L107.522 154.504L118.739 161.074ZM89.5 13V26C124.57 26 153 54.4299 153 89.5H166H179C179 40.0705 138.929 0 89.5 0V13ZM166 89.5L153 89.4999C153 115.35 137.551 137.621 115.328 147.53L120.622 159.403L125.917 171.276C157.171 157.34 179 125.984 179 89.5001L166 89.5ZM118.739 161.074L107.522 154.504L81.7338 198.537L92.9516 205.106L104.169 211.676L129.957 167.643L118.739 161.074ZM86.0483 205.106L97.266 198.537L71.4772 154.504L60.2595 161.073L49.0418 167.643L74.8306 211.676L86.0483 205.106ZM58.3767 159.403L63.671 147.53C41.4483 137.621 26.0001 115.35 26 89.4999L13 89.5L0 89.5001C0.000200272 125.983 21.8283 157.34 53.0824 171.276L58.3767 159.403ZM13 89.5H26C26 54.4299 54.4299 26 89.5 26V13V0C40.0705 0 0 40.0705 0 89.5H13ZM60.2595 161.073L71.4772 154.504C69.6103 151.316 66.824 148.936 63.671 147.53L58.3767 159.403L53.0824 171.276C51.4989 170.57 50.0403 169.348 49.0418 167.643L60.2595 161.073ZM92.9516 205.106L81.7338 198.537C85.21 192.601 93.7898 192.601 97.266 198.537L86.0483 205.106L74.8306 211.676C81.3969 222.888 97.6032 222.888 104.169 211.676L92.9516 205.106ZM120.622 159.403L115.328 147.53C112.175 148.936 109.389 151.316 107.522 154.504L118.739 161.074L129.957 167.643C128.959 169.348 127.5 170.57 125.917 171.276L120.622 159.403Z" fill="#C9A961" mask="url(#path-1-outside-1_489_15154)" />
                    <mask id="path-3-outside-2_489_15154" maskUnits="userSpaceOnUse" x="7" y="7" width="165" height="207" fill="black">
                        <rect fill="white" x="7" y="7" width="165" height="207" />
                        <path d="M89.5 13C131.75 13 166 47.2502 166 89.5C166 120.667 147.361 147.48 120.622 159.403C119.838 159.753 119.174 160.332 118.739 161.074L92.9516 205.106C91.4066 207.744 87.5934 207.745 86.0483 205.106L60.2595 161.073C59.8253 160.332 59.1615 159.753 58.3767 159.403C31.6383 147.48 13.0002 120.667 13 89.5C13 47.2502 47.2502 13 89.5 13Z" />
                    </mask>
                    <path d="M89.5 13C131.75 13 166 47.2502 166 89.5C166 120.667 147.361 147.48 120.622 159.403C119.838 159.753 119.174 160.332 118.739 161.074L92.9516 205.106C91.4066 207.744 87.5934 207.745 86.0483 205.106L60.2595 161.073C59.8253 160.332 59.1615 159.753 58.3767 159.403C31.6383 147.48 13.0002 120.667 13 89.5C13 47.2502 47.2502 13 89.5 13Z" fill="#2C5F8D" />
                    <path d="M89.5 13V7V13ZM166 89.5L172 89.5V89.5H166ZM13 89.5H7V89.5L13 89.5ZM60.2595 161.073L55.0821 164.106L60.2595 161.073ZM58.3767 159.403L55.9332 164.883L58.3767 159.403ZM92.9516 205.106L87.7741 202.074L92.9516 205.106ZM86.0483 205.106L80.8709 208.139L86.0483 205.106ZM120.622 159.403L118.179 153.923L120.622 159.403ZM118.739 161.074L113.562 158.041L118.739 161.074ZM89.5 13V19C128.436 19 160 50.5639 160 89.5H166H172C172 43.9365 135.063 7 89.5 7V13ZM166 89.5L160 89.5C160 118.213 142.834 142.93 118.179 153.923L120.622 159.403L123.066 164.883C151.889 152.031 172 123.121 172 89.5L166 89.5ZM118.739 161.074L113.562 158.041L87.7741 202.074L92.9516 205.106L98.129 208.139L123.917 164.106L118.739 161.074ZM86.0483 205.106L91.2257 202.074L65.4369 158.041L60.2595 161.073L55.0821 164.106L80.8709 208.139L86.0483 205.106ZM58.3767 159.403L60.8202 153.923C36.166 142.93 19.0002 118.213 19 89.5L13 89.5L7 89.5C7.00018 123.121 27.1106 152.031 55.9332 164.883L58.3767 159.403ZM13 89.5H19C19 50.5639 50.5639 19 89.5 19V13V7C43.9365 7 7 43.9365 7 89.5H13ZM60.2595 161.073L65.4369 158.041C64.3415 156.171 62.698 154.76 60.8202 153.923L58.3767 159.403L55.9332 164.883C55.6249 164.745 55.3091 164.493 55.0821 164.106L60.2595 161.073ZM92.9516 205.106L87.7741 202.074C88.5466 200.755 90.4532 200.755 91.2257 202.074L86.0483 205.106L80.8709 208.139C84.7335 214.734 94.2666 214.734 98.129 208.139L92.9516 205.106ZM120.622 159.403L118.179 153.923C116.301 154.76 114.658 156.171 113.562 158.041L118.739 161.074L123.917 164.106C123.69 164.493 123.374 164.745 123.066 164.883L120.622 159.403Z" fill="white" mask="url(#path-3-outside-2_489_15154)" />
                    <circle cx="89.5" cy="89.5" r="55.5" fill="#C9A961" />
                    <path d="M87.3311 55.0676C88.7235 53.9474 90.708 53.9475 92.1006 55.0676L116.359 74.5852C117.257 75.3074 117.779 76.398 117.779 77.55V112.763C117.779 114.864 116.076 116.567 113.975 116.568H65.458C63.3568 116.568 61.6534 114.864 61.6533 112.763V77.55C61.6533 76.398 62.1746 75.3074 63.0723 74.5852L87.3311 55.0676Z" stroke="#2C5F8D" strokeWidth="6.43876" />
                    <rect x="82.0273" y="91.0687" width="16.4104" height="24.6157" rx="1.17068" stroke="#2C5F8D" strokeWidth="6.43876" />
                </svg>
            </div>
        );

        return L.divIcon({
            html: iconMarkup,
            className: 'bg-transparent',
            iconSize: [width, height],
            iconAnchor: [width / 2, height], // Bottom tip anchor
            popupAnchor: [0, -height - 10],  // Popup above tip
        });
    }

    // Standard styling for other icons

    const iconMarkup = renderToStaticMarkup(
        <div
            className="flex items-center justify-center rounded-full shadow-2xl transform transition-transform duration-200 hover:scale-110 border-2 border-white"
            style={{
                backgroundColor: color,
                width: `${size}px`,
                height: `${size}px`,
            }}
        >
            <InnerIcon
                size={20}
                color="white"
                strokeWidth={2}
            />
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'bg-transparent',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2 - 5],
    });
};

// Restore CustomZoomControl
function CustomZoomControl() {
    const map = useMap();

    return (
        <div className="hidden md:flex absolute bottom-6 left-6 md:left-auto md:right-6 z-[400] flex-col bg-[var(--color-deep-med)] border border-[var(--color-accent-gold)] shadow-xl rounded-lg overflow-hidden">
            <button
                onClick={() => map.zoomIn()}
                className="p-2 text-white hover:bg-white/10 transition-colors duration-300 ease-premium focus:outline-none border-b border-[var(--color-accent-gold)]"
                aria-label="Zoom In"
            >
                <Plus className="w-5 h-5" />
            </button>
            <button
                onClick={() => map.zoomOut()}
                className="p-2 text-white hover:bg-white/10 transition-colors duration-300 ease-premium focus:outline-none"
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
            // Access L.Browser tap property with type assertion for Leaflet mobile
            const mapWithTap = map as L.Map & { tap?: { disable: () => void } };
            if (mapWithTap.tap) mapWithTap.tap.disable();
        } else {
            map.dragging.enable();
        }

        return () => {
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [map, hasLearned, showWarning]);

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
