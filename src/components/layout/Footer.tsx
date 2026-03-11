import { Container } from "../ui/Container";
import { ContactForm } from "./ContactForm";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { HotelSettings } from "@/types";
import { LogoBrand } from "../ui/LogoBrand";

interface FooterProps {
    settings: HotelSettings;
}

export function Footer({ settings }: FooterProps) {
    return (
        <footer id="contact" className="bg-[var(--color-aegean-blue)] text-[var(--color-sand)] pt-24 pb-12">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
                    {/* Column 1: Info */}
                    <div className="space-y-8 text-center lg:text-left">
                        <div>
                            <LogoBrand
                                settings={settings}
                                variant="light"
                                size="md"
                                showSubtext={settings.logoMode === 'text'}
                            />
                            {settings.logoMode === 'image' && settings.description && (
                                <p className="font-inter text-white/60 mt-2">{settings.description}</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-center lg:justify-start space-x-3 opacity-80 hover:opacity-100 transition-opacity">
                                <MapPin className="h-5 w-5 text-white" />
                                <span>{settings.contact.address}</span>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start space-x-3 opacity-80 hover:opacity-100 transition-opacity">
                                <Phone className="h-5 w-5 text-white" />
                                <span>{settings.contact.phone}</span>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start space-x-3 opacity-80 hover:opacity-100 transition-opacity">
                                <Mail className="h-5 w-5 text-white" />
                                <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Form */}
                    <div className="bg-white/5 p-8 rounded-[var(--radius-subtle)] border border-white/5">
                        <h3 className="font-montserrat text-white uppercase tracking-widest text-sm mb-6 text-center lg:text-left">Get in Touch</h3>
                        <ContactForm />
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/70 font-inter">
                    <p>© {new Date().getFullYear()} Kismet. All rights reserved.</p>
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

