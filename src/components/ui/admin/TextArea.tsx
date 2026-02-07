import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
    className, label, error, ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1.5 pl-1">
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                className={cn(
                    "flex min-h-[120px] w-full rounded-[var(--radius-subtle)] border border-[var(--color-sand)] bg-white px-3 py-2 text-sm placeholder:text-[var(--color-charcoal)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--color-aegean-blue)] focus:border-[var(--color-aegean-blue)] disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200 resize-y",
                    error && "border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-[var(--color-error)]">{error}</p>
            )}
        </div>
    );
});

TextArea.displayName = "TextArea";
export { TextArea };
