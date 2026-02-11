"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { RoomPlaceholder } from "@/components/ui/RoomPlaceholder";
import { RoomMedia } from "@/types";

// Dynamic import for Lightbox - only loads when user clicks to open gallery
const Lightbox = dynamic(() => import("../ui/Lightbox").then(m => m.Lightbox), {
    ssr: false,
    loading: () => null
});

interface ImageGalleryProps {
    images: string[]; // Legacy (needed for backward compat if media is empty)
    media?: RoomMedia[];
    roomName: string;
}

export function ImageGallery({ images, media = [], roomName }: ImageGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    // --- Resolve Media Sources ---
    // If we have new media, use it. Otherwise fall back to legacy 'images' array.
    const hasNewMedia = media.length > 0;

    let galleryItems: { url: string; alt: string; mediaType: 'image' | 'video' }[] = [];

    let primaryItem: { url: string; alt: string; mediaType: 'image' | 'video' } | null = null;
    let secondaryImages: { url: string; alt: string; mediaType: 'image' | 'video' }[] = [];

    if (hasNewMedia) {
        // New System
        const heroVideo = media.find(m => m.category === 'hero_video');
        const primary = media.find(m => m.category === 'primary') || media.find(m => m.isPrimary) || media[0];
        const secondary = media.filter(m => m.category === 'secondary');
        const gallery = media.filter(m => m.category === 'gallery');

        // Main Item: Video takes precedence over Primary Image
        if (heroVideo) {
            primaryItem = { url: heroVideo.url, alt: heroVideo.altText || roomName, mediaType: 'video' };
        } else if (primary) {
            primaryItem = { url: primary.url, alt: primary.altText || roomName, mediaType: 'image' };
        }

        // Construct the full "Lightbox" list order: Primary -> Secondaries -> Gallery
        // (Or whatever order makes sense. Usually all images should be browseable).
        // Let's gather ALL valid images for the lightbox.
        const allMedia = [
            ...(primary ? [primary] : []),
            ...secondary,
            ...gallery,
            // Fallback: if we have 'hero_video' or others, maybe exclude them from image gallery?
            // The prompt mentions "Expanding Lightbox Gallery".
            // Let's include everything that is an image.
            ...media.filter(m => !['primary', 'secondary', 'gallery', 'hero_video', 'portrait'].includes(m.category) && m.mediaType === 'image')
        ];

        // Deduplicate by ID
        const uniqueMedia = Array.from(new Map(allMedia.map(item => [item.id, item])).values());

        galleryItems = uniqueMedia.map(m => ({ url: m.url, alt: m.altText || roomName, mediaType: m.mediaType as 'image' | 'video' }));

        secondaryImages = secondary.map(m => ({ url: m.url, alt: m.altText || roomName, mediaType: 'image' as const }));

        // If no secondary defined in new system, maybe grab from gallery?
        if (secondaryImages.length < 2 && gallery.length > 0) {
            const fillCount = 2 - secondaryImages.length;
            secondaryImages.push(...gallery.slice(0, fillCount).map(m => ({ url: m.url, alt: m.altText || roomName, mediaType: 'image' as const })));
        }

    } else {
        // Legacy System
        galleryItems = images.filter(Boolean).map(url => ({ url, alt: roomName, mediaType: 'image' as const }));

        if (galleryItems.length > 0) {
            primaryItem = galleryItems[0];
            secondaryImages = galleryItems.slice(1, 3);
        }
    }

    // Prepare arrays for Lightbox (only images for now, or filtered)
    const lightboxImages = galleryItems.filter(i => i.mediaType === 'image').map(i => i.url);

    const openLightbox = (index: number) => {
        setPhotoIndex(index);
        setIsOpen(true);
    };

    const nextSrc = () => {
        setPhotoIndex((prev) => (prev + 1) % lightboxImages.length);
    };

    const prevSrc = () => {
        setPhotoIndex((prev) => (prev + lightboxImages.length - 1) % lightboxImages.length);
    };

    // Predictive Preload: Fetch Lightbox code on hover
    const preloadLightbox = () => {
        import("../ui/Lightbox");
    };

    // Helper for rendering an interactive item (image or video)
    function GalleryItem({ item, index, onOpen, priority = false, className }: { item: { url: string, alt: string, mediaType: 'image' | 'video' }, index: number, onOpen: (i: number) => void, priority?: boolean, className?: string }) {
        if (!item || !item.url) return <div className={cn("w-full h-full bg-gray-200", className)}><RoomPlaceholder /></div>;

        if (item.mediaType === 'video') {
            return (
                <div className={cn("relative w-full h-full overflow-hidden bg-black", className)}>
                    <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                    <div className="absolute inset-0 bg-black/10" />
                </div>
            );
        }

        // Default to image
        return (
            <div
                className={cn("relative w-full h-full overflow-hidden cursor-pointer group", className)}
                onClick={() => onOpen(index)}
                onMouseEnter={preloadLightbox}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(index)}
            >
                <Image
                    src={item.url}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
        );
    }

    return (
        <>
            {(!primaryItem && lightboxImages.length === 0) ? (
                <div className="w-full h-[50vh] min-h-[400px] bg-gray-100 flex items-center justify-center">
                    <RoomPlaceholder />
                </div>
            ) : (
                <div className="relative w-full h-[75vh] min-h-[500px]">
                    {/* If only one item (primary), show full width */}
                    {lightboxImages.length <= 1 && !secondaryImages.length ? (
                        <GalleryItem
                            item={primaryItem || { url: lightboxImages[0], alt: roomName, mediaType: 'image' }}
                            index={0}
                            onOpen={openLightbox}
                            priority
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
                            {/* Main Image/Video */}
                            <GalleryItem
                                item={primaryItem || { url: lightboxImages[0], alt: roomName, mediaType: 'image' }}
                                index={0}
                                onOpen={openLightbox}
                                priority
                            />

                            {/* Secondary Grid */}
                            <div className="grid grid-rows-2 gap-2 h-full">
                                <GalleryItem
                                    item={secondaryImages[0]}
                                    index={1}
                                    onOpen={openLightbox}
                                />
                                <GalleryItem
                                    item={secondaryImages[1]}
                                    index={2}
                                    onOpen={openLightbox}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            <Lightbox
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                images={lightboxImages}
                currentIndex={photoIndex}
                onNext={nextSrc}
                onPrev={prevSrc}
            />
        </>
    );
}
