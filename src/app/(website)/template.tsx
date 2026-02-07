"use client";



export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="animate-[fade-in_1s_var(--ease-premium)_forwards]">
            {children}
        </div>
    );
}
