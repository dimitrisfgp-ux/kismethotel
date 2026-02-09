/**
 * Shared constants for request-related labels and styling
 * Used by RequestsTable and RequestDetailsModal
 */

export const SUBJECT_LABELS: Record<string, string> = {
    general: "General Inquiry",
    reschedule: "Reschedule Request",
    cancellation: "Cancellation Request"
};

export const SUBJECT_COLORS: Record<string, string> = {
    general: "bg-blue-100 text-blue-700 border-blue-200",
    reschedule: "bg-amber-100 text-amber-700 border-amber-200",
    cancellation: "bg-red-100 text-red-700 border-red-200"
};

// Short labels for table views
export const SUBJECT_LABELS_SHORT: Record<string, string> = {
    general: "General",
    reschedule: "Reschedule",
    cancellation: "Cancellation"
};
