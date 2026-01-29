"use client";

import { FAQ } from "@/types";
import { SectionHeading } from "../ui/SectionHeading";
import { Container } from "../ui/Container";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
    faqs: FAQ[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
    // Determine if we want single or multiple. For grid, single might jump less if rows align.
    const [openId, setOpenId] = useState<number | null>(null);

    return (
        <section className="py-24 bg-[var(--color-warm-white)]">
            <Container fluid> {/* Expanded width for better 3-col text fit */}
                <SectionHeading title="Your Questions Answered" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 items-start">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="bg-white border border-[var(--color-sand)] rounded-[var(--radius-subtle)] overflow-hidden h-full">
                            <button
                                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--color-warm-white)]/50 transition-colors"
                            >
                                <span className={cn(
                                    "font-montserrat font-bold text-sm uppercase tracking-wide pr-4",
                                    openId === faq.id ? "text-[var(--color-aegean-blue)]" : "text-[var(--color-charcoal)]"
                                )}>
                                    {faq.question}
                                </span>
                                {openId === faq.id ? (
                                    <Minus className="h-5 w-5 text-[var(--color-aegean-blue)] shrink-0" />
                                ) : (
                                    <Plus className="h-5 w-5 text-[var(--color-charcoal)] opacity-50 shrink-0" />
                                )}
                            </button>

                            <div className={cn(
                                "transition-all duration-300 ease-in-out overflow-hidden",
                                openId === faq.id ? "max-h-96 opacity-100 border-t border-[var(--color-sand)]" : "max-h-0 opacity-0"
                            )}>
                                <div className="p-6 font-inter text-sm text-[var(--color-charcoal)] opacity-80 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
