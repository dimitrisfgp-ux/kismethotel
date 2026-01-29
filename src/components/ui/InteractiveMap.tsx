"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Convenience } from "@/types";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin } from "lucide-react";

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
            case 'Beach': return "#38bdf8";
            case 'Bus': return "var(--color-deep-med)";
            case 'Car Rental': return "#f97316";
            case 'Restaurant': return "#e11d48"; // Rose
            case 'Cafe': return "#b45309"; // Amber
            case 'Bar': return "#9333ea"; // Purple
            default: return "var(--color-charcoal)";
        }
    };

    const color = getColor(type);
    const size = isHotel ? 52 : 36;

    const iconMarkup = renderToStaticMarkup(
        <div className="relative flex items-center justify-center drop-shadow-xl w-full h-full">
            <MapPin
                size={size}
                fill={color}
                className="text-white" // Icon borders/stroke usually white for contrast if fill is colored
                strokeWidth={2}
                color="white" // Ensure stroke is white
            />
            {/* Inner Dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/4 w-2 h-2 bg-white rounded-full" />
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'bg-transparent',
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
    });
};

export default function InteractiveMap({ conveniences, center, highlightedTypes }: InteractiveMapProps) {
    // Hotel Location (Heraklion Center)
    const hotelPosition: [number, number] = [35.33965, 25.13285];

    return (
        <MapContainer
            center={hotelPosition}
            zoom={17}
            scrollWheelZoom={false}
            className="w-full h-full z-0"
            style={{ background: 'var(--color-sand)' }} // Fallback
        >
            {/* Brand Styled Tiles */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                className="map-tiles-brand"
            />

            <MapController center={center} />
            <BoundsController markers={conveniences} activeTypes={highlightedTypes} />

            {/* Hotel Marker (Always Visible) */}
            <Marker position={hotelPosition} icon={createCustomIcon("hotel", true)}>
                <Popup className="font-montserrat text-sm text-[var(--color-deep-med)]">
                    <strong>Kismet Hotel</strong><br />
                    Heart of Heraklion
                </Popup>
            </Marker>

            {/* Convenience Markers */}
            {conveniences.map(spot => {
                // Determine if dimmed. If no highlighting is active, nothing is dimmed.
                // If highlighting IS active, only dim if NOT in the list.
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

