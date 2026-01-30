import { Container } from "../ui/Container";
import { ContactForm } from "./ContactForm";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer id="contact" className="bg-[var(--color-charcoal)] text-[var(--color-sand)] pt-[var(--space-2xl)] pb-[var(--space-lg)]">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
                    {/* Column 1: Info */}
                    <div className="space-y-8 text-center lg:text-left">
                        <div>
                            <h3 className="font-montserrat text-3xl font-bold uppercase tracking-widest text-white mb-2">Kismet</h3>
                            <p className="font-inter text-white/60">Boutique Accommodations</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-center lg:justify-start space-x-3 opacity-80 hover:opacity-100 transition-opacity">
                                <MapPin className="h-5 w-5 text-white" />
                                <span>Agios Nikolaos, Crete, Greece</span>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start space-x-3 opacity-80 hover:opacity-100 transition-opacity">
                                <Phone className="h-5 w-5 text-white" />
                                <span>+30 2810 123 456</span>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start space-x-3 opacity-80 hover:opacity-100 transition-opacity">
                                <Mail className="h-5 w-5 text-white" />
                                <a href="mailto:stay@kismethotel.com">stay@kismethotel.com</a>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Form */}
                    <div className="bg-white/5 p-8 rounded-[var(--radius-subtle)] border border-white/5">
                        <h4 className="font-montserrat text-white uppercase tracking-widest text-sm mb-6 text-center lg:text-left">Get in Touch</h4>
                        <ContactForm />
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/70 font-inter">
                    <p>© {new Date().getFullYear()} Kismet Hotel. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </Container >
        </footer >
    );
}
