"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface LightboxProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    currentIndex: number;
    onNext?: () => void;
    onPrev?: () => void;
}

export function Lightbox({ isOpen, onClose, images, currentIndex, onNext, onPrev }: LightboxProps) {
    const [mounted, setMounted] = useState(false);

    // Initial mount check for portal
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
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
            <div
                className="relative w-full h-full p-4 md:p-10 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
                    <Image
                        src={currentImage}
                        alt="Gallery Image"
                        fill
                        className="object-contain"
                        quality={100}
                        priority
                    />
                </div>
            </div>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 font-inter text-sm tracking-widest z-[101]">
                {currentIndex + 1} / {images.length}
            </div>
        </div>,
        document.body
    );
}
