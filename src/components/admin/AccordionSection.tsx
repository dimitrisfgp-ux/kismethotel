'use client';

import { ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapse } from '@/components/ui/Collapse';

interface AccordionSectionProps {
    title: string;
    subtitle?: string;
    defaultOpen?: boolean;
    children: ReactNode;
}

/**
 * Collapsible section panel for the admin homepage editor. Client component so the
 * body can animate open/closed via <Collapse> (the native <details> element can't
 * animate its height on the browsers we target).
 */
export function AccordionSection({ title, subtitle, defaultOpen = false, children }: AccordionSectionProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="rounded-lg border border-[var(--color-sand)] bg-[var(--color-warm-white)]/40 overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full cursor-pointer select-none px-5 py-4 flex items-center justify-between gap-3 hover:bg-white/50 transition-colors text-left"
            >
                <div>
                    <h2 className="text-lg font-bold text-[var(--color-aegean-blue)] font-montserrat">{title}</h2>
                    {subtitle && <p className="text-xs text-[var(--color-charcoal)]/50 mt-0.5">{subtitle}</p>}
                </div>
                <ChevronDown className={cn('h-5 w-5 text-[var(--color-charcoal)]/40 transition-transform shrink-0', open && 'rotate-180')} />
            </button>
            <Collapse open={open}>
                <div className="p-4 pt-0">{children}</div>
            </Collapse>
        </div>
    );
}
