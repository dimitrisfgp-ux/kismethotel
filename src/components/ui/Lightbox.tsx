"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LightboxProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    currentIndex: number;
    onNext?: () => void;
    onPrev?: () => void;
}

// Detect YouTube URLs (watch, share, embed). Returns the video ID
// or null if the URL isn't recognisable as YouTube.
function getYouTubeId(url: string): string | null {
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]+)/);
    return m ? m[1] : null;
}

// iOS / iPadOS detection. These platforms block autoplay-with-sound
// universally (Apple policy); muted autoplay is allowed. Everywhere
// else (Windows / Android / desktop Mac) gets autoplay with sound.
// The second clause catches iPadOS 13+ which now reports as MacIntel.
function isAppleMobile(): boolean {
    if (typeof navigator === "undefined") return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export function Lightbox({ isOpen, onClose, images, currentIndex, onNext, onPrev }: LightboxProps) {
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Reset loading state when index changes (new image)
    useEffect(() => {
        setIsLoading(true);
    }, [currentIndex]);

    // Initial mount check for portal
    useEffect(() => {
        setMounted(true);

    }, []);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft" && onPrev) onPrev();
        if (e.key === "ArrowRight" && onNext) onNext();
    }, [isOpen, onClose, onPrev, onNext]);

    useEffect(() => {
        if (!isOpen) return;
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, handleKeyDown]);

    // Prevent scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const currentImage = images[currentIndex];
    const currentYouTubeId = getYouTubeId(currentImage);

    // Navigation handlers to stop propagation
    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onPrev) onPrev();
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onNext) onNext();
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-[101] p-2 text-white/70 hover:text-white transition-colors"
            >
                <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 z-[101] p-2 text-white/50 hover:text-white transition-colors hover:bg-white/10 rounded-full"
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 z-[101] p-2 text-white/50 hover:text-white transition-colors hover:bg-white/10 rounded-full"
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>
                </>
            )}

            {/* Image Container */}
            {/* Image Container */}
            <div
                className="relative w-full h-full p-4 md:p-10 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center">
                    {currentYouTubeId ? (
                        // YouTube embed — autoplay with sound on most devices,
                        // muted on iOS/iPadOS where sound-autoplay is blocked.
                        <div className="relative w-full aspect-video max-h-full">
                            <iframe
                                key={currentYouTubeId}
                                src={`https://www.youtube.com/embed/${currentYouTubeId}?autoplay=1${isAppleMobile() ? "&mute=1" : ""}&rel=0&modestbranding=1`}
                                title="Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                            />
                        </div>
                    ) : (
                        <>
                            <div className={cn("relative w-full h-full transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}>
                                <Image
                                    src={currentImage}
                                    alt={`Gallery Image ${currentIndex + 1}`}
                                    fill
                                    className="object-contain" // object-contain ensures full image is seen.
                                    quality={90}
                                    priority
                                    onLoad={() => setIsLoading(false)}
                                    onLoadStart={() => setIsLoading(true)}
                                />
                            </div>

                            {/* Loading Spinner (Centered behind image or on top) */}
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center z-[-1]">
                                    <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Preload Next/Prev Images (Hidden) — skip YouTube URLs which would error in next/image */}
            <div className="hidden">
                {(() => {
                    const nextIndex = (currentIndex + 1) % images.length;
                    const prevIndex = (currentIndex - 1 + images.length) % images.length;
                    const nextSrc = images[nextIndex];
                    const prevSrc = images[prevIndex];
                    return (
                        <>
                            {!getYouTubeId(nextSrc) && <Image src={nextSrc} alt="" width={1} height={1} priority />}
                            {!getYouTubeId(prevSrc) && <Image src={prevSrc} alt="" width={1} height={1} priority />}
                        </>
                    );
                })()}
            </div>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 font-inter text-sm tracking-widest z-[101]">
                {currentIndex + 1} / {images.length}
            </div>
        </div>,
        document.body
    );
}
