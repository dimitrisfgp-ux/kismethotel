import { Hero } from "@/components/home/Hero";
import { RoomsGrid } from "@/components/home/RoomsGrid";
import { LocationSection } from "@/components/home/LocationSection";
import { AttractionsGrid } from "@/components/home/AttractionsGrid";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { roomService } from "@/services/roomService";
import { contentService } from "@/services/contentService";



export default async function Home() {
  // Fetch data in parallel
  const [rooms, conveniences, attractions, faqs, pageContent, categories] = await Promise.all([
    roomService.getRooms(),
    contentService.getConveniences(),
    contentService.getAttractions(),
    contentService.getFAQs(),
    contentService.getPageContent(),
    contentService.getCategories()
  ]);

  return (
    <div>
      <Hero
        title={pageContent.hero.title}
        subtitle={pageContent.hero.subtitle}
        ctaText={pageContent.hero.ctaText}
        poster={pageContent.hero.poster}
        videos={pageContent.hero.videos}
      />
      <div id="search-bar" />
      <RoomsGrid rooms={rooms} />
      <LocationSection
        conveniences={conveniences}
        categories={categories}
        content={pageContent.locationsSection}
      />
      <AttractionsGrid attractions={attractions} />
      <FAQAccordion faqs={faqs} />
    </div>
  );
}
