"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HOTEL_COORDINATES } from "@/config/constants";
import { MapPin } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

// Fix for default marker icon in Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icon for the selected location (Orange/Red to stand out)
const createSelectedIcon = () => {
    const iconHtml = renderToStaticMarkup(
        <div className="relative flex items-center justify-center transform -translate-y-full">
            <MapPin className="w-8 h-8 text-orange-500 fill-orange-500 drop-shadow-md" />
            <div className="absolute -bottom-1 w-2 h-1 bg-black/30 blur-[2px] rounded-full" />
        </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: "custom-map-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
};

interface LocationPickerProps {
    value?: { lat: number; lng: number };
    onChange: (value: { lat: number; lng: number }) => void;
}

// Sub-component to handle map clicks
function ClickHandler({ onChange }: { onChange: (latlng: { lat: number, lng: number }) => void }) {
    useMapEvents({
        click(e) {
            onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });
    return null;
}

// Sub-component to center map on value change (initial load)
function MapCenterer({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
    // Default center is Hotel, or the current value if provided
    const center: [number, number] = value ? [value.lat, value.lng] : HOTEL_COORDINATES;

    return (
        <div className="h-[300px] w-full rounded-md overflow-hidden border border-[var(--color-sand)] relative z-0">
            {/* Note: process.browser check or dynamic import might be needed if SSR fails, 
                 but 'use client' usually handles it in App Router with Leaflet. 
                 If build fails, we wrap in dynamic import. */}
            <MapContainer
                center={center}
                zoom={15}
                scrollWheelZoom={true} // Allow zooming to find precise spot
                className="h-full w-full"
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <ClickHandler onChange={onChange} />

                {value && <MapCenterer center={[value.lat, value.lng]} />}

                {/* Hotel Marker (Reference) */}
                <Marker position={HOTEL_COORDINATES} icon={DefaultIcon} opacity={0.5} title="Kismet Hotel" />

                {/* Selected Location Marker */}
                {value && (
                    <Marker
                        position={[value.lat, value.lng]}
                        icon={createSelectedIcon()}
                    />
                )}
            </MapContainer>

            <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 text-xs rounded border border-gray-200 z-[1000] font-mono text-gray-500 pointer-events-none">
                {value ? `${value.lat.toFixed(6)}, ${value.lng.toFixed(6)}` : "Click map to select"}
            </div>
        </div>
    );
}
