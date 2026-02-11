import { BedDouble, KeyRound } from "lucide-react";

export function RoomPlaceholder() {
    return (
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center p-8"
            style={{
                background: "linear-gradient(135deg, #f5e6c8 0%, #e8d4a8 35%, #d4bc82 70%, #c9a85a 100%)"
            }}
        >
            {/* Decorative Icons */}
            <div className="flex items-center gap-4 mb-6">
                <BedDouble className="w-12 h-12 text-[#a68a4a]" strokeWidth={1.2} />
                <div className="w-px h-10 bg-[#a68a4a]/40" />
                <KeyRound className="w-10 h-10 text-[#a68a4a]" strokeWidth={1.2} />
            </div>

            {/* Text */}
            <p className="font-montserrat text-sm uppercase tracking-[0.3em] text-[#6b5a32] mb-2">
                Coming Soon
            </p>
            <p className="font-inter text-xs text-[#6b5a32]/70 max-w-[220px]">
                Photos are being prepared for this room
            </p>

            {/* Subtle animated shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer pointer-events-none" />
        </div>
    );
}
