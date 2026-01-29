import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={cn(
                "flex h-11 w-full rounded-[var(--radius-subtle)] border border-[var(--color-sand)] bg-white px-3 py-2 text-sm placeholder:text-[var(--color-charcoal)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--color-aegean-blue)] focus:border-[var(--color-aegean-blue)] disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
                error && "border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]",
                className
            )}
            {...props}
        />
    );
});

Input.displayName = "Input";
export { Input };
