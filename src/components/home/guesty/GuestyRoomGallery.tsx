"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Lightbox = dynamic(() => import("@/components/ui/Lightbox").then(m => m.Lightbox), {
    ssr: false,
    loading: () => null
});

interface GuestyRoomGalleryProps {
    main: string;
    secondary: [string, string, string];
    alt: string;
}

export function GuestyRoomGallery({ main, secondary, alt }: GuestyRoomGalleryProps) {
    const images = [main, ...secondary];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const next = useCallback(() => {
        setCurrentIndex((i) => (i + 1) % images.length);
    }, [images.length]);

    const prev = useCallback(() => {
        setCurrentIndex((i) => (i - 1 + images.length) % images.length);
    }, [images.length]);

    const openLightboxAt = (i: number) => setLightboxIndex(i);
    const closeLightbox = () => setLightboxIndex(null);

    const lightboxNext = useCallback(() => {
        setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
    }, [images.length]);

    const lightboxPrev = useCallback(() => {
        setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    }, [images.length]);

    return (
        <div className="w-full">
            {/* Main image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-sand)]">
                <button
                    type="button"
                    onClick={() => openLightboxAt(currentIndex)}
                    aria-label="Open fullscreen view"
                    className="absolute inset-0 cursor-zoom-in"
                >
                    <Image
                        src={images[currentIndex]}
                        alt={`${alt} — image ${currentIndex + 1}`}
                        fill
                        className="object-cover transition-opacity duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={currentIndex === 0}
                    />
                </button>

                {/* Carousel arrows */}
                <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-md text-[var(--color-charcoal)] transition-all"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    onClick={next}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-md text-[var(--color-charcoal)] transition-all"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>

                {/* "View Fullscreen" indicator (bottom-right) */}
                <button
                    type="button"
                    onClick={() => openLightboxAt(currentIndex)}
                    className="absolute bottom-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-sm transition-colors"
                >
                    <Maximize2 className="h-3.5 w-3.5" />
                    View Fullscreen
                </button>

                {/* Bullets */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setCurrentIndex(i)}
                            aria-label={`Go to image ${i + 1}`}
                            className={cn(
                                "h-2 rounded-full transition-all duration-300",
                                i === currentIndex ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Secondary thumbnails (3 across, beneath main) */}
            <div className="grid grid-cols-3 gap-2 mt-2">
                {secondary.map((src, i) => {
                    // images[0] is main, secondary[0] is images[1], etc.
                    const indexInGallery = i + 1;
                    return (
                        <button
                            key={src}
                            type="button"
                            onClick={() => openLightboxAt(indexInGallery)}
                            aria-label={`Open image ${indexInGallery + 1} fullscreen`}
                            className="relative aspect-[4/3] overflow-hidden bg-[var(--color-sand)] cursor-zoom-in group"
                        >
                            <Image
                                src={src}
                                alt={`${alt} — secondary ${i + 1}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 33vw, 16vw"
                            />
                        </button>
                    );
                })}
            </div>

            <Lightbox
                isOpen={lightboxIndex !== null}
                onClose={closeLightbox}
                images={images}
                currentIndex={lightboxIndex ?? 0}
                onNext={lightboxNext}
                onPrev={lightboxPrev}
            />
        </div>
    );
}
