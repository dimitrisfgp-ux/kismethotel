import { useState } from 'react';
import { adminCreateBookingAction, getRoomAvailabilityAction } from "@/app/actions/bookings";
import { RoomSummary } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import { usePermission } from '@/contexts/PermissionContext';
import { Modal, ModalHeader, ModalBody } from '@/components/ui/Modal';
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
    const { can } = usePermission();

    if (!isOpen) return null;
    if (!can('bookings.create')) return null;

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
        <Modal isOpen={true} onClose={onClose} className="max-w-2xl">
            <ModalHeader onClose={onClose} className="bg-gray-50/50">
                <div>
                    <h2 className="text-xl font-bold font-montserrat text-[var(--color-aegean-blue)]">New Reservation</h2>
                    <p className="text-xs text-gray-500">Manually create a booking for phone/walk-in guests.</p>
                </div>
            </ModalHeader>

            <ModalBody>
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
            </ModalBody>
        </Modal>
    );
}
