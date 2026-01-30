"use client";

import { PLACEHOLDER_HERO } from "@/lib/placeholders";
import { Button } from "../ui/Button";
import { ChevronDown } from "lucide-react";
import { scrollToElement } from "@/lib/utils";
import Image from "next/image";

export function Hero() {
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
                    <source src="/Videos/desktop/hero-desktop.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-[var(--color-aegean-blue)]/20 z-10" />

            {/* Content */}
            <div className="relative z-20 text-center text-white px-4 animate-fade-in">
                <h1 className="font-montserrat font-light text-[clamp(2.5rem,6vw,5rem)] tracking-[0.2em] mb-4 drop-shadow-lg text-[var(--color-sand)]">
                    Your Destiny Awaits
                </h1>
                <div className="w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-[var(--color-sand)] to-transparent mx-auto mb-6 shadow-sm" />
                <p className="font-inter text-lg md:text-xl tracking-widest uppercase opacity-90 mb-10 max-w-2xl mx-auto drop-shadow-sm">
                    Curated Luxury on the Cretan Coast
                </p>
                <div onClick={handleScroll}>
                    <Button size="lg" className="bg-white/50 backdrop-blur-2xl border border-white/60 text-white hover:bg-[var(--color-sand)] hover:text-[var(--color-charcoal)] transition-all duration-300">
                        Explore Collection
                    </Button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <button
                onClick={() => scrollToElement("search-bar")}
                className="absolute bottom-10 z-20 animate-bounce text-white/80 hover:text-white transition-colors"
            >
                <ChevronDown className="h-10 w-10" />
            </button>
        </section>
    );
}
