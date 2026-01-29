import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'gold' | 'gray' | 'outline';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = 'gold', ...props }, ref) => {
    const variants = {
        gold: 'bg-[var(--color-accent-gold)] text-white',
        gray: 'bg-[var(--color-sand)] text-[var(--color-charcoal)] opacity-70',
        outline: 'border border-[var(--color-sand)] text-[var(--color-charcoal)]'
    };

    return (
        <div
            ref={ref}
            className={cn(
                "inline-flex items-center rounded-[var(--radius-sharp)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
                variants[variant],
                className
            )}
            {...props}
        />
    );
});

Badge.displayName = "Badge";
export { Badge };
