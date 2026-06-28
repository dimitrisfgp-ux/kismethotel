import { redirect } from "next/navigation";
import { getMode } from "@/lib/mode";

export default async function AdminDashboardPage() {
    const mode = await getMode();
    redirect(mode === "guesty" ? "/admin/homepage" : "/admin/rooms");
}
