import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
    return (
        <div className="pt-[var(--header-height)] min-h-screen flex items-center bg-[var(--color-warm-white)]">
            <Container className="text-center">
                <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] mb-8 animate-zoom-in">
                    <CheckCircle className="h-12 w-12" />
                </div>

                <h1 className="font-montserrat text-4xl font-bold uppercase tracking-widest mb-4 animate-slide-up">Booking Confirmed</h1>

                <p className="font-inter text-lg opacity-60 mb-12 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
                    Thank you for choosing Kismet. A confirmation email has been sent to you. We look forward to welcoming you to Crete.
                </p>

                <Link href="/" className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <Button size="lg">Return Home</Button>
                </Link>
            </Container>
        </div>
    );
}
