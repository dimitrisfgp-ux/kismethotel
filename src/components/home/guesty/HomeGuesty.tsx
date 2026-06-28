import { Hero } from "@/components/home/Hero";
import { LocationSection } from "@/components/home/LocationSection";
import { AttractionsGrid } from "@/components/home/AttractionsGrid";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { GuestyCategorySection } from "./GuestyCategorySection";
import { GuestyFilterMount } from "./GuestyFilterMount";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import type { GuestyHomeContent } from "@/services/guestyContentService";

export function HomeGuesty({ content }: { content: GuestyHomeContent }) {
    const { hero, categories, conveniences, locationCategories, attractions, faqs } = content;

    return (
        <div>
            {/* Hero already has its own animate-fade-in; left untouched. */}
            <Hero
                title={hero.title}
                subtitle={hero.subtitle}
                ctaText={hero.ctaText}
                scrollTargetId={hero.scrollTargetId}
                poster={hero.poster}
                videos={hero.videos}
            />
            {/* Sticky scope: the filter bar sticks below the header for as long
                as any room category is visible, then scrolls away with this wrapper. */}
            <div>
                <GuestyFilterMount />
                {categories.map((cat) => (
                    <RevealOnScroll key={cat.slug}>
                        <GuestyCategorySection category={cat} />
                    </RevealOnScroll>
                ))}
            </div>
            <RevealOnScroll>
                <LocationSection
                    conveniences={conveniences}
                    categories={locationCategories}
                />
            </RevealOnScroll>
            <RevealOnScroll>
                <AttractionsGrid attractions={attractions} />
            </RevealOnScroll>
            <RevealOnScroll>
                <FAQAccordion faqs={faqs} />
            </RevealOnScroll>
        </div>
    );
}
