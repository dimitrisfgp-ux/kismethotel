import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { GuestyRoomGallery } from "./GuestyRoomGallery";
import type { GuestyRoomCategory } from "@/config/guestyMode";

interface GuestyCategorySectionProps {
    category: GuestyRoomCategory;
}

export function GuestyCategorySection({ category }: GuestyCategorySectionProps) {
    // Title block (subtitle + title + gold separator) used in two places —
    // above the image on mobile, and inside the content side on desktop.
    const titleBlock = (
        <>
            <p className="font-inter text-sm uppercase tracking-[0.25em] text-[var(--color-aegean-blue)] mb-3">
                {category.subtitle}
            </p>
            <h2 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-light uppercase tracking-[0.15em] text-[var(--color-charcoal)] mb-6 [text-shadow:_0_2px_12px_rgba(47,52,55,0.15)]">
                {category.title}
            </h2>
            <div className="w-16 h-[2px] bg-[var(--color-accent-gold)] mb-6 mx-auto md:mx-0" />
        </>
    );

    return (
        <section
            id={`category-${category.slug}`}
            className="bg-white border-b border-[var(--color-sand)] py-16 md:py-24"
        >
            <Container fluid>
                {/* Mobile-only title above the image */}
                <div className="md:hidden mb-8 px-4 text-center">
                    {titleBlock}
                </div>

                <div
                    className={cn(
                        "flex flex-col gap-8 md:gap-12 items-center",
                        category.layout === "image-right"
                            ? "md:flex-row-reverse"
                            : "md:flex-row"
                    )}
                >
                    {/* Image side — wider to give the gallery room to breathe */}
                    <div className="w-full md:w-3/5 lg:w-2/3">
                        <GuestyRoomGallery
                            main={category.images.main}
                            secondary={category.images.secondary}
                            extras={category.images.extras}
                            alt={category.title}
                        />
                    </div>

                    {/* Content side: full width on mobile (description + CTA only),
                        constrained on desktop (full title block + description + CTA). */}
                    <div className="w-full md:w-2/5 lg:w-1/3 flex flex-col justify-center px-4 md:px-0">
                        {/* Desktop only — mobile shows the title block above the image */}
                        <div className="hidden md:block">
                            {titleBlock}
                        </div>
                        <p className="font-inter text-base md:text-lg text-[var(--color-charcoal)]/80 leading-relaxed mb-8 md:mb-10 text-center md:text-left">
                            {category.description}
                        </p>
                        <a
                            href={category.guestyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block self-center md:self-start"
                        >
                            <Button size="lg" className="min-w-[180px] shadow-lg">
                                Reserve
                            </Button>
                        </a>
                    </div>
                </div>
            </Container>
        </section>
    );
}
