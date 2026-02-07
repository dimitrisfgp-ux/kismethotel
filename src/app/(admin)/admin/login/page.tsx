import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

async function login(formData: FormData) {
    "use server";
    const password = formData.get('password');

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

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] font-montserrat p-4">
            <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-lg border border-[var(--color-sand)] shadow-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[var(--color-aegean-blue)] tracking-wider uppercase">
                        Admin Access
                    </h1>
                    <p className="mt-2 text-sm text-[var(--color-charcoal)]/60">
                        Please enter the secure password
                    </p>
                </div>

                <form action={login} className="space-y-6">
                    <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        autoFocus
                        className="text-center tracking-widest"
                    />
                    <Button type="submit" className="w-full">
                        Enter Dashboard
                    </Button>
                </form>
            </div>
        </div>
    );
}
