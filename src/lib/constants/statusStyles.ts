/**
 * Shared constants for status badge styling
 * Used across admin components (Bookings, Requests)
 */

// Booking status styles
export const BOOKING_STATUS_COLORS: Record<string, string> = {
    confirmed: "bg-green-100 text-green-700 border-green-200",
    active: "bg-blue-100 text-blue-700 border-blue-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    completed: "bg-gray-100 text-gray-600 border-gray-200"
};

// Request status styles
export const REQUEST_STATUS_COLORS: Record<string, string> = {
    approved: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    discarded: "bg-gray-100 text-gray-600 border-gray-200"
};

// Helper to get status color with fallback
export function getStatusColor(status: string, type: 'booking' | 'request' = 'booking'): string {
    const colors = type === 'booking' ? BOOKING_STATUS_COLORS : REQUEST_STATUS_COLORS;
    return colors[status] || "bg-gray-100 text-gray-600 border-gray-200";
}

// Helper to get display label for booking status (capitalised)
export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        confirmed: 'Confirmed',
        active: 'Active',
        pending: 'Pending',
        cancelled: 'Cancelled',
        completed: 'Completed'
    };
    return labels[status] || status;
}
