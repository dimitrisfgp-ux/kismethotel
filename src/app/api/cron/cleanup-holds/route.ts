import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Expired Hold Cleanup Cron Job
 * 
 * Deletes booking_holds rows where expires_at is in the past.
 * Should be scheduled to run every 15 minutes via Vercel Cron.
 * 
 * Configure in vercel.json with a "crons" entry pointing to
 * "/api/cron/cleanup-holds" on a 15-minute schedule.
 */
export async function GET(request: Request) {
    // Verify cron secret in production
    const authHeader = request.headers.get("authorization");
    if (
        process.env.CRON_SECRET &&
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const supabase = createAdminClient();

        // Delete all expired holds (with 1-minute grace period)
        const cutoff = new Date(Date.now() - 60 * 1000).toISOString();

        const { data, error, count } = await supabase
            .from("booking_holds")
            .delete()
            .lt("expires_at", cutoff)
            .select("id");

        if (error) {
            console.error("Hold cleanup error:", error);
            return NextResponse.json(
                { error: "Failed to cleanup holds" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            deletedCount: data?.length ?? 0,
            cutoff
        });
    } catch (error) {
        console.error("Hold cleanup cron error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
