import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Bot, Lock } from 'lucide-react';

export default function LoginPage() {
    async function login(formData: FormData) {
        "use server";

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return redirect('/login?error=Missing Credentials');
        }

        const supabase = await createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return redirect(`/login?error=${encodeURIComponent(error.message)}`);
        }

        return redirect('/admin/bookings');
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-[380px_1fr]">
            {/* Left: Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-[var(--color-aegean-blue)] p-12 text-white border-r-4 border-[var(--color-accent-gold)] relative overflow-hidden">
                {/* Decorative Gold Circles */}
                <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[var(--color-accent-gold)]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[-20px] left-[-20px] w-60 h-60 bg-[var(--color-accent-gold)]/5 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <h1 className="font-montserrat text-3xl font-bold tracking-[0.2em] text-white">KISMET</h1>
                    <div className="w-16 h-1 bg-[var(--color-accent-gold)] mt-4 mb-6" />
                    <p className="text-white/80 max-w-sm text-lg leading-relaxed">
                        Manage bookings, room availability, and guest requests from one central hub.
                    </p>
                </div>
                <div className="relative z-10">
                    <p className="text-white/40 text-xs font-medium tracking-widest uppercase">
                        Developed by <span className="text-[var(--color-accent-gold)] font-bold">Distarter</span>
                    </p>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex items-center justify-center p-8 bg-[var(--color-warm-white)]">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden mb-8">
                            <h1 className="font-montserrat text-3xl font-bold tracking-[0.2em] text-[var(--color-aegean-blue)]">KISMET</h1>
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--color-charcoal)]">CMS Access</h2>
                        <p className="mt-2 text-[var(--color-charcoal)]/60">
                            Please sign in to continue
                        </p>
                    </div>

                    <form action={login} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-charcoal)]">Email</label>
                            <div className="relative">
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-aegean-blue)] focus:border-transparent transition-all outline-none"
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
                    </form>
                </div>
            </div>
        </div>
    );
}
