"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Lightbox } from "../ui/Lightbox";

interface ImageGalleryProps {
    images: string[];
    roomName: string;
}

export function ImageGallery({ images, roomName }: ImageGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    const openLightbox = (index: number) => {
        setPhotoIndex(index);
        setIsOpen(true);
    };

    const nextSrc = () => {
        setPhotoIndex((prev) => (prev + 1) % images.length);
    };

    const prevSrc = () => {
        setPhotoIndex((prev) => (prev + images.length - 1) % images.length);
    };

    // Helper for rendering an interactive image
    function GalleryImage({ src, alt, index, onOpen, priority = false, className }: { src: string, alt: string, index: number, onOpen: (i: number) => void, priority?: boolean, className?: string }) {
        return (
            <div
                className={cn("relative w-full h-full overflow-hidden cursor-pointer group", className)}
                onClick={() => onOpen(index)}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
                    priority={priority}
                />
                {/* Overlay hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
        );
    }

    return (
        <>
            {images.length === 1 ? (
                <div className="relative w-full h-[75vh] min-h-[500px]">
                    <GalleryImage src={images[0]} alt={roomName} index={0} onOpen={openLightbox} priority />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[75vh] min-h-[500px]">
                    {/* Main Image */}
                    <GalleryImage src={images[0]} alt={`${roomName} Main`} index={0} onOpen={openLightbox} priority />

                    {/* Secondary Grid */}
                    <div className="grid grid-rows-2 gap-2 h-full">
                        <GalleryImage src={images[1] || images[0]} alt={`${roomName} Detail 1`} index={1} onOpen={openLightbox} />
                        <GalleryImage src={images[2] || images[0]} alt={`${roomName} Detail 2`} index={2} onOpen={openLightbox} />
                    </div>
                </div>
            )}

            <Lightbox
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                images={images}
                currentIndex={photoIndex}
                onNext={nextSrc}
                onPrev={prevSrc}
            />
        </>
    );
}
