import { montserrat, inter } from "@/lib/fonts";
import "@/app/globals.css";
import { ToastProvider } from "@/contexts/ToastContext";

export default function AuthRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
            <body className="antialiased bg-[var(--color-warm-white)] text-[var(--color-charcoal)]">
                <ToastProvider>
                    {children}
                </ToastProvider>
            </body>
        </html>
    );
}
