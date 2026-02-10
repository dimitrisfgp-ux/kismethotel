export default function AdminLoading() {
    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-12 px-4 animate-pulse">
            <div className="border-b border-[var(--color-sand)] pb-6 flex justify-between items-end">
                <div>
                    <div className="h-8 w-64 bg-[var(--color-sand)] rounded mb-2"></div>
                    <div className="h-4 w-96 bg-[var(--color-sand)]/50 rounded"></div>
                </div>
            </div>

            {/* Section 1 Skeleton */}
            <section>
                <div className="h-6 w-48 bg-[var(--color-sand)] mb-4 rounded"></div>
                <div className="bg-white border border-[var(--color-sand)] rounded-sm h-[400px]"></div>
            </section>

            {/* Section 2 Skeleton */}
            <section className="mt-8">
                <div className="h-6 w-56 bg-[var(--color-sand)] mb-4 rounded"></div>
                <div className="bg-white border border-[var(--color-sand)] rounded-sm h-[200px]"></div>
            </section>
        </div>
    );
}
