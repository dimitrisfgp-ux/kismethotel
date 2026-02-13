import { NextResponse } from "next/server";
import { bookingService } from "@/services/bookingService";
import { roomService } from "@/services/roomService";
import { sendEmail, getAdminEmail } from "@/services/emailService";
import { preCheckoutEmail } from "@/services/emailTemplates";

/**
 * Pre-Checkout Cron Job
 * 
 * This API route finds bookings that are checking out soon
 * and sends goodbye emails to guests.
 * 
 * Can be triggered by:
 * - Vercel Cron Jobs (configure in vercel.json)
 * - Manual call from admin dashboard
 * - External scheduler
 * 
 * 
 * Query params:
 * - test: If "true", just returns bookings without sending emails
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

    const { searchParams } = new URL(request.url);
    // hoursAhead is no longer used, defaulting to check "today"
    const testMode = searchParams.get("test") === "true";

    try {
        // Get all confirmed bookings
        const bookings = await bookingService.getBookings();
        const rooms = await roomService.getRoomsSummary();

        const now = new Date();

        // Find bookings checking out within the window
        const checkingOutSoon = bookings.filter(booking => {
            if (booking.status !== "active") return false;
            if (booking.preCheckoutEmailSent) return false;

            const room = rooms.find(r => r.id === booking.roomId);
            const timeStr = room?.checkOutTime?.slice(0, 5) || "11:00";

            // 1. Get current time in Athens
            const athensTimeStr = new Date().toLocaleString("en-US", { timeZone: "Europe/Athens" });
            const nowAthens = new Date(athensTimeStr);

            // 2. Get checkout date in Athens time
            // booking.checkOut is "YYYY-MM-DD". We treat it as midnight on that day.
            const checkOutDate = new Date(booking.checkOut);

            // Compare YYYY-MM-DD parts
            const isToday =
                checkOutDate.getDate() === nowAthens.getDate() &&
                checkOutDate.getMonth() === nowAthens.getMonth() &&
                checkOutDate.getFullYear() === nowAthens.getFullYear();

            return isToday;
        });

        if (testMode) {
            return NextResponse.json({
                mode: "test",
                checkType: "today",
                found: checkingOutSoon.length,
                bookings: checkingOutSoon.map(b => ({
                    id: b.id,
                    guest: b.guestName,
                    email: b.guestEmail,
                    checkOut: b.checkOut,
                    sent: b.preCheckoutEmailSent
                }))
            });
        }

        // Send goodbye emails
        const results = await Promise.all(
            checkingOutSoon.map(async (booking) => {
                const room = rooms.find(r => r.id === booking.roomId);
                const email = preCheckoutEmail(booking, room);

                const sent = await sendEmail({
                    to: booking.guestEmail,
                    subject: email.subject,
                    html: email.html
                });

                if (sent) {
                    await bookingService.markPreCheckoutEmailSent(booking.id);
                }

                return {
                    bookingId: booking.id,
                    guestEmail: booking.guestEmail,
                    sent
                };
            })
        );

        const successCount = results.filter(r => r.sent).length;

        // Also notify admin of the batch
        if (successCount > 0) {
            await sendEmail({
                to: getAdminEmail(),
                subject: `📤 Pre-checkout emails sent (${successCount})`,
                html: `<p>Sent ${successCount} goodbye emails to guests checking out today.</p>
                       <ul>${results.map(r => `<li>${r.guestEmail}: ${r.sent ? '✓' : '✗'}</li>`).join('')}</ul>`
            });
        }

        return NextResponse.json({
            success: true,
            checkType: "today",
            emailsSent: successCount,
            results
        });

    } catch (error) {
        console.error("Pre-checkout cron error:", error);
        return NextResponse.json(
            { error: "Failed to process pre-checkout emails" },
            { status: 500 }
        );
    }
}
