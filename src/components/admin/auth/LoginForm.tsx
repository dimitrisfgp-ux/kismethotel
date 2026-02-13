'use client';

import { useState, useRef } from 'react';
import { requestPasswordResetAction } from '@/app/actions/auth';
import { Bot, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginFormProps {
    loginAction: (formData: FormData) => void;
    initialError?: string;
    initialSuccess?: string;
}

export default function LoginForm({ loginAction, initialError, initialSuccess }: LoginFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(
        initialError ? { type: 'error', text: initialError }
            : initialSuccess ? { type: 'success', text: initialSuccess }
                : null
    );
    const [isResetting, setIsResetting] = useState(false);

    const handleForgotPassword = async () => {
        const emailInput = formRef.current?.querySelector('input[name="email"]') as HTMLInputElement;
        const email = emailInput?.value?.trim();

        if (!email) {
            setMessage({ type: 'error', text: 'Please enter your email address first, then click "Forgot Password"' });
            emailInput?.focus();
            return;
        }

        setIsResetting(true);
        setMessage(null);

        try {
            const result = await requestPasswordResetAction(email);

            if (result.success) {
                setMessage({ type: 'success', text: `A password reset link has been sent to ${email}. Check your inbox.` });
            } else {
                setMessage({ type: 'error', text: result.message || 'Something went wrong' });
            }
        } catch {
            setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <>
            {message && (
                <div className={`flex items-center gap-3 p-4 rounded-lg text-sm ${message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                    {message.type === 'success'
                        ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        : <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    }
                    <span>{message.text}</span>
                </div>
            )}

            <form ref={formRef} action={loginAction} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-charcoal)]">Email</label>
                    <div className="relative">
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-aegean-blue)] focus:border-transparent transition-all outline-none"
                            placeholder="admin@kismethotel.com"
                            placeholder="admin@kismethotel.com"
                        />
                        <Bot className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-charcoal)]">Password</label>
                    <div className="relative">
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-aegean-blue)] focus:border-transparent transition-all outline-none"
                            placeholder="••••••••"
                        />
                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-[var(--color-aegean-blue)] text-white py-3 rounded-lg font-medium hover:bg-[#0fd0d6] hover:text-[var(--color-aegean-blue)] transition-colors duration-200 flex items-center justify-center gap-2 group"
                >
                    Sign In
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={isResetting}
                        className="text-sm text-[var(--color-charcoal)]/60 hover:text-[var(--color-aegean-blue)] transition-colors disabled:opacity-50"
                    >
                        {isResetting ? 'Sending reset link...' : 'Forgot your password?'}
                    </button>
                </div>
            </form>
        </>
    );
}
