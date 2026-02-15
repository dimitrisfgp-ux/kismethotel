import { Button } from "@/components/ui/Button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdminActionButtonProps {
    onClick: (e: React.MouseEvent) => void;
    icon: LucideIcon;
    variant?: 'primary' | 'secondary' | 'destructive' | 'success';
    tooltip?: string;
    className?: string;
    disabled?: boolean;
}

export function AdminActionButton({
    onClick,
    icon: Icon,
    variant = 'secondary',
    tooltip,
    className,
    disabled
}: AdminActionButtonProps) {

    // Map internal variants to Button standard variants or custom styles
    const getVariantStyles = () => {
        switch (variant) {
            case 'destructive':
                return "text-red-400 hover:text-red-600 hover:bg-red-50 border-transparent hover:border-red-100";
            case 'success':
                return "text-green-600 hover:text-green-700 hover:bg-green-50 border-transparent hover:border-green-100";
            case 'secondary':
                // Aegean blue style (Edit/View)
                return "text-[var(--color-aegean-blue)] hover:bg-[var(--color-aegean-blue)]/10 border-transparent hover:border-[var(--color-aegean-blue)]/20";
            default:
                return "text-gray-500 hover:text-gray-700 hover:bg-gray-100";
        }
    };

    const button = (
        <Button
            variant="outline"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "h-8 w-8 p-0 transition-colors duration-200",
                getVariantStyles(),
                className
            )}
        >
            <Icon className="h-4 w-4" />
        </Button>
    );

    if (tooltip) {
        return (
            <TooltipProvider>
                <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                        {button}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return button;
}
