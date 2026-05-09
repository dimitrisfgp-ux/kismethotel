"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

interface RevealOnScrollProps {
    children: ReactNode;
    className?: string;
    /** Optional ms delay before the transition starts. Useful for stagger. */
    delay?: number;
    /** Override the default IntersectionObserver root margin. */
    rootMargin?: string;
}

/**
 * Fades + slides children in when they enter the viewport. Reveals once
 * and stays visible (won't re-animate if the user scrolls back). Uses the
 * existing `useIntersectionObserver` hook plus the project's --ease-premium
 * easing token, so it matches the rest of the site's motion.
 */
export function RevealOnScroll({
    children,
    className,
    delay = 0,
    rootMargin = "0px 0px -80px 0px",
}: RevealOnScrollProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useIntersectionObserver(ref, { threshold: 0.1, rootMargin });
    const [hasRevealed, setHasRevealed] = useState(false);

    useEffect(() => {
        if (isInView && !hasRevealed) setHasRevealed(true);
    }, [isInView, hasRevealed]);

    return (
        <div
            ref={ref}
            className={cn(
                "transition-[opacity,transform] duration-700 ease-premium will-change-[opacity,transform]",
                hasRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                className
            )}
            style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}
