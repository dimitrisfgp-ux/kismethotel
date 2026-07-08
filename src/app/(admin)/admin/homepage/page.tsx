import { requireGuestyAdmin } from "@/lib/auth/modeGuards";
import { guestyContentService } from "@/services/guestyContentService";
import { contentService } from "@/services/contentService";
import { HomepageEditor } from "@/components/admin/guesty/HomepageEditor";
import { LocationsManager } from "@/components/admin/forms/LocationsManager";
import { FAQManager } from "@/components/admin/forms/FAQManager";
import { AttractionsManager } from "@/components/admin/guesty/AttractionsManager";
import { HeroEditor } from "@/components/admin/guesty/HeroEditor";
import { AccordionSection } from "@/components/admin/AccordionSection";

export default async function AdminHomepagePage() {
    // Guesty-only surface; self_contained admins are redirected to Rooms.
    await requireGuestyAdmin();

    const [categories, conveniences, locationCategories, pageContent, faqs, attractions] = await Promise.all([
        guestyContentService.getCategoriesForAdmin(),
        contentService.getConveniences(),
        contentService.getCategories(),
        contentService.getPageContent(),
        contentService.getFAQs(),
        contentService.getAttractions(),
    ]);

    return (
        <div className="space-y-5 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-aegean-blue)] font-montserrat">Homepage</h1>
                <p className="text-sm text-[var(--color-charcoal)]/60 mt-1">
                    Everything shown on the public homepage — room categories, the map, FAQs and attractions.
                </p>
            </div>

            <AccordionSection title="Hero" subtitle="The video banner at the top of the homepage." defaultOpen>
                <HeroEditor initialHero={pageContent.hero} />
            </AccordionSection>

            <AccordionSection title="Room Categories" subtitle="Each category — manage its images and details in tabs.">
                {categories.length === 0 ? (
                    <div className="bg-white border border-[var(--color-sand)] rounded-lg p-8 text-center text-[var(--color-charcoal)]/50">
                        No room categories found yet.
                    </div>
                ) : (
                    <HomepageEditor initialCategories={categories} />
                )}
            </AccordionSection>

            <AccordionSection title="Map Pins" subtitle="Nearby conveniences shown on the interactive map.">
                <LocationsManager
                    initialLocations={conveniences}
                    initialCategories={locationCategories}
                    initialPageContent={pageContent}
                />
            </AccordionSection>

            <AccordionSection title="FAQs" subtitle="Questions and answers in the FAQ accordion.">
                <FAQManager initialFAQs={faqs} />
            </AccordionSection>

            <AccordionSection title="Attractions" subtitle="Cards + lightbox galleries in the attractions grid.">
                <AttractionsManager initialAttractions={attractions} />
            </AccordionSection>
        </div>
    );
}
