"use client";

import { ContactRequest, Booking } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import { Eye, Check, X } from "lucide-react";
import { SUBJECT_LABELS_SHORT, SUBJECT_COLORS } from "@/lib/constants/requestStyles";
import { REQUEST_STATUS_COLORS } from "@/lib/constants/statusStyles";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/admin/Table";
import { AdminActionButton } from "@/components/ui/admin/AdminActionButton";
import { usePermission } from "@/contexts/PermissionContext";

interface RequestsDesktopTableProps {
    requests: ContactRequest[];
    bookings: Booking[];
    onViewDetails: (request: ContactRequest) => void;
    onApprove: (requestId: string, e: React.MouseEvent) => void;
    onDiscard: (requestId: string, e: React.MouseEvent) => void;
}

export function RequestsDesktopTable({
    requests,
    onViewDetails,
    onApprove,
    onDiscard
}: RequestsDesktopTableProps) {
    const { can } = usePermission();

    return (
        <div className="hidden md:block">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.map((request) => (
                        <TableRow
                            key={request.id}
                            className="cursor-pointer"
                            onClick={() => onViewDetails(request)}
                        >
                            <TableCell>
                                <Badge variant="outline" className={SUBJECT_COLORS[request.subject]}>
                                    {SUBJECT_LABELS_SHORT[request.subject]}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="font-bold text-[var(--color-aegean-blue)]">{request.name}</div>
                                <div className="text-xs text-[var(--color-charcoal)]/60">{request.email}</div>
                            </TableCell>
                            <TableCell>
                                {request.bookingId ? (
                                    <code className="text-xs font-mono text-[var(--color-charcoal)]/70 bg-[var(--color-warm-white)] px-1.5 py-0.5 rounded">
                                        {request.bookingId.slice(0, 8)}...
                                    </code>
                                ) : (
                                    <span className="text-[var(--color-charcoal)]/40 italic">—</span>
                                )}
                            </TableCell>
                            <TableCell className="text-[var(--color-charcoal)]/70">
                                {format(new Date(request.createdAt), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={REQUEST_STATUS_COLORS[request.status]}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end items-center gap-2">
                                    <AdminActionButton
                                        icon={Eye}
                                        onClick={(e) => { e.stopPropagation(); onViewDetails(request); }}
                                        tooltip="View Details"
                                        variant="secondary"
                                    />
                                    {(request.status === 'pending' && can('requests.manage')) && (
                                        <>
                                            <AdminActionButton
                                                icon={Check}
                                                onClick={(e) => onApprove(request.id, e)}
                                                tooltip="Approve Request"
                                                variant="success"
                                            />
                                            <AdminActionButton
                                                icon={X}
                                                onClick={(e) => onDiscard(request.id, e)}
                                                tooltip="Discard Request"
                                                variant="destructive"
                                            />
                                        </>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
