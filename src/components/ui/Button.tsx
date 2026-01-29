import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 ease-premium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--color-aegean-blue)] focus:ring-offset-2 rounded-subtle';

    const variants = {
        primary: 'bg-[var(--color-aegean-blue)] text-white uppercase tracking-[0.08em] hover:bg-[var(--color-deep-med)] hover:translate-y-[-2px] hover:shadow-[var(--shadow-hover)]',
        secondary: 'bg-[var(--color-sand)] text-[var(--color-charcoal)] hover:bg-[var(--color-sand)]/80',
        outline: 'bg-transparent border border-[var(--color-aegean-blue)] text-[var(--color-aegean-blue)] hover:bg-[var(--color-aegean-blue)] hover:text-white',
        ghost: 'bg-transparent text-[var(--color-charcoal)] hover:bg-[var(--color-sand)]/20'
    };

    const sizes = {
        sm: 'h-9 px-4 text-xs',
        md: 'h-11 px-8 text-sm',
        lg: 'h-14 px-10 text-base'
    };

    return (
        <button
            ref={ref}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = "Button";
export { Button };
