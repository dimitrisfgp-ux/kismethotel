'use client';

import { useState, useEffect } from 'react';
import { updateProfileAction } from '@/app/actions/auth';
import { createClient } from '@/lib/supabase/client';
import { User, Mail, Lock, Loader2, Save } from 'lucide-react';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useToast } from '@/contexts/ToastContext';

export default function ProfilePage() {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);


    // User State
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // Fetch profile for full name
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, role, roles(name)')
                .eq('id', user.id)
                .single();

            setUser({ ...user, profile });
            setFormData(prev => ({
                ...prev,
                email: user.email || '',
                fullName: profile?.full_name || ''
            }));
        }
        setIsLoading(false);
    }

    async function handleProfileUpdate(e: React.FormEvent) {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateProfileAction({
                fullName: formData.fullName,
                email: formData.email,
            });
            showToast("Profile updated successfully", "success");
        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setIsSaving(false);
        }
    }

    async function handlePasswordUpdate(e: React.FormEvent) {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }

        setIsSaving(true);
        try {
            await updateProfileAction({
                fullName: formData.fullName, // Required by action signature, though we should probably make it optional in action too
                password: formData.password
            });
            showToast("Password updated successfully", "success");
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-aegean-blue)]" /></div>;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold font-montserrat text-[var(--color-aegean-blue)]">My Profile</h1>
                <p className="text-[var(--color-charcoal)]/60">Manage your personal account settings.</p>
            </div>

            {/* Profile Information Section */}
            <div className="bg-white rounded-xl shadow-sm border border-black/5 p-8">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <h2 className="text-lg font-bold text-[var(--color-charcoal)] flex items-center gap-2 border-b border-gray-100 pb-4">
                        <User className="w-5 h-5 text-[var(--color-aegean-blue)]" />
                        Profile Information
                    </h2>

                    {/* Read-Only Role */}
                    <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between border border-gray-100">
                        <div>
                            <p className="text-xs uppercase text-gray-500 font-bold tracking-wider">Role</p>
                            <p className="font-medium text-[var(--color-aegean-blue)] capitalize">
                                {user?.profile?.roles?.name || user?.profile?.role || 'Staff'}
                            </p>
                        </div>
                        <div className="h-10 w-10 bg-[var(--color-aegean-blue)]/10 rounded-full flex items-center justify-center text-[var(--color-aegean-blue)]">
                            <User className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-charcoal)]">Full Name</label>
                        <div className="relative">
                            <User className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                            <input
                                required
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-aegean-blue)] outline-none transition-all"
                                placeholder="Your Name"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-charcoal)]">Email Address</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                            <input
                                disabled={user?.profile?.roles?.name !== 'admin'}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none transition-all ${user?.profile?.roles?.name === 'admin'
                                    ? 'focus:ring-2 focus:ring-[var(--color-aegean-blue)]'
                                    : 'bg-gray-50 text-gray-500 cursor-not-allowed'
                                    }`}
                                title={user?.profile?.roles?.name === 'admin' ? "Edit Email" : "Contact Admin to change email"}
                            />
                            {user?.profile?.roles?.name !== 'admin' && (
                                <p className="text-xs text-gray-400 mt-1">To change your email, please contact a System Administrator.</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-[var(--color-aegean-blue)] text-white px-6 py-2.5 rounded-lg hover:bg-[#0fd0d6] hover:text-[var(--color-aegean-blue)] transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-xl shadow-sm border border-black/5 p-8">
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <h2 className="text-lg font-bold text-[var(--color-charcoal)] flex items-center gap-2 border-b border-gray-100 pb-4">
                        <Lock className="w-5 h-5 text-[var(--color-aegean-blue)]" />
                        Security
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-charcoal)]">New Password</label>
                            <PasswordInput
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                minLength={6}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-charcoal)]">Confirm Password</label>
                            <PasswordInput
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                                minLength={6}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-gray-800 text-white px-6 py-2.5 rounded-lg hover:bg-black transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
