
import { useEffect, useState, RefObject } from 'react';

interface UseIntersectionObserverProps {
    threshold?: number | number[];
    root?: Element | null;
    rootMargin?: string;
    enabled?: boolean;
}

export function useIntersectionObserver(
    elementRef: RefObject<Element | null> | Element | null,
    { threshold = 0, root = null, rootMargin = '0px', enabled = true }: UseIntersectionObserverProps = {}
): boolean {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        const target = elementRef && 'current' in elementRef ? elementRef.current : elementRef;
        if (!target) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold, root, rootMargin }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [elementRef, threshold, root, rootMargin, enabled]);

    return isVisible;
}
