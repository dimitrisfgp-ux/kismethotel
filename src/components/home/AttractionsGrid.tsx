"use client";

import { useState, useCallback } from "react";
import { Attraction } from "@/types";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Container } from "../ui/Container";

// Lazy-loaded — only fetched when a user clicks an attraction.
const Lightbox = dynamic(() => import("../ui/Lightbox").then(m => m.Lightbox), {
    ssr: false,
    loading: () => null
});

interface AttractionsGridProps {
    attractions: Attraction[];
}

export function AttractionsGrid({ attractions }: AttractionsGridProps) {
    const [activeId, setActiveId] = useState<number | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const active = activeId !== null ? attractions.find(a => a.id === activeId) : null;
    const galleryImages = active?.gallery && active.gallery.length > 0
        ? active.gallery
        : active
            ? [active.image]
            : [];

    const openLightbox = (a: Attraction) => {
        // Only open if there's something worth showing fullscreen.
        if (!a.gallery || a.gallery.length === 0) return;
        setActiveId(a.id);
        setLightboxIndex(0);
    };

    const closeLightbox = () => setActiveId(null);

    const next = useCallback(() => {
        setLightboxIndex(i => (i + 1) % galleryImages.length);
    }, [galleryImages.length]);

    const prev = useCallback(() => {
        setLightboxIndex(i => (i - 1 + galleryImages.length) % galleryImages.length);
    }, [galleryImages.length]);

    return (
        <section className="py-24 bg-white">
            <Container>
                <SectionHeading title="Explore Crete" subtitle="Discover the ancient history and natural beauty surrounding Kismet." />
            </Container>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white border-y border-white auto-rows-[400px] w-full">
                {attractions.map((attraction, i) => {
                    const wide = i % 4 === 0 || i % 4 === 3;
                    const hasGallery = !!attraction.gallery && attraction.gallery.length > 0;

                    const cellClass = `relative group overflow-hidden text-left ${wide ? 'md:col-span-2' : ''} ${hasGallery ? 'cursor-zoom-in' : ''}`;
                    const sizes = wide
                        ? "(max-width: 768px) 100vw, 66vw"
                        : "(max-width: 768px) 100vw, 33vw";

                    const cellInner = (
                        <>
                            <Image
                                src={attraction.image}
                                alt={attraction.name}
                                fill
                                className="object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
                                sizes={sizes}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40 group-hover:opacity-70 transition-all duration-300" />

                            <div className="absolute bottom-0 left-0 w-full p-8 text-[var(--color-warm-white)] pointer-events-none">
                                <div className="flex items-baseline justify-start gap-4 w-full mb-0 group-hover:mb-4 transition-all duration-500 ease-premium">
                                    <h3 className="font-montserrat text-xl font-bold uppercase tracking-widest text-[var(--color-warm-white)] leading-none mt-1">
                                        {attraction.name}
                                    </h3>
                                    <div className="shrink-0">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm whitespace-nowrap">
                                            {attraction.distance}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 transition-all duration-500 ease-premium">
                                    <div className="overflow-hidden">
                                        <p className="font-inter text-sm text-[var(--color-warm-white)]/90 leading-relaxed border-t border-white/20 pt-4">
                                            {attraction.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    );

                    // Card uses a layered structure so an optional external-link
                    // CTA can coexist with the (HTML-invalid-inside-button) lightbox
                    // click target. Click target is an invisible button at z-1;
                    // the external link sits at z-3 and stops propagation.
                    return (
                        <div key={attraction.id} className={cellClass}>
                            {cellInner}
                            {hasGallery && (
                                <button
                                    type="button"
                                    onClick={() => openLightbox(attraction)}
                                    aria-label={`Open ${attraction.name} photos fullscreen`}
                                    className="absolute inset-0 z-[1] cursor-zoom-in"
                                />
                            )}
                            {attraction.externalUrl && (
                                <a
                                    href={attraction.externalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`Visit ${attraction.name} website`}
                                    className="absolute bottom-6 right-6 z-[3] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-[var(--color-charcoal)] hover:border-white transition-all shadow-sm"
                                >
                                    <span>Visit Site</span>
                                    <ArrowUpRight className="h-3 w-3" />
                                </a>
                            )}
                        </div>
                    );
                })}
            </div>

            <Lightbox
                isOpen={activeId !== null}
                onClose={closeLightbox}
                images={galleryImages}
                currentIndex={lightboxIndex}
                onNext={galleryImages.length > 1 ? next : undefined}
                onPrev={galleryImages.length > 1 ? prev : undefined}
            />
        </section>
    );
}
