import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Custom Smooth Scroll Helper
export function scrollToElement(elementId: string, duration = 1200, offset = 80) {
    const target = document.getElementById(elementId);
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    // Offset for header (default 80px) or custom
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition - offset;
    let startTime: number | null = null;

    // Disable CSS smooth scroll to prevent conflict with JS animation
    document.documentElement.style.scrollBehavior = 'auto';

    function animation(currentTime: number) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;

        // Ease In Out Quad
        const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        const run = ease(Math.min(timeElapsed / duration, 1));
        window.scrollTo(0, startPosition + distance * run);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        } else {
            // Restore CSS smooth scroll
            document.documentElement.style.scrollBehavior = '';
        }
    }

    requestAnimationFrame(animation);
}
