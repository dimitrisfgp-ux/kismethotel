"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

const TooltipContext = React.createContext<{
    isVisible: boolean;
    setVisible: (v: boolean) => void;
}>({
    isVisible: false,
    setVisible: () => { },
});

const Tooltip = ({ children, delayDuration = 0 }: { children: React.ReactNode; delayDuration?: number }) => {
    const [isVisible, setVisible] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout>(null);

    const show = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setVisible(true), delayDuration);
    };

    const hide = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setVisible(false);
    };

    return (
        <TooltipContext.Provider value={{ isVisible, setVisible }}>
            <div
                className="relative inline-block"
                onMouseEnter={show}
                onMouseLeave={hide}
                onFocus={show}
                onBlur={hide}
            >
                {children}
            </div>
        </TooltipContext.Provider>
    );
};

const TooltipTrigger = React.forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, asChild, ...props }, ref) => {
    if (asChild) {
        // If asChild is true, we clone the child element and pass the props
        const child = React.Children.only(children) as React.ReactElement<any>;
        return React.cloneElement(child, {
            ref,
            className: cn(child.props.className, className),
            ...props,
            ...child.props
        });
    }

    return (
        <button ref={ref} className={className} {...props}>
            {children}
        </button>
    );
});
TooltipTrigger.displayName = "TooltipTrigger";

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
    sideOffset?: number;
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
    ({ className, sideOffset = 4, ...props }, ref) => {
        const { isVisible } = React.useContext(TooltipContext);

        if (!isVisible) return null;

        return (
            <div
                ref={ref}
                className={cn(
                    "absolute z-50 overflow-hidden rounded-md border bg-[var(--color-charcoal)] px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 top-[calc(100%+4px)] left-1/2 -translate-x-1/2 whitespace-nowrap",
                    className
                )}
                style={{
                    top: `calc(100% + ${sideOffset}px)`
                }}
                {...props}
            />
        );
    });
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
