'use client';

import { useState } from 'react';
import { updatePasswordAction } from '@/app/actions/auth';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AuthBranding from '@/components/admin/auth/AuthBranding';
import { LogoBrand } from '@/components/ui/LogoBrand';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const passwordValid = password.length >= 8;
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!passwordValid) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (!passwordsMatch) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await updatePasswordAction(password);
            router.push('/login?success=Password updated successfully');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to update password';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-[380px_1fr]">
            <AuthBranding />

            {/* Right: Form */}
            <div className="flex items-center justify-center p-8 bg-[var(--color-warm-white)]">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden mb-8">
                            <LogoBrand
                                settings={{ name: 'Kismet', description: '', logoMode: 'image', logoIconUrl: '/images/kismet-logo-icon.svg', logoTextUrl: '/images/kismet-logo-text.svg' }}
                                variant="dark"
                                size="md"
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--color-charcoal)]">Choose New Password</h2>
                        <p className="mt-2 text-[var(--color-charcoal)]/60">
                            Enter your new password below
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-charcoal)]">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-aegean-blue)] focus:border-transparent transition-all outline-none"
                                    placeholder="Min. 8 characters"
                                />
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {password.length > 0 && (
                                <div className={`flex items-center gap-1.5 text-xs ${passwordValid ? 'text-green-600' : 'text-gray-400'}`}>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    At least 8 characters
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-charcoal)]">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-aegean-blue)] focus:border-transparent transition-all outline-none"
                                    placeholder="Re-enter password"
                                />
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {confirmPassword.length > 0 && (
                                <div className={`flex items-center gap-1.5 text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !passwordValid || !passwordsMatch}
                            className="w-full bg-[var(--color-aegean-blue)] text-white py-3 rounded-lg font-medium hover:bg-[#0fd0d6] hover:text-[var(--color-aegean-blue)] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? 'Updating...' : 'Update Password'}
                            {!isLoading && <span className="group-hover:translate-x-1 transition-transform">→</span>}
                        </button>

                        <a
                            href="/login"
                            className="flex items-center gap-2 text-sm text-[var(--color-charcoal)]/60 hover:text-[var(--color-aegean-blue)] transition-colors font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign In
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
}
