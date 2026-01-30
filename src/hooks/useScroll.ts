
import { useState, useEffect } from "react";

interface UseScrollOptions {
    threshold?: number;
}

export function useScroll({ threshold = 50 }: UseScrollOptions = {}) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);
            setIsScrolled(currentScrollY > threshold);
        };

        // Initialize state on mount
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return { isScrolled, scrollY };
}
