/**
 * Shared branding panel used across auth pages (login, reset-password).
 * Keeps the left sidebar consistent without code duplication.
 */
export default function AuthBranding() {
    return (
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
    );
}
