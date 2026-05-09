import { redirect } from "next/navigation";
import { getMode } from "@/lib/mode";
import BookPageClient from "./BookPageClient";

export default async function BookPage() {
    // No internal booking flow in Guesty mode (Guesty hosts checkout).
    if ((await getMode()) === "guesty") {
        redirect("/");
    }
    return <BookPageClient />;
}
