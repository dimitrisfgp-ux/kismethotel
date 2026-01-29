import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-[var(--radius-subtle)] bg-[var(--color-sand)]/20", className)}
            {...props}
        />
    );
}
