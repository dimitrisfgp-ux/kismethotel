'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CollapseProps {
    open: boolean;
    children: ReactNode;
    className?: string;
    /** Duration in ms. Defaults to 300. */
    durationMs?: number;
}

/**
 * Smoothly animates its children open/closed in BOTH directions using the CSS
 * grid `0fr → 1fr` technique — no fixed max-height guessing and no knowledge of
 * the content height required. The child is always in the DOM (clipped when
 * closed), so callers that mount heavy content (e.g. a map) should gate that
 * content on an `open`/`hasOpened` flag themselves.
 *
 * Falls back to an instant open/close on browsers that don't animate
 * grid-template-rows; respects prefers-reduced-motion.
 */
export function Collapse({ open, children, className, durationMs = 300 }: CollapseProps) {
    return (
        <div
            aria-hidden={!open}
            style={{ transitionDuration: `${durationMs}ms` }}
            className={cn(
                'grid transition-[grid-template-rows] ease-in-out motion-reduce:transition-none',
                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                className
            )}
        >
            <div className="overflow-hidden min-h-0">{children}</div>
        </div>
    );
}
