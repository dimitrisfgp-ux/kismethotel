"use client";

import { ContactRequest } from "@/types";
import { RequestsMobileCard } from "./RequestsMobileCard";

interface RequestsMobileListProps {
    requests: ContactRequest[];
    onViewDetails: (request: ContactRequest) => void;
    onApprove: (requestId: string, e: React.MouseEvent) => void;
    onDiscard: (requestId: string, e: React.MouseEvent) => void;
}

export function RequestsMobileList({
    requests,
    onViewDetails,
    onApprove,
    onDiscard
}: RequestsMobileListProps) {
    return (
        <div className="md:hidden space-y-3 p-2 bg-[var(--color-warm-white)]/30">
            {requests.map((request) => (
                <RequestsMobileCard
                    key={request.id}
                    request={request}
                    onViewDetails={() => onViewDetails(request)}
                    onApprove={(e) => onApprove(request.id, e)}
                    onDiscard={(e) => onDiscard(request.id, e)}
                />
            ))}
        </div>
    );
}
