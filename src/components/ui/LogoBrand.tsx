"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { HotelSettings } from "@/types";

type LogoSettings = Pick<HotelSettings, 'logoMode' | 'name' | 'description' | 'logoIconUrl' | 'logoTextUrl'>;

interface LogoBrandProps {
    settings: LogoSettings;
    variant: 'light' | 'dark';
    size?: 'sm' | 'md' | 'lg';
    showSubtext?: boolean;
    className?: string;
}

const SIZE_CONFIG = {
    sm: {
        icon: 'h-8 sm:h-9 md:h-11 w-auto',
        text: 'h-8 sm:h-9 md:h-11 w-auto',
        fontSize: 'text-xl sm:text-2xl',
        subtextSize: 'text-[8px] sm:text-[10px]',
        gap: 'gap-2 sm:gap-3'
    },
    md: {
        icon: 'h-10 sm:h-12 md:h-14 w-auto',
        text: 'h-10 sm:h-12 md:h-13 w-auto',
        fontSize: 'text-2xl sm:text-3xl',
        subtextSize: 'text-[10px] sm:text-xs',
        gap: 'gap-2 sm:gap-3'
    },
    lg: {
        icon: 'h-12 sm:h-14 md:h-18 w-auto',
        text: 'h-12 sm:h-14 md:h-16 w-auto',
        fontSize: 'text-3xl sm:text-4xl',
        subtextSize: 'text-xs sm:text-sm',
        gap: 'gap-3 sm:gap-4'
    }
} as const;

// Inline filter style for reliable cross-browser SVG color inversion.
// Tailwind's brightness-0/invert utilities don't always compose correctly.
const LIGHT_FILTER: React.CSSProperties = { filter: 'brightness(0) invert(1)' };
const NO_FILTER: React.CSSProperties = {};

/**
 * Shared logo component supporting dual pipelines:
 * - Pipeline A (text): Renders settings.name as styled text
 * - Pipeline B (image): Renders icon + text SVGs side by side
 * 
 * Falls back to text mode if SVG images fail to load.
 */
export function LogoBrand({ settings, variant, size = 'sm', showSubtext = false, className }: LogoBrandProps) {
    const [imgError, setImgError] = useState(false);
    const config = SIZE_CONFIG[size];

    const isTextMode = settings.logoMode === 'text' || imgError;

    // Color classes
    const textColor = variant === 'light' ? 'text-white' : 'text-[var(--color-charcoal)]';
    const subtextColor = variant === 'light' ? 'text-white/60' : 'text-[var(--color-charcoal)]/60';
    // Use inline style for reliable filter application
    const filterStyle = variant === 'light' ? LIGHT_FILTER : NO_FILTER;

    if (isTextMode) {
        return (
            <div className={cn("flex flex-col", className)}>
                <span className={cn(
                    "font-montserrat font-bold uppercase tracking-[0.2em] transition-colors duration-300",
                    config.fontSize,
                    textColor
                )}>
                    {settings.name}
                </span>
                {showSubtext && settings.description && (
                    <span className={cn(
                        "font-inter",
                        config.subtextSize,
                        subtextColor
                    )}>
                        {settings.description}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className={cn("flex items-center", config.gap, className)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={settings.logoIconUrl}
                alt=""
                className={cn(config.icon, 'transition-[filter] duration-300')}
                onError={() => setImgError(true)}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={settings.logoTextUrl}
                alt={settings.name}
                className={cn(config.text, 'transition-[filter] duration-300')}
                style={filterStyle}
                onError={() => setImgError(true)}
            />
        </div>
    );
}
