"use client";

import { ContactRequest } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { MessageSquare, Calendar, XCircle } from "lucide-react";

interface RequestBadgeProps {
    requests: ContactRequest[];
    onClick: () => void;
}

const ICONS: Record<string, React.ElementType> = {
    general: MessageSquare,
    reschedule: Calendar,
    cancellation: XCircle
};

const COLORS: Record<string, string> = {
    general: "bg-blue-100 text-blue-700 border-blue-200",
    reschedule: "bg-amber-100 text-amber-700 border-amber-200",
    cancellation: "bg-red-100 text-red-700 border-red-200"
};

export function RequestBadge({ requests, onClick }: RequestBadgeProps) {
    if (requests.length === 0) return null;

    // Show only pending requests
    const pendingRequests = requests.filter(r => r.status === "pending");
    if (pendingRequests.length === 0) return null;

    // Get the most urgent request type (cancellation > reschedule > general)
    const priority = ["cancellation", "reschedule", "general"];
    const topRequest = pendingRequests.sort((a, b) =>
        priority.indexOf(a.subject) - priority.indexOf(b.subject)
    )[0];

    const Icon = ICONS[topRequest.subject] || MessageSquare;
    const colorClass = COLORS[topRequest.subject] || COLORS.general;

    return (
        <button
            onClick={onClick}
            className="group"
            title={`${pendingRequests.length} pending request(s)`}
        >
            <Badge
                variant="outline"
                className={`${colorClass} cursor-pointer group-hover:ring-2 ring-offset-1 ring-[var(--color-aegean-blue)]/20 transition-all flex items-center gap-1`}
            >
                <Icon className="h-3 w-3" />
                <span className="capitalize">{topRequest.subject}</span>
                {pendingRequests.length > 1 && (
                    <span className="ml-0.5 text-[10px] opacity-70">+{pendingRequests.length - 1}</span>
                )}
            </Badge>
        </button>
    );
}
