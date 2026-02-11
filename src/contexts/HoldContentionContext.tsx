"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { BookingHold } from '@/types';
import { clearContentionAction, checkBookingStatusAction } from '@/app/actions/booking';

type UserBChoice = 'idle' | 'watching' | 'dismissed';
type OutcomeStatus = 'available' | 'booked' | null;

interface HoldContentionContextType {
    // UserB state
    blockedHold: BookingHold | null;
    userBChoice: UserBChoice;
    modalVisible: boolean;
    outcomeStatus: OutcomeStatus;

    // Actions
    showHoldModal: (hold: BookingHold) => void;
    selectWatching: () => void;
    selectDismissed: () => void;
    closeModal: () => void;
    openModalFromWidget: () => void;
    notifyHoldReleased: (hold: BookingHold) => void;
    resetContention: () => void;
}

const HoldContentionContext = createContext<HoldContentionContextType | undefined>(undefined);

export function HoldContentionProvider({ children }: { children: ReactNode }) {
    const [blockedHold, setBlockedHold] = useState<BookingHold | null>(null);
    const [userBChoice, setUserBChoice] = useState<UserBChoice>('idle');
    const [modalVisible, setModalVisible] = useState(false);
    const [outcomeStatus, setOutcomeStatus] = useState<OutcomeStatus>(null);

    const showHoldModal = useCallback((hold: BookingHold) => {
        setBlockedHold(hold);
        setUserBChoice('idle');
        setOutcomeStatus(null);
        setModalVisible(true);
    }, []);

    const selectWatching = useCallback(() => {
        setUserBChoice('watching');
        setModalVisible(false); // Collapse to floating widget
    }, []);

    const selectDismissed = useCallback(() => {
        setUserBChoice('dismissed');
        setModalVisible(false);
        // Signal to UserA that UserB has backed off
        if (blockedHold) {
            clearContentionAction(blockedHold.id);
        }
        // Clear the blocked hold since UserB is no longer interested
        setBlockedHold(null);
    }, [blockedHold]);

    const closeModal = useCallback(() => {
        setModalVisible(false);
        // For outcome modals, fully reset
        if (outcomeStatus) {
            setOutcomeStatus(null);
            setBlockedHold(null);
            setUserBChoice('idle');
        }
    }, [outcomeStatus]);

    const openModalFromWidget = useCallback(() => {
        setModalVisible(true);
    }, []);

    const notifyHoldReleased = useCallback(async (prevHold: BookingHold) => {
        // Check if the dates ended up booked or just released
        const { isBooked } = await checkBookingStatusAction(
            prevHold.roomId,
            prevHold.checkIn,
            prevHold.checkOut
        );

        if (isBooked) {
            setOutcomeStatus('booked');
        } else {
            setOutcomeStatus('available');
        }

        // Auto-expand the modal for the user to see the result
        setModalVisible(true);
    }, []);

    const resetContention = useCallback(() => {
        setBlockedHold(null);
        setUserBChoice('idle');
        setModalVisible(false);
        setOutcomeStatus(null);
    }, []);

    return (
        <HoldContentionContext.Provider value={{
            blockedHold,
            userBChoice,
            modalVisible,
            outcomeStatus,
            showHoldModal,
            selectWatching,
            selectDismissed,
            closeModal,
            openModalFromWidget,
            notifyHoldReleased,
            resetContention
        }}>
            {children}
        </HoldContentionContext.Provider>
    );
}

export function useHoldContention() {
    const context = useContext(HoldContentionContext);
    if (context === undefined) {
        throw new Error('useHoldContention must be used within a HoldContentionProvider');
    }
    return context;
}
