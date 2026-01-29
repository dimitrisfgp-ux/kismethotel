"use client";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function ContactForm() {
    return (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="NAME" className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white focus:ring-white" />
                <Input placeholder="EMAIL" type="email" className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white focus:ring-white" />
            </div>
            <textarea
                className="flex w-full rounded-[var(--radius-subtle)] border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white focus:border-white disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
                placeholder="MESSAGE"
            />
            <Button variant="primary" className="w-full bg-white text-[var(--color-charcoal)] hover:bg-[var(--color-warm-white)]">
                Send Message
            </Button>
        </form>
    );
}
