import { format } from "date-fns";

/**
 * Formats a date string for display in the UI.
 * Uses European format dd/MM/yy (e.g. 31/12/24) appropriate for Greece.
 */
export function formatDate(date: Date): string {
    return format(date, "dd/MM/yy");
}
