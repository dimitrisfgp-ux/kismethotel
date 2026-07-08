"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

// Dynamically import the Map component to avoid SSR issues with Leaflet
const LocationPickerMap = dynamic(
    () => import("./LocationPickerMap").then((mod) => mod.LocationPicker),
    {
        ssr: false,
        // Height accounts for the address search bar (~40px + gap) above the map.
        loading: () => <Skeleton className="h-[348px] w-full rounded-md" />
    }
);

interface LocationPickerProps {
    value?: { lat: number; lng: number };
    onChange: (value: { lat: number; lng: number }) => void;
}

export function LocationPicker(props: LocationPickerProps) {
    return <LocationPickerMap {...props} />;
}
