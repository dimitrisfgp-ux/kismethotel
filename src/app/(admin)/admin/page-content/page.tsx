import { contentService } from "@/services/contentService";
import { PageContentForm } from "@/components/admin/forms/PageContentForm";
import { LocationsManager } from "@/components/admin/forms/LocationsManager";
import { FAQManager } from "@/components/admin/forms/FAQManager";

export default async function PageContentPage() {
    const pageContent = await contentService.getPageContent();
    const conveniences = await contentService.getConveniences();
    const categories = await contentService.getCategories();
    const faqs = await contentService.getFAQs();

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="border-b border-[var(--color-sand)] pb-6">
                <h1 className="text-3xl font-bold font-montserrat text-[var(--color-charcoal)]">Home Page Content</h1>
                <p className="text-[var(--color-charcoal)]/60 mt-2">Customize the Hero section, titles, and call-to-action text.</p>
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
