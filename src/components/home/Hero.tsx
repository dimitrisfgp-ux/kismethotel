"use client";

import { PLACEHOLDER_HERO } from "@/lib/placeholders";
import { Button } from "../ui/Button";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
    const scrollToRooms = () => {
        const element = document.getElementById("search-bar");
        if (element) {
            // Offset for sticky header
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
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
                    <source src="/Videos/desktop/hero_desktop.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 z-10" />

            {/* Content */}
            <div className="relative z-20 text-center text-white px-4 animate-fade-in">
                <h1 className="font-montserrat font-bold text-[clamp(2.5rem,6vw,5rem)] tracking-[0.2em] mb-4 drop-shadow-md">
                    Your Destiny Awaits
                </h1>
                <p className="font-inter text-lg md:text-xl tracking-widest uppercase opacity-90 mb-10 max-w-2xl mx-auto drop-shadow-sm">
                    Curated Luxury on the Cretan Coast
                </p>
                <Link href="/#rooms">
                    <Button size="lg" className="bg-white text-[var(--color-charcoal)] hover:bg-[var(--color-warm-white)]">
                        Explore Collection
                    </Button>
                </Link>
            </div>

            {/* Scroll Indicator */}
            <button
                onClick={scrollToRooms}
                className="absolute bottom-10 z-20 animate-bounce text-white/80 hover:text-white transition-colors"
            >
                <ChevronDown className="h-10 w-10" />
            </button>
        </section>
    );
}
