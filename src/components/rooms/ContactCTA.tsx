import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import Link from "next/link";

export function ContactCTA() {
    return (
        <section className="bg-[var(--color-aegean-blue)] text-white py-20 text-center">
            <Container>
                <h2 className="font-montserrat text-3xl font-bold uppercase tracking-widest mb-4">Still have questions?</h2>
                <p className="font-inter text-lg opacity-80 mb-8 max-w-2xl mx-auto">
                    We are here to help you plan your perfect stay. Reach out to our concierge team.
                </p>
                <Link href="/#contact">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--color-aegean-blue)]">
                        Contact Us
                    </Button>
                </Link>
            </Container>
        </section>
    );
}
