import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function LoginPage() {
    async function login(formData: FormData) {
        "use server";
        const password = formData.get('password');

        // Simple mock authentication
        if (password === '123') {
            const cookieStore = await cookies();
            cookieStore.set('admin_session', 'true', {
                httpOnly: true,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 // 1 day
            });
            redirect('/admin/rooms');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-warm-white)]">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-[var(--color-sand)]">
                <div className="text-center mb-8">
                    <h1 className="font-montserrat text-2xl font-bold text-[var(--color-charcoal)] uppercase tracking-wider mb-2">
                        Kismét Admin
                    </h1>
                    <p className="text-[var(--color-charcoal)]/60 text-sm">
                        Enter your credentials to access the dashboard
                    </p>
                </div>

                <form action={login} className="space-y-6">
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-[var(--color-charcoal)] mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            className="w-full h-11 px-3 rounded-[var(--radius-subtle)] border border-[var(--color-sand)] focus:ring-1 focus:ring-[var(--color-aegean-blue)] focus:border-[var(--color-aegean-blue)] outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full h-11 bg-[var(--color-deep-med)] text-white font-medium uppercase tracking-wide rounded-[var(--radius-subtle)] hover:bg-[var(--color-deep-med)]/90 transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
