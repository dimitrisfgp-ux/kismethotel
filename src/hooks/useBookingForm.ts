import { useState, useEffect } from "react";
import { BookingStatus, RoomSummary } from "@/types";
import { calculateBookingTotal } from "@/lib/priceCalculator";

export interface BookingFormData {
    roomId: string;
    checkIn: string;
    checkOut: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guestsCount: number;
    totalPrice: number;
    status: BookingStatus;
    notes: string;
}

const INITIAL_STATE: BookingFormData = {
    roomId: "",
    checkIn: "",
    checkOut: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestsCount: 2,
    totalPrice: 0,
    status: "confirmed",
    notes: ""
};

export function useBookingForm(rooms: RoomSummary[], initialData?: Partial<BookingFormData>) {
    const [formData, setFormData] = useState<BookingFormData>({ ...INITIAL_STATE, ...initialData });

    // Auto-select first room if none selected
    useEffect(() => {
        if (!formData.roomId && rooms.length > 0) {
            setFormData(prev => ({ ...prev, roomId: rooms[0].id }));
        }
    }, [rooms, formData.roomId]);

    const updateField = (field: keyof BookingFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRoomChange = (roomId: string) => {
        setFormData(prev => {
            const newData = { ...prev, roomId };
            // Recalculate price if dates exist
            if (prev.checkIn && prev.checkOut) {
                const room = rooms.find(r => r.id === roomId);
                if (room) {
                    newData.totalPrice = calculateBookingTotal(prev.checkIn, prev.checkOut, room.pricePerNight);
                }
            }
            return newData;
        });
    };

    const calculatePrice = () => {
        const room = rooms.find(r => r.id === formData.roomId);
        if (room && formData.checkIn && formData.checkOut) {
            const total = calculateBookingTotal(formData.checkIn, formData.checkOut, room.pricePerNight);
            if (total > 0) {
                updateField("totalPrice", total);
            }
        }
    };

    return {
        formData,
        updateField,
        handleRoomChange,
        calculatePrice,
        setFormData
    };
}
