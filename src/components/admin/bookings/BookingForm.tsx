"use client";

import { RoomSummary } from "@/types";
import { BedDouble, Calendar as CalendarIcon, User, CreditCard, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/priceCalculator";
import { BookingFormData } from "@/hooks/useBookingForm";
import { useRoomAvailability } from "@/hooks/useRoomAvailability";
import { Calendar } from "@/components/ui/Calendar";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { formatLocalDate } from "@/lib/dateUtils";

interface BookingFormProps {
    formData: BookingFormData;
    rooms: RoomSummary[];
    currentUserRole: string;
    startLoading: boolean;
    onChange: (field: keyof BookingFormData, value: any) => void;
    onRoomChange: (roomId: string) => void;
    onCalculatePrice: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export function BookingForm({
    formData,
    rooms,
    currentUserRole,
    startLoading,
    onChange,
    onRoomChange,
    onCalculatePrice,
    onSubmit,
    onCancel
}: BookingFormProps) {
    const canEditPrice = ['admin', 'manager'].includes(currentUserRole);
    const selectedRoom = rooms.find(r => r.id === formData.roomId);

    // Availability Hook
    const { unavailableDates, isLoading: isLoadingAvailability } = useRoomAvailability(formData.roomId);

    // Calendar State
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        formData.checkIn && formData.checkOut
            ? { from: new Date(formData.checkIn), to: new Date(formData.checkOut) }
            : undefined
    );

    // Sync Calendar -> Form Data
    useEffect(() => {
        if (dateRange?.from) {
            onChange("checkIn", formatLocalDate(dateRange.from));
            if (dateRange.to) {
                onChange("checkOut", formatLocalDate(dateRange.to));
            }
        }
    }, [dateRange]);

    // Recalculate price when dates change (and are valid)
    useEffect(() => {
        if (formData.checkIn && formData.checkOut) {
            onCalculatePrice();
        }
    }, [formData.checkIn, formData.checkOut]);


    return (
        <form id="bookingForm" onSubmit={onSubmit} className="space-y-6">
            {/* Section: Room & Dates */}
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
                        <BedDouble className="w-4 h-4" /> Room Selection
                    </label>
                    <select
                        name="roomId"
                        value={formData.roomId}
                        onChange={(e) => onRoomChange(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-aegean-blue)] outline-none"
                    >
                        {rooms.map(room => (
                            <option key={room.id} value={room.id}>
                                {room.name} ({formatCurrency(room.pricePerNight)}/night)
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
                        <CalendarIcon className="w-4 h-4" /> Dates
                    </label>

                    <button
                        type="button"
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className={cn(
                            "w-full p-3 text-left border rounded-lg flex items-center justify-between transition-all",
                            isCalendarOpen ? "ring-2 ring-[var(--color-aegean-blue)] border-transparent" : "border-gray-200 hover:border-gray-300"
                        )}
                    >
                        <span className={!dateRange?.from ? "text-gray-400" : "text-gray-900"}>
                            {dateRange?.from ? (
                                <>
                                    {format(dateRange.from, "PPP")}
                                    {dateRange.to ? ` - ${format(dateRange.to, "PPP")}` : ""}
                                </>
                            ) : (
                                "Select Check-in and Check-out dates"
                            )}
                        </span>
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </button>

                    {isCalendarOpen && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative animate-in fade-in zoom-in-95 duration-200">
                            {isLoadingAvailability && (
                                <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-lg">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-aegean-blue)]"></div>
                                        <span className="text-xs text-[var(--color-aegean-blue)] font-medium">Checking availability...</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                <Calendar
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={1}
                                    disabled={unavailableDates}
                                    className="p-0 calendar-light"
                                />
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t pts-4 text-xs text-gray-500 pt-2">
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-100 border border-red-200" /> Booked</div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-100 border border-gray-200" /> Blocked</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsCalendarOpen(false)}
                                    className="text-[var(--color-aegean-blue)] font-bold hover:underline"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section: Guest Details */}
            <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
                    <User className="w-4 h-4" /> Guest Information
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="guestName"
                        placeholder="Full Name"
                        required
                        value={formData.guestName}
                        onChange={(e) => onChange("guestName", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[var(--color-aegean-blue)]"
                    />
                    <input
                        name="guestEmail"
                        type="email"
                        placeholder="Email Address"
                        required
                        value={formData.guestEmail}
                        onChange={(e) => onChange("guestEmail", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[var(--color-aegean-blue)]"
                    />
                    <input
                        name="guestPhone"
                        type="tel"
                        placeholder="Phone Number (Optional)"
                        value={formData.guestPhone}
                        onChange={(e) => onChange("guestPhone", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[var(--color-aegean-blue)]"
                    />
                    <div>
                        <input
                            name="guestsCount"
                            type="number"
                            min="1"
                            max={selectedRoom?.maxOccupancy || 4}
                            placeholder="Guests"
                            required
                            value={formData.guestsCount}
                            onChange={(e) => onChange("guestsCount", Number(e.target.value))}
                            className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[var(--color-aegean-blue)]"
                        />
                        <span className="text-[10px] text-gray-400 ml-1">Max: {selectedRoom?.maxOccupancy}</span>
                    </div>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Section: Payment & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
                        <CreditCard className="w-4 h-4" /> Total Price (€)
                    </label>
                    <input
                        name="totalPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={formData.totalPrice}
                        onChange={(e) => onChange("totalPrice", Number(e.target.value))}
                        readOnly={!canEditPrice}
                        className={`w-full p-3 border border-gray-200 rounded-lg outline-none 
                            ${canEditPrice ? 'focus:border-[var(--color-aegean-blue)] bg-white' : 'bg-gray-100 cursor-not-allowed text-gray-500'}`}
                    />
                    {!canEditPrice && <span className="text-[10px] text-orange-500">Only Admins/Managers can override price.</span>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Booking Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={(e) => onChange("status", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[var(--color-aegean-blue)]"
                    >
                        <option value="confirmed">Confirmed</option>
                        <option value="held">Held (Pending)</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Footer Buttons invoked here or by parent */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-200 transition-colors"
                    disabled={startLoading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={startLoading || isLoadingAvailability}
                    className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-[var(--color-aegean-blue)] hover:bg-[#0fd0d6] hover:text-[var(--color-aegean-blue)] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {startLoading && <span className="animate-spin">⏳</span>}
                    Create Booking
                </button>
            </div>
        </form>
    );
}
