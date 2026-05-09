"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { GUESTY_WIDGET } from "@/config/guestyMode";

declare global {
    interface Window {
        GuestySearchBarWidget?: {
            create: (config: { siteUrl: string; color: string }) => Promise<unknown>;
        };
    }
}

/**
 * Mounts the Guesty search-bar widget into a fixed-id container.
 * Wrapped in a section with id="search-bar" so the existing Hero
 * scroll-to-search-bar behaviour still works in either mode.
 *
 * The widget snippet is loaded as a stylesheet + a script
 * (via next/script's afterInteractive strategy), then we call
 * GuestySearchBarWidget.create() once the script has loaded.
 */
export function GuestyFilterMount() {
    const initialized = useRef(false);

    const init = () => {
        if (initialized.current) return;
        if (typeof window === "undefined") return;
        if (!window.GuestySearchBarWidget) return;
        initialized.current = true;
        window.GuestySearchBarWidget.create({
            siteUrl: GUESTY_WIDGET.siteUrl,
            color: GUESTY_WIDGET.color,
        }).catch((err: Error) => {
            console.warn("[Guesty Widget] init failed:", err.message);
            initialized.current = false;
        });
    };

    // If the script was already loaded before this component mounted
    // (e.g. fast nav, soft reload), onLoad won't fire — kick it ourselves.
    useEffect(() => {
        if (typeof window !== "undefined" && window.GuestySearchBarWidget) {
            init();
        }
    }, []);

    return (
        <section
            id="search-bar"
            className="bg-[var(--color-warm-white)] py-12 border-y border-[var(--color-sand)]"
        >
            <link rel="stylesheet" href={GUESTY_WIDGET.cssUrl} />
            <div className="container mx-auto px-4 max-w-4xl">
                <div id={GUESTY_WIDGET.containerId} />
            </div>
            <Script
                src={GUESTY_WIDGET.jsUrl}
                strategy="afterInteractive"
                onLoad={init}
            />
        </section>
    );
}
