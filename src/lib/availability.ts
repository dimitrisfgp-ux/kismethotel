import { DateRange } from "react-day-picker";
import { isWithinInterval, parseISO } from "date-fns";

// Mock unavailable ranges format
export interface UnavailableRange {
    start: Date;
    end: Date;
}

export function isDateAvailable(date: Date, unavailableRanges: UnavailableRange[]): boolean {
    return !unavailableRanges.some(range =>
        isWithinInterval(date, { start: range.start, end: range.end })
    );
}
