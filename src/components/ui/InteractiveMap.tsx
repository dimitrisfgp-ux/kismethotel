"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Convenience } from "@/types";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin, Home, Plus, Minus } from "lucide-react";

// Fix Leaflet's default icon path issues in Next.js
// We won't use default markers anyway, but good to have
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
            targetBounds.extend([35.33965, 25.13285]);

            // Check if target bounds are already fully visible with some padding
            const currentBounds = map.getBounds().pad(-0.1); // Shrink current bounds by 10% to ensure "comfortable" fit

            if (!currentBounds.contains(targetBounds)) {
                map.flyToBounds(targetBounds, {
                    padding: [50, 50],
                    maxZoom: 16,
                    duration: 1.5
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
        if (isHotel) return "var(--color-aegean-blue)";
        switch (t) {
            case 'Supermarket': return "var(--color-accent-gold)";
            case 'Pharmacy': return "var(--color-success)";
            case 'Beach': return "var(--color-map-beach)";
            case 'Bus': return "var(--color-deep-med)";
            case 'Car Rental': return "var(--color-map-rental)";
            case 'Restaurant':
            case 'Cafe':
            case 'Bar': return "var(--color-map-dining)"; // Rose (Dining Category)
            default: return "var(--color-charcoal)";
        }
    };

    const color = getColor(type);
    // User requested equalized size and "easily touchable"
    const size = 48;
    const IconComponent = isHotel ? Home : MapPin;

    const iconMarkup = renderToStaticMarkup(
        <div className="relative flex items-center justify-center drop-shadow-xl w-full h-full transition-transform hover:scale-110 duration-200">
            <IconComponent
                size={size}
                fill={color}
                className="text-white" // Icon borders/stroke usually white for contrast if fill is colored
                strokeWidth={2}
                color="white" // Ensure stroke is white
            />
            {/* Inner Dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'bg-transparent',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2], // Center anchor for equalized icon
        popupAnchor: [0, -size / 2],
    });
};

// Component to manage map interaction state
function MapInteractionController({ isInteractive }: { isInteractive: boolean }) {
    const map = useMap();
    useEffect(() => {
        if (isInteractive) {
            map.dragging.enable();
            map.touchZoom.enable();
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable();
        } else {
            map.dragging.disable();
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
        }
    }, [isInteractive, map]);
    return null;
}

// Custom Zoom Control Component
function CustomZoomControl() {
    const map = useMap();

    return (
        <div className="absolute bottom-6 right-6 z-[400] flex flex-col bg-white shadow-xl rounded-lg">
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

export default function InteractiveMap({ conveniences, center, highlightedTypes }: InteractiveMapProps) {
    // Hotel Location (Heraklion Center)
    const hotelPosition: [number, number] = [35.33965, 25.13285];

    // Interaction State
    const [isInteractive, setIsInteractive] = useState(false);

    // Enable interaction by default on desktop, disable on mobile
    useEffect(() => {
        if (window.innerWidth >= 768) {
            setIsInteractive(true);
        }
    }, []);

    return (
        <div className="relative w-full h-full group">
            <MapContainer
                center={hotelPosition}
                zoom={17}
                scrollWheelZoom={false} // Default false, controller manages it
                zoomControl={false}   // Disable default top-left controls
                dragging={false}      // Default false
                touchZoom={false}     // Default false
                doubleClickZoom={false}
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
                <MapInteractionController isInteractive={isInteractive} />
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

            {/* Interaction Overlay (Mobile Only) */}
            {!isInteractive && (
                <div
                    onClick={() => setIsInteractive(true)}
                    className="absolute inset-0 z-[400] bg-black/5 flex items-center justify-center cursor-pointer transition-opacity duration-300 md:hidden hover:bg-black/10"
                >
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-[var(--color-sand)]">
                        <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-[var(--color-deep-med)]">
                            Tap to Explore
                        </span>
                    </div>
                </div>
            )}
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
            opacity={isDimmed ? 0.3 : 1}
            zIndexOffset={isDimmed ? -100 : 100}
        >
            <Popup className="font-inter text-xs">
                <strong>{spot.name}</strong><br />
                {spot.distanceLabel}
            </Popup>
        </Marker>
    );
}

