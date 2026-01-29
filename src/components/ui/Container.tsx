import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    fluid?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(({ className, fluid = false, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "w-full mx-auto px-4 md:px-8",
                !fluid && "max-w-[var(--container-max)]",
                className
            )}
            {...props}
        />
    );
});

Container.displayName = "Container";
export { Container };
