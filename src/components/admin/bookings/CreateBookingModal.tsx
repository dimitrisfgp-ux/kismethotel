'use client';

import { useState } from 'react';
import { adminCreateBookingAction } from '@/app/actions/bookings';
import { Room, BookingStatus } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import { X, Calendar, User, CreditCard, BedDouble } from 'lucide-react';
import { formatCurrency } from '@/lib/priceCalculator';

interface CreateBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    rooms: Room[];
    currentUserRole: string;
}

export function CreateBookingModal({ isOpen, onClose, rooms, currentUserRole }: CreateBookingModalProps) {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        roomId: rooms[0]?.id || '',
        checkIn: '',
        checkOut: '',
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        guestsCount: 2,
        totalPrice: 0,
        status: 'confirmed' as BookingStatus,
        notes: ''
    });

    if (!isOpen) return null;

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const roomId = e.target.value;
        const room = rooms.find(r => r.id === roomId);
        // Reset price logic could go here if we auto-calculated
        setFormData(prev => ({ ...prev, roomId }));
    };

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

    // calculate tentative price (simple logic for now)
    const selectedRoom = rooms.find(r => r.id === formData.roomId);

    // Auto-calc helper (very basic, improvements later)
    const calculatePrice = () => {
        if (!selectedRoom || !formData.checkIn || !formData.checkOut) return;
        const start = new Date(formData.checkIn);
        const end = new Date(formData.checkOut);
        const nights = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
        if (nights > 0) {
            setFormData(prev => ({ ...prev, totalPrice: nights * selectedRoom.pricePerNight }));
        }
    };

    const canEditPrice = ['admin', 'manager'].includes(currentUserRole);

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
                    <form id="createBookingForm" onSubmit={handleSubmit} className="space-y-6">

                        {/* Section: Room & Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
                                    <BedDouble className="w-4 h-4" /> Room Selection
                                </label>
                                <select
                                    name="roomId"
                                    value={formData.roomId}
                                    onChange={handleRoomChange}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-aegean-blue)] outline-none"
                                >
                                    {rooms.map(room => (
                                        <option key={room.id} value={room.id}>
                                            {room.name} ({formatCurrency(room.pricePerNight)}/night)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
                                        <Calendar className="w-4 h-4" /> Check In
                                    </label>
                                    <input
                                        type="date"
                                        name="checkIn"
                                        required
                                        value={formData.checkIn}
                                        onChange={handleChange}
                                        onBlur={calculatePrice}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-aegean-blue)] outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-500 pl-6">Check Out</label>
                                    <input
                                        type="date"
                                        name="checkOut"
                                        required
                                        value={formData.checkOut}
                                        onChange={handleChange}
                                        onBlur={calculatePrice}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-aegean-blue)] outline-none"
                                    />
                                </div>
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
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[var(--color-aegean-blue)]"
                                />
                                <input
                                    name="guestEmail"
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    value={formData.guestEmail}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[var(--color-aegean-blue)]"
                                />
                                <input
                                    name="guestPhone"
                                    type="tel"
                                    placeholder="Phone Number (Optional)"
                                    value={formData.guestPhone}
                                    onChange={handleChange}
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
                                        onChange={handleChange}
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-[var(--color-aegean-blue)]"
                                >
                                    <option value="confirmed">Confirmed</option>
                                    <option value="held">Held (Pending)</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-200 transition-colors"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="createBookingForm"
                        disabled={isLoading}
                        className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-[var(--color-aegean-blue)] hover:bg-[#0fd0d6] hover:text-[var(--color-aegean-blue)] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading && <span className="animate-spin">⏳</span>}
                        Create Booking
                    </button>
                </div>

            </div>
        </div>
    );
}
