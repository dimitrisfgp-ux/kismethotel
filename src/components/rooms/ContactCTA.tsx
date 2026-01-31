import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import Link from "next/link";

export function ContactCTA() {
    return (
        <section className="bg-[var(--color-aegean-blue)] text-white py-20 text-center relative">
            <Container>
                <h2 className="font-montserrat text-3xl font-bold uppercase tracking-widest mb-4 text-white">Still have questions?</h2>
                <p className="font-inter text-lg opacity-80 mb-8 max-w-2xl mx-auto">
                    We are here to help you plan your perfect stay. Reach out to our concierge team.
                </p>
                <Link
                    href="/#contact"
                    className="inline-flex items-center justify-center font-medium transition-all duration-300 ease-premium rounded-subtle h-11 px-8 text-sm border border-white text-white hover:bg-white hover:text-[var(--color-aegean-blue)]"
                >
                    Contact Us
                </Link>

                {/* Refined Separator */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[var(--color-accent-gold)] to-transparent opacity-60" />
            </Container>
        </section>
    );
}
