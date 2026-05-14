"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PLACEHOLDER_HERO } from "@/lib/placeholders";
import { Button } from "../ui/Button";
import { ChevronDown } from "lucide-react";
import { scrollToElement } from "@/lib/utils";

interface HeroProps {
    title: string;
    subtitle: string;
    ctaText: string;
    poster?: string;
    videos?: {
        mobile?: string;
        desktop?: string;
    };
    scrollTargetId?: string;
}

// `navigator.connection` is non-standard but supported in Chrome/Edge/Android.
// On slow networks or data-saver mode we skip the video entirely so the poster
// stays as the only hero asset (~570 KB instead of 4–8 MB).
interface NetworkInformation {
    effectiveType?: string;
    saveData?: boolean;
}

export function Hero({ title, subtitle, ctaText, poster, videos, scrollTargetId = "search-bar" }: HeroProps) {
    const [mountVideo, setMountVideo] = useState(false);

    useEffect(() => {
        const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
        const slow = conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType);
        const dataSaver = conn?.saveData === true;
        const reducedData = window.matchMedia("(prefers-reduced-data: reduce)").matches;
        if (slow || dataSaver || reducedData) return;

        // Defer slightly so the poster image paints first (better LCP).
        const idle = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
        const id = idle
            ? idle(() => setMountVideo(true), { timeout: 1500 })
            : (window.setTimeout(() => setMountVideo(true), 200) as unknown as number);
        return () => {
            const cancel = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
            if (cancel) cancel(id);
            else window.clearTimeout(id);
        };
    }, []);

    const handleScroll = (e: React.MouseEvent) => {
        e.preventDefault();
        scrollToElement(scrollTargetId);
    };

    const posterSrc = poster || PLACEHOLDER_HERO;

    return (
        <section className="relative h-screen w-full flex items-end justify-center overflow-hidden">
            {/* Background — poster is the LCP element, served as AVIF/WebP via
                next/image. The video mounts on top after client gating so slow
                networks never see it. */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <Image
                    src={posterSrc}
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    quality={70}
                    className="object-cover"
                />
                {mountVideo && (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        poster={posterSrc}
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        {videos?.mobile && <source src={videos.mobile} media="(max-width: 768px)" type="video/mp4" />}
                        {videos?.desktop && <source src={videos.desktop} type="video/mp4" />}
                    </video>
                )}
            </div>

            {/* Overlay — brand tint + a touch of black to slightly darken video playback */}
            <div className="absolute inset-0 bg-[var(--color-aegean-blue)]/20 z-10" />
            <div className="absolute inset-0 bg-black/20 z-10" />
            {/* Bottom vignette — darker behind the heading/subtitle/CTA so text stays
                readable across any video scene. Fades to transparent toward the middle. */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/25 to-transparent z-10" />

            {/* Content — bottom-aligned with padding to clear the scroll-down chevron */}
            <div className="relative z-20 text-center text-white px-4 pb-28 md:pb-32 animate-fade-in">
                <h1 className="font-montserrat font-light text-[clamp(1.5rem,3.5vw,2.75rem)] tracking-[0.2em] mb-4 drop-shadow-lg text-[var(--color-sand)]">
                    {title}
                </h1>
                <div className="w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-[var(--color-sand)] to-transparent mx-auto mb-6 shadow-sm" />
                <p className="font-inter text-lg md:text-xl tracking-widest uppercase opacity-90 mb-10 max-w-2xl mx-auto drop-shadow-sm">
                    {subtitle}
                </p>
                <div onClick={handleScroll}>
                    <Button size="lg" className="min-w-[240px] bg-white/20 backdrop-blur-xl border border-white/50 text-white hover:bg-white/30 hover:text-white hover:translate-y-0 transition-colors duration-300">
                        {ctaText}
                    </Button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <button
                onClick={() => scrollToElement(scrollTargetId)}
                aria-label="Scroll to Content"
                className="absolute bottom-10 z-20 animate-bounce text-white/80 hover:text-white transition-colors"
            >
                <ChevronDown className="h-10 w-10" />
            </button>
        </section>
    );
}
