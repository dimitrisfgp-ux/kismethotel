"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HOTEL_COORDINATES } from "@/lib/constants";
import { MapPin, Search, Loader2 } from "lucide-react";
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

// Sub-component to animate the map to a geocoded address (zooms in on the hit).
function FlyTo({ target }: { target: { lat: number; lng: number; nonce: number } | null }) {
    const map = useMap();
    useEffect(() => {
        if (target) map.flyTo([target.lat, target.lng], 16, { duration: 0.8 });
    }, [target, map]);
    return null;
}

// When the map lives inside a collapsing/animating container (e.g. an accordion),
// Leaflet computes its size before the container has expanded → grey tiles. Watch
// the container and recompute whenever it resizes (covers expand animations and
// nested collapses), plus a settle-time backstop.
function InvalidateOnMount() {
    const map = useMap();
    useEffect(() => {
        const container = map.getContainer();
        const ro = new ResizeObserver(() => map.invalidateSize());
        ro.observe(container);
        const t = setTimeout(() => map.invalidateSize(), 350);
        return () => {
            ro.disconnect();
            clearTimeout(t);
        };
    }, [map]);
    return null;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
    // Default center is Hotel, or the current value if provided
    const center: [number, number] = value ? [value.lat, value.lng] : HOTEL_COORDINATES;

    const [address, setAddress] = useState("");
    const [searching, setSearching] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number; nonce: number } | null>(null);

    async function geocode() {
        const q = address.trim();
        if (!q || searching) return;
        setSearching(true);
        setNotice(null);
        try {
            // Nominatim (OpenStreetMap) — free, keyless. Fine for occasional admin
            // use (their policy allows ~1 req/s). The browser sends a Referer that
            // identifies the app, as their usage policy requests.
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
                { headers: { Accept: "application/json" } }
            );
            const data: Array<{ lat: string; lon: string }> = await res.json();
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                onChange({ lat, lng });
                setFlyTarget({ lat, lng, nonce: flyTarget ? flyTarget.nonce + 1 : 1 });
            } else {
                setNotice("Address not found — try adding the city or country.");
            }
        } catch {
            setNotice("Address search failed. Check your connection and try again.");
        } finally {
            setSearching(false);
        }
    }

    return (
        <div className="space-y-2">
            {/* Address search */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onKeyDown={(e) => {
                            // Enter geocodes; guard against submitting a parent form.
                            if (e.key === "Enter") {
                                e.preventDefault();
                                geocode();
                            }
                        }}
                        placeholder="Search an address to drop the pin…"
                        className="w-full h-10 pl-9 pr-3 rounded-md border border-gray-300 text-sm focus:border-[var(--color-aegean-blue)] focus:outline-none"
                    />
                </div>
                <button
                    type="button"
                    onClick={geocode}
                    disabled={searching || !address.trim()}
                    className="h-10 px-4 rounded-md bg-[var(--color-aegean-blue)] text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                    {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Find
                </button>
            </div>
            {notice && <p className="text-xs text-red-500">{notice}</p>}

            <div className="h-[300px] w-full rounded-md overflow-hidden border border-[var(--color-sand)] relative z-0">
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
                    <FlyTo target={flyTarget} />
                    <InvalidateOnMount />

                    {/* Hotel Marker (Reference) */}
                    <Marker position={HOTEL_COORDINATES} icon={DefaultIcon} opacity={0.5} title="Kismet" />

                    {/* Selected Location Marker */}
                    {value && (
                        <Marker
                            position={[value.lat, value.lng]}
                            icon={createSelectedIcon()}
                        />
                    )}
                </MapContainer>

                <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 text-xs rounded border border-gray-200 z-[1000] font-mono text-gray-500 pointer-events-none">
                    {value ? `${value.lat.toFixed(6)}, ${value.lng.toFixed(6)}` : "Click map or search an address"}
                </div>
            </div>
        </div>
    );
}
