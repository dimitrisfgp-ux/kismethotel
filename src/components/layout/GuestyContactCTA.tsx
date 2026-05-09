import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "lucide-react";
import { GUESTY_CONTACT_URL } from "@/config/guestyMode";

/**
 * Replaces the internal ContactForm in the Footer when the site runs in
 * Guesty mode. Sends visitors to the Guesty/Hotelyzer-hosted contact page,
 * where the property's team handles incoming requests directly.
 */
export function GuestyContactCTA() {
    return (
        <div className="flex flex-col h-full justify-center text-center lg:text-left">
            <h3 className="font-montserrat text-white uppercase tracking-widest text-sm mb-4">
                Get in Touch
            </h3>
            <p className="font-inter text-white/70 leading-relaxed mb-8">
                Questions about your stay, a current booking, or anything else?
                Our team is happy to help via our hosted contact page.
            </p>
            <a
                href={GUESTY_CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block self-center lg:self-start"
            >
                <Button size="lg" className="min-w-[200px]">
                    <span className="inline-flex items-center gap-2">
                        Contact Us
                        <ArrowUpRight className="h-4 w-4" />
                    </span>
                </Button>
            </a>
        </div>
    );
}
