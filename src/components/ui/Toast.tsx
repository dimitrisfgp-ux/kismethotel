"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, X } from 'lucide-react';

export interface ToastProps {
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className={cn(
            "fixed bottom-4 left-4 z-50 flex items-center p-4 rounded-[var(--radius-subtle)] shadow-lg animate-slide-up bg-white border border-[var(--color-sand)] min-w-[300px]",
        )}>
            {type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-[var(--color-success)] mr-3" />
            ) : (
                <XCircle className="h-5 w-5 text-[var(--color-error)] mr-3" />
            )}

            <p className="font-inter text-sm text-[var(--color-charcoal)] flex-1">{message}</p>

            <button onClick={onClose} className="ml-3 text-[var(--color-charcoal)]/50 hover:text-[var(--color-charcoal)]">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
