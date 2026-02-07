import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: LucideIcon;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    className, label, error, icon: Icon, ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1.5 pl-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal)]/50 pointer-events-none">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "flex h-11 w-full rounded-[var(--radius-subtle)] border border-[var(--color-sand)] bg-white px-3 py-2 text-sm placeholder:text-[var(--color-charcoal)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--color-aegean-blue)] focus:border-[var(--color-aegean-blue)] disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
                        Icon && "pl-9", // Add padding if icon exists
                        error && "border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-xs text-[var(--color-error)]">{error}</p>
            )}
        </div>
    );
});

Input.displayName = "Input";
export { Input };
