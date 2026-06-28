import { ChevronDown } from "lucide-react";
import { requireGuestyAdmin } from "@/lib/auth/modeGuards";
import { guestyContentService } from "@/services/guestyContentService";
import { contentService } from "@/services/contentService";
import { HomepageEditor } from "@/components/admin/guesty/HomepageEditor";
import { LocationsManager } from "@/components/admin/forms/LocationsManager";
import { FAQManager } from "@/components/admin/forms/FAQManager";
import { AttractionsManager } from "@/components/admin/guesty/AttractionsManager";

function Section({
    title,
    subtitle,
    defaultOpen = false,
    children,
}: {
    title: string;
    subtitle?: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    return (
        <details
            open={defaultOpen}
            className="group rounded-lg border border-[var(--color-sand)] bg-[var(--color-warm-white)]/40 overflow-hidden"
        >
            <summary className="cursor-pointer select-none list-none px-5 py-4 flex items-center justify-between hover:bg-white/50 transition-colors">
                <div>
                    <h2 className="text-lg font-bold text-[var(--color-aegean-blue)] font-montserrat">{title}</h2>
                    {subtitle && <p className="text-xs text-[var(--color-charcoal)]/50 mt-0.5">{subtitle}</p>}
                </div>
                <ChevronDown className="h-5 w-5 text-[var(--color-charcoal)]/40 transition-transform group-open:rotate-180 shrink-0" />
            </summary>
            <div className="p-4 pt-0">{children}</div>
        </details>
    );
}

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

            <Section title="Room Categories" subtitle="Photos per category — drag to reorder, first is the cover." defaultOpen>
                {categories.length === 0 ? (
                    <div className="bg-white border border-[var(--color-sand)] rounded-lg p-8 text-center text-[var(--color-charcoal)]/50">
                        No room categories found yet.
                    </div>
                ) : (
                    <HomepageEditor initialCategories={categories} />
                )}
            </Section>

            <Section title="Map Pins" subtitle="Nearby conveniences shown on the interactive map.">
                <LocationsManager
                    initialLocations={conveniences}
                    initialCategories={locationCategories}
                    initialPageContent={pageContent}
                />
            </Section>

            <Section title="FAQs" subtitle="Questions and answers in the FAQ accordion.">
                <FAQManager initialFAQs={faqs} />
            </Section>

            <Section title="Attractions" subtitle="Cards + lightbox galleries in the attractions grid.">
                <AttractionsManager initialAttractions={attractions} />
            </Section>
        </div>
    );
}
