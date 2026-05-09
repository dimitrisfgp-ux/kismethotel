import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { GuestyRoomGallery } from "./GuestyRoomGallery";
import type { GuestyRoomCategory } from "@/config/guestyMode";

interface GuestyCategorySectionProps {
    category: GuestyRoomCategory;
}

export function GuestyCategorySection({ category }: GuestyCategorySectionProps) {
    return (
        <section
            id={`category-${category.slug}`}
            className="bg-white border-b border-[var(--color-sand)] py-16 md:py-24"
        >
            <Container>
                <div
                    className={cn(
                        "flex flex-col gap-10 md:gap-16 items-center",
                        category.layout === "image-right"
                            ? "md:flex-row-reverse"
                            : "md:flex-row"
                    )}
                >
                    {/* Image side */}
                    <div className="w-full md:w-1/2">
                        <GuestyRoomGallery
                            main={category.images.main}
                            secondary={category.images.secondary}
                            alt={category.title}
                        />
                    </div>

                    {/* Content side */}
                    <div className="w-full md:w-1/2 md:px-4 lg:px-8 flex flex-col justify-center">
                        <p className="font-inter text-sm uppercase tracking-[0.25em] text-[var(--color-aegean-blue)] mb-3">
                            {category.subtitle}
                        </p>
                        <h2 className="font-montserrat text-3xl md:text-4xl lg:text-5xl font-light uppercase tracking-[0.15em] text-[var(--color-charcoal)] mb-6">
                            {category.title}
                        </h2>
                        <div className="w-16 h-[2px] bg-[var(--color-accent-gold)] mb-6" />
                        <p className="font-inter text-base md:text-lg text-[var(--color-charcoal)]/80 leading-relaxed mb-10">
                            {category.description}
                        </p>
                        <a
                            href={category.guestyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block self-start"
                        >
                            <Button size="lg" className="min-w-[180px]">
                                Reserve
                            </Button>
                        </a>
                    </div>
                </div>
            </Container>
        </section>
    );
}
