"use client";

import { useEffect } from "react";
import { GUESTY_WIDGET } from "@/config/guestyMode";

declare global {
    interface Window {
        GuestySearchBarWidget?: {
            create: (config: { siteUrl: string; color: string }) => Promise<unknown>;
        };
    }
}

// Targeted overrides for Guesty's widget. Selectors match Guesty's own
// specificity (their rules use #guesty-search-widget__datepicker, an ID),
// so we mirror that to actually win — class-only selectors get overruled.
// Verified against the live search-bar-production.css.
const widgetOverrides = `
#search-widget_IO312PWQ .guesty-root-element #guesty-search-widget__datepicker .__super-input,
#search-widget_IO312PWQ .guesty-root-element .selectr-selected {
    height: 32px !important;
    border-radius: var(--radius-subtle) !important;
    padding: 6px 12px !important;
    font-family: var(--font-inter), system-ui, sans-serif !important;
    font-size: 12.5px !important;
    color: #2F3437 !important;
}
#search-widget_IO312PWQ .guesty-root-element #guesty-search-widget__datepicker [id^=date-picker-wrapper] {
    background: #fff !important;
}
#search-widget_IO312PWQ .guesty-root-element #guesty-search-widget__datepicker [id^=date-picker-wrapper]:first-child .__super-input {
    border-right: 1px solid rgba(232, 220, 196, 0.7) !important;
}
/* Search button — match the primary Button (Reserve) styling.
   Uses border + inset box-shadow + outline for the gold ring so the
   accent survives Guesty's stylesheet regardless of load order. */
#search-widget_IO312PWQ .guesty-root-element .guesty-search-submit-btn {
    height: 32px !important;
    border-radius: 8px !important;
    padding: 6px 22px !important;
    background-color: var(--color-deep-med) !important;
    border: 1.5px solid var(--color-accent-gold) !important;
    outline: 1px solid var(--color-accent-gold) !important;
    outline-offset: -1.5px !important;
    box-shadow: inset 0 0 0 1.5px var(--color-accent-gold) !important;
    color: #fff !important;
    font-family: var(--font-montserrat), system-ui, sans-serif !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    width: auto !important;
    min-width: 110px !important;
    transition: transform 0.3s var(--ease-premium, ease), box-shadow 0.3s var(--ease-premium, ease), background-color 0.3s var(--ease-premium, ease) !important;
}
#search-widget_IO312PWQ .guesty-root-element .guesty-search-submit-btn:hover {
    background-color: rgba(44, 95, 141, 0.9) !important;
    transform: translateY(-2px) !important;
    box-shadow:
        inset 0 0 0 1.5px var(--color-accent-gold),
        var(--shadow-hover, 0 8px 24px rgba(0, 0, 0, 0.12)) !important;
}
`;

/**
 * Mounts the Guesty/Hotelyzer search-bar widget.
 *
 * We load the stylesheet + script via useEffect (instead of <Script>)
 * because Next's <Script id="..."> dedupes by id — fine in production but
 * brittle across dev HMR cycles where the script doesn't re-run on a
 * fresh component mount, leaving an empty container.
 *
 * The window.__kismetGuestyInited flag guards against StrictMode's
 * double-mount in dev so we don't double-inject or call create() twice.
 */
export function GuestyFilterMount() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Inject our overrides into <head> (idempotent by id) so they stay
        // active across remounts and HMR.
        if (!document.getElementById("kismet-guesty-overrides")) {
            const styleEl = document.createElement("style");
            styleEl.id = "kismet-guesty-overrides";
            styleEl.textContent = widgetOverrides;
            document.head.appendChild(styleEl);
        }

        // Inject Guesty's stylesheet into <head> (idempotent by href).
        if (!document.querySelector(`link[href="${GUESTY_WIDGET.cssUrl}"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = GUESTY_WIDGET.cssUrl;
            link.media = "all";
            document.head.appendChild(link);
        }

        // DOM-based idempotency: only call create() if the container is
        // present and doesn't already have the widget rendered inside.
        const create = () => {
            if (!window.GuestySearchBarWidget) return;
            const container = document.getElementById(GUESTY_WIDGET.containerId);
            if (!container) return;
            if (container.querySelector(".guesty-root-element")) return;
            window.GuestySearchBarWidget.create({
                siteUrl: GUESTY_WIDGET.siteUrl,
                color: GUESTY_WIDGET.color,
            }).catch((e: Error) => {
                console.warn("[Guesty Widget]:", e.message);
            });
        };

        // Script already loaded → call create() directly.
        if (window.GuestySearchBarWidget) {
            create();
            return;
        }

        // Script tag present but still loading → attach to its load event.
        const existing = document.querySelector(
            `script[src="${GUESTY_WIDGET.jsUrl}"]`
        ) as HTMLScriptElement | null;
        if (existing) {
            existing.addEventListener("load", create);
            return;
        }

        // First time → inject + bind.
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = GUESTY_WIDGET.jsUrl;
        script.async = true;
        script.onload = create;
        document.head.appendChild(script);
    }, []);

    return (
        <section
            id="search-bar"
            // Hidden on mobile — Guesty's third-party widget collapses awkwardly
            // at small widths. Visitors on phones can still go to the per-room
            // Reserve CTAs (which redirect to Guesty) so the filter isn't critical.
            className="hidden md:block sticky top-16 md:top-[var(--header-height)] z-40 bg-[var(--color-warm-white)] py-2 md:py-3 border-y border-[var(--color-accent-gold)]/50"
        >
            {/* Soft sand glow centered behind the widget — light, on-brand backdrop */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(232, 220, 196, 0.55) 0%, rgba(232, 220, 196, 0.15) 45%, transparent 75%)",
                }}
            />

            <div className="relative mx-auto px-4 max-w-3xl">
                {/* Card frame — same recipe used by FAQ cards elsewhere on the site */}
                <div className="bg-white border border-[var(--color-sand)] rounded-[var(--radius-subtle)] shadow-md p-1 md:p-1.5 flex justify-center">
                    <div id={GUESTY_WIDGET.containerId} className="w-full flex justify-center" />
                </div>
            </div>
        </section>
    );
}
