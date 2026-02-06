"use client";

import { PLACEHOLDER_HERO } from "@/lib/placeholders";
import { Button } from "../ui/Button";
import { ChevronDown } from "lucide-react";
import { scrollToElement } from "@/lib/utils";

interface HeroProps {
    title: string;
    subtitle: string;
    ctaText: string;
}

export function Hero({ title, subtitle, ctaText }: HeroProps) {
    const handleScroll = (e: React.MouseEvent) => {
        e.preventDefault();
        scrollToElement("search-bar"); // Or 'rooms' if preferred, preserving 'search-bar' targeting
    };

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background (Video) */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    poster={PLACEHOLDER_HERO}
                >
                    <source src="/Videos/ios/hero-ios.mp4" type='video/mp4; codecs="hvc1"' media="(max-width: 768px)" />
                    <source src="/Videos/android/hero-android.mp4" type="video/mp4" media="(max-width: 768px)" />
                    <source src="/Videos/desktop/hero-desktop.mp4" type="video/mp4" media="(min-width: 769px)" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-[var(--color-aegean-blue)]/20 z-10" />

            {/* Content */}
            <div className="relative z-20 text-center text-white px-4 animate-fade-in">
                <h1 className="font-montserrat font-light text-[clamp(2.5rem,6vw,5rem)] tracking-[0.2em] mb-4 drop-shadow-lg text-[var(--color-sand)]">
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
                onClick={() => scrollToElement("search-bar")}
                aria-label="Scroll to Content"
                className="absolute bottom-10 z-20 animate-bounce text-white/80 hover:text-white transition-colors"
            >
                <ChevronDown className="h-10 w-10" />
            </button>
        </section>
    );
}
