import { useState } from 'react';
import { adminCreateBookingAction } from '@/app/actions/bookings';
import { RoomSummary } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import { X } from 'lucide-react';
import { useBookingForm } from '@/hooks/useBookingForm';
import { BookingForm } from './BookingForm';

interface CreateBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    rooms: RoomSummary[];
    currentUserRole: string;
}

export function CreateBookingModal({ isOpen, onClose, rooms, currentUserRole }: CreateBookingModalProps) {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Use the Custom Hook
    const { formData, updateField, handleRoomChange, calculatePrice } = useBookingForm(rooms);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await adminCreateBookingAction({
                ...formData,
                totalPrice: Number(formData.totalPrice),
                guestsCount: Number(formData.guestsCount)
            });
            showToast('Booking created successfully', 'success');
            onClose();
        } catch (error: any) {
            showToast(error.message || 'Failed to create booking', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold font-montserrat text-[var(--color-aegean-blue)]">New Reservation</h2>
                        <p className="text-xs text-gray-500">Manually create a booking for phone/walk-in guests.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6">
                    <BookingForm
                        formData={formData}
                        rooms={rooms}
                        currentUserRole={currentUserRole}
                        startLoading={isLoading}
                        onChange={updateField}
                        onRoomChange={handleRoomChange}
                        onCalculatePrice={calculatePrice}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
}
