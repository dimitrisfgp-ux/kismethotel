import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSectionHeaderProps {
    icon: LucideIcon;
    title: string;
    children?: React.ReactNode;
    className?: string;
}

export function FilterSectionHeader({ icon: Icon, title, children, className }: FilterSectionHeaderProps) {
    return (
        <div className={cn("flex justify-between items-center mb-4", className)}>
            <label className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                <Icon className="w-4 h-4 text-[var(--color-accent-gold)]" />
                {title}
            </label>
            {children && (
                <div className="text-xs font-inter text-white font-bold">
                    {children}
                </div>
            )}
        </div>
    );
}
