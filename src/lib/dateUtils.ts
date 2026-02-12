import { format } from "date-fns";

/**
 * Formats a date string for display in the UI.
 * Uses European format dd/MM/yy (e.g. 31/12/24) appropriate for Greece.
 */
export function formatDate(date: Date): string {
    return format(date, "dd/MM/yy");
}

/**
 * Format a Date as a local YYYY-MM-DD string for database storage.
 *
 * Why: `Date.toISOString()` converts to UTC, shifting dates backward
 * in UTC+ timezones (Greece UTC+2/3). A user selecting March 19 at
 * midnight local time gets "2026-03-18T22:00:00Z" → "2026-03-18".
 *
 * This uses local date parts so the string matches the calendar selection.
 */
export function formatLocalDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
