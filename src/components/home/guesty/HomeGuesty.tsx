import { Hero } from "@/components/home/Hero";
import { LocationSection } from "@/components/home/LocationSection";
import { AttractionsGrid } from "@/components/home/AttractionsGrid";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { GuestyCategorySection } from "./GuestyCategorySection";
import { GuestyFilterMount } from "./GuestyFilterMount";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import {
    GUESTY_HERO,
    GUESTY_ROOM_CATEGORIES,
    GUESTY_LOCATION_CATEGORIES,
    GUESTY_CONVENIENCES,
    GUESTY_ATTRACTIONS,
    GUESTY_FAQS,
} from "@/config/guestyMode";

export function HomeGuesty() {
    return (
        <div>
            {/* Hero already has its own animate-fade-in; left untouched. */}
            <Hero
                title={GUESTY_HERO.title}
                subtitle={GUESTY_HERO.subtitle}
                ctaText={GUESTY_HERO.ctaText}
                scrollTargetId={GUESTY_HERO.scrollTargetId}
                poster={GUESTY_HERO.poster}
                videos={GUESTY_HERO.videos}
            />
            {/* Sticky scope: the filter bar sticks below the header for as long
                as any room category is visible, then scrolls away with this wrapper.
                The filter bar itself is NOT wrapped in RevealOnScroll because it's
                position:sticky — animating its opacity/transform breaks sticky. */}
            <div>
                <GuestyFilterMount />
                {GUESTY_ROOM_CATEGORIES.map((cat) => (
                    <RevealOnScroll key={cat.slug}>
                        <GuestyCategorySection category={cat} />
                    </RevealOnScroll>
                ))}
            </div>
            <RevealOnScroll>
                <LocationSection
                    conveniences={GUESTY_CONVENIENCES}
                    categories={GUESTY_LOCATION_CATEGORIES}
                />
            </RevealOnScroll>
            <RevealOnScroll>
                <AttractionsGrid attractions={GUESTY_ATTRACTIONS} />
            </RevealOnScroll>
            <RevealOnScroll>
                <FAQAccordion faqs={GUESTY_FAQS} />
            </RevealOnScroll>
        </div>
    );
}
