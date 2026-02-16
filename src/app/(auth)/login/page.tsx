import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AuthBranding from '@/components/admin/auth/AuthBranding';
import LoginForm from '@/components/admin/auth/LoginForm';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
    const { error: loginError, success } = await searchParams;

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
            return redirect('/login?error=Invalid email or password');
        }

        return redirect('/admin/bookings');
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-[380px_1fr]">
            <AuthBranding />

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

                    <LoginForm
                        loginAction={login}
                        initialError={loginError}
                        initialSuccess={success}
                    />
                </div>
            </div>
        </div>
    );
}
