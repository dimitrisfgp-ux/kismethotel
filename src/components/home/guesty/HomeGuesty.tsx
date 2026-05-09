import { Hero } from "@/components/home/Hero";
import { LocationSection } from "@/components/home/LocationSection";
import { AttractionsGrid } from "@/components/home/AttractionsGrid";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { GuestyCategorySection } from "./GuestyCategorySection";
import { GuestyFilterMount } from "./GuestyFilterMount";
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
            <Hero
                title={GUESTY_HERO.title}
                subtitle={GUESTY_HERO.subtitle}
                ctaText={GUESTY_HERO.ctaText}
                scrollTargetId={GUESTY_HERO.scrollTargetId}
            />
            <GuestyFilterMount />
            {GUESTY_ROOM_CATEGORIES.map((cat) => (
                <GuestyCategorySection key={cat.slug} category={cat} />
            ))}
            <LocationSection
                conveniences={GUESTY_CONVENIENCES}
                categories={GUESTY_LOCATION_CATEGORIES}
            />
            <AttractionsGrid attractions={GUESTY_ATTRACTIONS} />
            <FAQAccordion faqs={GUESTY_FAQS} />
        </div>
    );
}
