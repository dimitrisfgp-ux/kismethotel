import { contentService } from "@/services/contentService";
import { PageContentForm } from "@/components/admin/forms/PageContentForm";
import { LocationsManager } from "@/components/admin/forms/LocationsManager";
import { FAQManager } from "@/components/admin/forms/FAQManager";

export default async function PageContentPage() {
    const [pageContent, conveniences, categories, faqs] = await Promise.all([
        contentService.getPageContent(),
        contentService.getConveniences(),
        contentService.getCategories(),
        contentService.getFAQs()
    ]);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="border-b border-[var(--color-sand)] pb-4 md:pb-6 px-4 md:px-0">
                <h1 className="text-2xl md:text-3xl font-bold font-montserrat text-[var(--color-charcoal)]">Home Page Content</h1>
                <p className="text-[var(--color-charcoal)]/60 mt-1 md:mt-2 text-sm md:text-base">Customize the Hero section, titles, and call-to-action text.</p>
            </div>

            <PageContentForm initialContent={pageContent} />
            <LocationsManager
                initialLocations={conveniences}
                initialCategories={categories}
                initialPageContent={pageContent}
            />
            <FAQManager initialFAQs={faqs} />
        </div>
    );
}
