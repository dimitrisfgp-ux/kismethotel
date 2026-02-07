import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { label: string; value: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    className, label, error, options, ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1.5 pl-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    ref={ref}
                    className={cn(
                        "flex h-11 w-full appearance-none rounded-[var(--radius-subtle)] border border-[var(--color-sand)] bg-white px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-aegean-blue)] focus:border-[var(--color-aegean-blue)] disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
                        error && "border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]",
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>
            {error && (
                <p className="mt-1 text-xs text-[var(--color-error)]">{error}</p>
            )}
        </div>
    );
});

Select.displayName = "Select";
export { Select };
