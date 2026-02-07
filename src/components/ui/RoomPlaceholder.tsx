import { Key, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomPlaceholderProps {
    className?: string;
}

export function RoomPlaceholder({ className }: RoomPlaceholderProps) {
    return (
        <div className={cn("relative w-full h-full bg-gradient-to-br from-sand to-accent-gold flex flex-col items-center justify-center text-charcoal/60 p-6 text-center border border-sand overflow-hidden", className)}>

            <div className="z-10 flex flex-col items-center gap-4">
                {/* Composed Icon Illustration */}
                <div className="relative w-16 h-12">
                    <BedDouble className="absolute left-0 bottom-0 w-10 h-10 opacity-60 stroke-1" />
                    <Key className="absolute right-0 top-0 w-8 h-8 opacity-80 stroke-1 -rotate-12 bg-[var(--color-sand)] rounded-full p-1" />
                </div>

                <div className="space-y-1 mt-2">
                    <h3 className="font-montserrat font-bold uppercase tracking-[0.2em] text-sm">
                        Available Soon
                    </h3>
                    <p className="font-inter text-xs opacity-60">
                        Room imagery coming shortly
                    </p>
                </div>
            </div>
        </div>
    );
}
