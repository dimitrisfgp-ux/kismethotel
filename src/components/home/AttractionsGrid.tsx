import { Attraction } from "@/types";
import Image from "next/image";
import { SectionHeading } from "../ui/SectionHeading";
import { Container } from "../ui/Container";

interface AttractionsGridProps {
    attractions: Attraction[];
}

export function AttractionsGrid({ attractions }: AttractionsGridProps) {
    return (
        <section className="py-24 bg-white">
            <Container>
                <SectionHeading title="Explore Crete" subtitle="Discover the ancient history and natural beauty surrounding Kismet." />
            </Container>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white border-y border-white auto-rows-[400px] w-full">
                {attractions.map((attraction, i) => (
                    <div
                        key={attraction.id}
                        className={`relative group overflow-hidden ${(i % 4 === 0 || i % 4 === 3) ? 'md:col-span-2' : ''
                            }`}
                    >
                        <Image
                            src={attraction.image}
                            alt={attraction.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
                            sizes={
                                (i % 4 === 0 || i % 4 === 3)
                                    ? "(max-width: 768px) 100vw, 66vw"
                                    : "(max-width: 768px) 100vw, 33vw"
                            }
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40 group-hover:opacity-70 transition-all duration-300" />

                        <div className="absolute bottom-0 left-0 p-8 text-[var(--color-warm-white)] w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md">
                            <h3 className="font-montserrat text-xl font-bold uppercase tracking-widest mb-2 text-[var(--color-warm-white)]">{attraction.name}</h3>
                            <p className="font-inter text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{attraction.description}</p>
                            <div className="mt-3 inline-block">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm">
                                    {attraction.distance}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
