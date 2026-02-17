"use client";

import { useState } from "react";
import { RequestSubject, Booking, ContactRequest } from "@/types";
import { DateRange } from "react-day-picker";
import { format, eachDayOfInterval, isSameDay } from "date-fns";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Calendar } from "../ui/Calendar";
import { Search, Loader2, Check, Calendar as CalendarIcon } from "lucide-react";
import { getBookingByIdAction, getRoomAvailabilityAction } from "@/app/actions/bookings";
import { submitContactRequestAction } from "@/app/actions/request";
import { TIMEZONE_DISCLAIMER } from "@/lib/constants";
import { formatLocalDate } from "@/lib/dateUtils";
import { useToast } from "@/contexts/ToastContext";

const SUBJECTS: { value: RequestSubject; label: string }[] = [
    { value: "general", label: "General Question" },
    { value: "reschedule", label: "Booking Reschedule" },
    { value: "cancellation", label: "Booking Cancellation" }
];

interface UnavailableDate {
    from: string;
    to: string;
    type: 'booked' | 'blocked';
}

import { useRoomAvailability } from "@/hooks/useRoomAvailability";

export function ContactForm() {
    const [subject, setSubject] = useState<RequestSubject>("general");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [bookingId, setBookingId] = useState("");
    const [newDateRange, setNewDateRange] = useState<DateRange | undefined>();
    const [linkedBooking, setLinkedBooking] = useState<Booking | null>(null);
    const [isLookingUp, setIsLookingUp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lookupError, setLookupError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const { showToast } = useToast();

    // Centralized Availability Hook
    const { unavailableDates: rawUnavailableDates, isLoading: isLoadingAvailability } = useRoomAvailability(linkedBooking?.roomId);

    // Filter out the current user's booking dates (so they can pick them for rescheduling if needed, though usually they pick NEW dates)
    // Actually, usually you want to see that your OLD dates are "booked" (by you). 
    // But if you are moving dates, you care about the TARGET dates.
    // The previous logic was: "Exclude the current booking's dates from unavailable"
    // This allows them to click their OWN dates.
    const unavailableDates = rawUnavailableDates.filter(range => {
        if (!linkedBooking) return true;
        // Check if this range matches the current booking exactly
        // We use string comparison on dates
        const rangeFrom = formatLocalDate(range.from);
        const rangeTo = formatLocalDate(range.to);
        return !(rangeFrom === linkedBooking.checkIn && rangeTo === linkedBooking.checkOut);
    });

    const requiresBookingId = subject === "reschedule" || subject === "cancellation";
    const requiresNewDates = subject === "reschedule";

    // Convert unavailable date ranges to individual disabled dates for calendar
    const disabledDates = unavailableDates.flatMap(range => {
        const start = range.from; // Hook returns Date objects
        const end = range.to;
        return eachDayOfInterval({ start, end });
    });

    // Also disable past dates
    const isDateDisabled = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return true;
        return disabledDates.some(d => isSameDay(d, date));
    };

    const lookupBooking = async () => {
        if (!bookingId.trim()) return;
        setIsLookingUp(true);
        setLookupError("");

        try {
            const booking = await getBookingByIdAction(bookingId.trim());
            if (booking) {
                setLinkedBooking(booking);
                setName(booking.guestName);
                setEmail(booking.guestEmail);
                setPhone(booking.guestPhone || "");
                // Availability fetching is now handled by the hook reactive to `linkedBooking`
            } else {
                setLookupError("Booking not found. Please check the ID.");
                setLinkedBooking(null);
            }
        } catch (err) {
            console.error(err);
            setLookupError("Error searching for booking.");
            setLinkedBooking(null);
        } finally {
            setIsLookingUp(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;
        if (requiresBookingId && !linkedBooking) return;
        if (requiresNewDates && (!newDateRange?.from || !newDateRange?.to)) return;

        setIsSubmitting(true);

        const request: ContactRequest = {
            id: crypto.randomUUID(),
            subject,
            name,
            email,
            phone: phone || undefined,
            message,
            bookingId: linkedBooking?.id,
            newCheckIn: requiresNewDates && newDateRange?.from ? formatLocalDate(newDateRange.from) : undefined,
            newCheckOut: requiresNewDates && newDateRange?.to ? formatLocalDate(newDateRange.to) : undefined,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        try {
            await submitContactRequestAction(request);
            setSubmitted(true);
        } catch (error: any) {
            console.error("Submission error:", error);
            // Extract meaningful message if possible
            const msg = error.message?.includes("invalid input syntax for type uuid")
                ? "Invalid Booking ID format. Please check your Booking ID."
                : (error.message || "Failed to submit request. Please try again.");

            // Assuming useToast is available in scope (it is not used in original code? let me check imports)
            // Original code imports useToast but didn't use it in handleSubmit?
            // Actually line 20: const { showToast } = useToast(); IS MISSING in the view I saw?
            // Let me check lines 1-40 of ContactForm.tsx in previous view.
            // Ah, line 1-308 view showed: 
            // 28: export function ContactForm() {
            // 29:     const [subject, setSubject] = useState...
            // It does NOT have useToast hook usage! 
            // But line 8 imports useToast? NO.
            // Line 8: import { Input } from "../ui/Input";
            // Line 12: import { submitContactRequestAction } ...
            // No useToast import in the file content I saw Step 23233.
            showToast(msg, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setSubject("general");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setBookingId("");
        setNewDateRange(undefined);
        setLinkedBooking(null);
        setSubmitted(false);
        setIsDatePickerOpen(false);
    };

    if (submitted) {
        return (
            <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Request Submitted!</h3>
                <p className="text-white/60 text-sm">We&apos;ll review your request and get back to you soon.</p>
                <button
                    onClick={resetForm}
                    className="text-white/80 hover:text-white underline text-sm"
                >
                    Submit another request
                </button>
            </div>
        );
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Subject Selector */}
            <div>
                <label htmlFor="contact-subject" className="block text-xs font-bold uppercase tracking-widest mb-2 text-white/60">Subject</label>
                <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => {
                        setSubject(e.target.value as RequestSubject);
                        setLinkedBooking(null);
                        setBookingId("");
                        setNewDateRange(undefined);
                    }}
                    className="w-full h-11 rounded-[var(--radius-subtle)] border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                >
                    {SUBJECTS.map((s) => (
                        <option key={s.value} value={s.value} className="text-[var(--color-charcoal)]">
                            {s.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Booking ID (for reschedule/cancellation) */}
            {requiresBookingId && (
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-white/60">Booking ID</label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter your booking ID"
                            value={bookingId}
                            onChange={(e) => setBookingId(e.target.value)}
                            className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white focus:ring-white"
                        />
                        <button
                            type="button"
                            onClick={lookupBooking}
                            disabled={isLookingUp || !bookingId.trim()}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-[var(--radius-subtle)] transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLookingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            Lookup
                        </button>
                    </div>
                    {lookupError && (
                        <p className="text-red-400 text-xs">{lookupError}</p>
                    )}
                    {linkedBooking && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-md p-3 text-sm text-white/80">
                            <Check className="h-4 w-4 inline mr-2 text-green-400" />
                            Booking found: {linkedBooking.guestName} ({format(new Date(linkedBooking.checkIn), "MMM d")} - {format(new Date(linkedBooking.checkOut), "MMM d, yyyy")})
                        </div>
                    )}
                </div>
            )}

            {/* Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    placeholder="NAME"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white focus:ring-white"
                    required
                />
                <Input
                    placeholder="EMAIL"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white focus:ring-white"
                    required
                />
            </div>

            <Input
                placeholder="PHONE (Optional)"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white focus:ring-white"
            />

            {/* New Dates (for reschedule) */}
            {requiresNewDates && linkedBooking && (
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-white/60">New Dates</label>
                    <button
                        type="button"
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        className="w-full h-11 flex items-center justify-between rounded-[var(--radius-subtle)] border border-white/20 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            {newDateRange?.from && newDateRange?.to
                                ? `${format(newDateRange.from, "MMM d")} – ${format(newDateRange.to, "MMM d, yyyy")}`
                                : "Select new check-in and check-out dates"
                            }
                        </span>
                    </button>
                    {isDatePickerOpen && (
                        <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                            <Calendar
                                mode="range"
                                selected={newDateRange}
                                onSelect={setNewDateRange}
                                numberOfMonths={1}
                                className="calendar-dark"
                                disabled={isDateDisabled}
                            />
                            <div className="flex justify-between items-center mt-3">
                                <p className="text-[10px] text-white/50">
                                    {TIMEZONE_DISCLAIMER}
                                </p>
                                {newDateRange?.from && newDateRange?.to && (
                                    <button
                                        type="button"
                                        onClick={() => setIsDatePickerOpen(false)}
                                        className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded transition-colors"
                                    >
                                        Done
                                    </button>
                                )}
                            </div>
                            {unavailableDates.length > 0 && (
                                <p className="text-[10px] text-amber-400/80 mt-2">
                                    ⚠ Gray dates are already booked or blocked
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            <textarea
                className="flex w-full rounded-[var(--radius-subtle)] border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white focus:border-white disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
                placeholder="MESSAGE"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <Button
                type="submit"
                variant="primary"
                className="w-full bg-white text-[var(--color-charcoal)] hover:bg-[var(--color-warm-white)]"
                isLoading={isSubmitting}
                disabled={
                    !name || !email ||
                    (requiresBookingId && !linkedBooking) ||
                    (requiresNewDates && (!newDateRange?.from || !newDateRange?.to))
                }
            >
                {subject === "general" ? "Send Message" :
                    subject === "reschedule" ? "Request Reschedule" :
                        "Request Cancellation"}
            </Button>
        </form>
    );
}
