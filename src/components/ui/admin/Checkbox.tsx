import { InputHTMLAttributes, forwardRef } from 'react';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
    className: _className, label, ...props
}, ref) => {
    return (
        <label className="flex items-center space-x-3 cursor-pointer group">
            <input
                type="checkbox"
                ref={ref}
                className="peer h-5 w-5 rounded-md border-gray-300 text-[var(--color-aegean-blue)] focus:ring-[var(--color-aegean-blue)]"
                {...props}
            />
            {label && (
                <span className="text-sm font-medium text-[var(--color-charcoal)] group-hover:text-[var(--color-aegean-blue)] transition-colors">
                    {label}
                </span>
            )}
        </label>
    );
});

Checkbox.displayName = "Checkbox";
export { Checkbox };
