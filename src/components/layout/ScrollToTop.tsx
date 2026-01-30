"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        // Enforce top position on route change and initial load
        // We use 'instant' behavior to avoid seeing the scroll happen on load
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [pathname]);

    return null;
}
