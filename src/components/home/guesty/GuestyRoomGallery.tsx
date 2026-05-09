"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
    extras?: string[];
    alt: string;
}

// Must match the keyframe duration in tailwind.config.ts (slide-fade-* — 0.5s).
const TRANSITION_MS = 500;

export function GuestyRoomGallery({ main, secondary, extras, alt }: GuestyRoomGalleryProps) {
    // Carousel + lightbox cycle through main + secondaries + extras.
    // Visible thumbnail strip stays at the 3 secondaries.
    const images = [main, ...secondary, ...(extras ?? [])];
    const showBullets = images.length <= 6;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [previousIndex, setPreviousIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState<"next" | "prev">("next");
    // Bumped on every navigation so React remounts the layered images and
    // re-fires the directional CSS animations (vital when cycling back to
    // a previously-shown index — the index alone wouldn't trigger a remount).
    const [transitionId, setTransitionId] = useState(0);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => () => {
        if (clearTimer.current) clearTimeout(clearTimer.current);
    }, []);

    const goTo = useCallback((target: number, dir?: "next" | "prev") => {
        if (target === currentIndex) return;
        if (clearTimer.current) clearTimeout(clearTimer.current);

        const resolvedDir = dir ?? (target > currentIndex ? "next" : "prev");
        setPreviousIndex(currentIndex);
        setDirection(resolvedDir);
        setCurrentIndex(target);
        setTransitionId((t) => t + 1);

        clearTimer.current = setTimeout(() => {
            setPreviousIndex(null);
        }, TRANSITION_MS);
    }, [currentIndex]);

    const next = useCallback(() => {
        goTo((currentIndex + 1) % images.length, "next");
    }, [currentIndex, images.length, goTo]);

    const prev = useCallback(() => {
        goTo((currentIndex - 1 + images.length) % images.length, "prev");
    }, [currentIndex, images.length, goTo]);

    const openLightboxAt = (i: number) => setLightboxIndex(i);
    const closeLightbox = () => setLightboxIndex(null);

    const lightboxNext = useCallback(() => {
        setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
    }, [images.length]);

    const lightboxPrev = useCallback(() => {
        setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    }, [images.length]);

    const incomingAnim = direction === "next" ? "animate-slide-fade-in-right" : "animate-slide-fade-in-left";
    const outgoingAnim = direction === "next" ? "animate-slide-fade-out-left" : "animate-slide-fade-out-right";

    return (
        // On desktop, cap total height at 80vh so main + thumbs fit in one screen.
        // On mobile, let aspect ratios drive sizing (the section stacks anyway).
        <div className="w-full flex flex-col gap-2 md:h-[80vh]">
            {/* Main image — taller aspect on mobile so the photo dominates the viewport;
                desktop ignores the aspect and fills the height-constrained parent. */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--color-sand)] rounded-xl shadow-xl md:aspect-auto md:flex-1 md:min-h-0">
                {/* Outgoing image — visual only, no clicks. Beneath the active button. */}
                {previousIndex !== null && (
                    <div
                        key={`leaving-${transitionId}`}
                        className="absolute inset-0 pointer-events-none"
                    >
                        <Image
                            src={images[previousIndex]}
                            alt=""
                            fill
                            className={cn("object-cover", outgoingAnim)}
                            sizes="(max-width: 768px) 100vw, 67vw"
                        />
                    </div>
                )}

                {/* Active image — clickable for lightbox. Plays the incoming animation. */}
                <button
                    key={`current-${transitionId}`}
                    type="button"
                    onClick={() => openLightboxAt(currentIndex)}
                    aria-label="Open fullscreen view"
                    className="absolute inset-0 cursor-zoom-in"
                >
                    <Image
                        src={images[currentIndex]}
                        alt={`${alt} — image ${currentIndex + 1}`}
                        fill
                        className={cn("object-cover", incomingAnim)}
                        sizes="(max-width: 768px) 100vw, 67vw"
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
                    aria-label="View fullscreen"
                    className="absolute bottom-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-sm transition-colors"
                >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">View Fullscreen</span>
                </button>

                {/* Bullets — only when count is small enough to read at a glance */}
                {showBullets && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => goTo(i)}
                                aria-label={`Go to image ${i + 1}`}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    i === currentIndex ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
                                )}
                            />
                        ))}
                    </div>
                )}

                {/* Index counter — used when there are too many images for bullets */}
                {!showBullets && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Secondary thumbnails (3 across, beneath main).
                Mobile: each cell uses 4/3 aspect.
                Desktop: clamped fixed-ish height so they don't crowd the main image. */}
            <div className="grid grid-cols-3 gap-2 shrink-0 md:h-[clamp(90px,18vh,180px)]">
                {secondary.map((src, i) => {
                    // images[0] is main, secondary[0] is images[1], etc.
                    const indexInGallery = i + 1;
                    return (
                        <button
                            key={src}
                            type="button"
                            onClick={() => openLightboxAt(indexInGallery)}
                            aria-label={`Open image ${indexInGallery + 1} fullscreen`}
                            className="relative aspect-[4/3] overflow-hidden bg-[var(--color-sand)] rounded-xl shadow-md cursor-zoom-in group md:aspect-auto md:h-full"
                        >
                            <Image
                                src={src}
                                alt={`${alt} — secondary ${i + 1}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 33vw, 22vw"
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
