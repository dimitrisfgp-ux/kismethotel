import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
    title: string;
    subtitle?: string;
    dark?: boolean;
    align?: 'left' | 'center' | 'right';
}

export function SectionHeading({ title, subtitle, dark = false, align = 'center', className, ...props }: SectionHeadingProps) {
    return (
        <div className={cn("mb-[var(--space-lg)]", align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left', className)}>
            <h2
                className={cn(
                    "font-montserrat font-semibold uppercase tracking-[0.15em] text-[length:var(--font-h2)] mb-4",
                    dark ? "text-[var(--color-white)]" : "text-[var(--color-charcoal)]"
                )}
                {...props}
            >
                {title}
            </h2>
            {subtitle && (
                <p className={cn(
                    "font-inter text-[length:var(--font-body)] max-w-2xl mx-auto opacity-80",
                    dark ? "text-[var(--color-white)]" : "text-[var(--color-charcoal)]"
                )}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}
