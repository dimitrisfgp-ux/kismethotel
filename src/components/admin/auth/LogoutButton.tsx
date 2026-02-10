"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-white/60 hover:text-red-400 hover:bg-white/5 rounded-md transition-colors cursor-pointer text-left"
        >
            <LogOut className="h-5 w-5" />
            Logout
        </button>
    );
}
