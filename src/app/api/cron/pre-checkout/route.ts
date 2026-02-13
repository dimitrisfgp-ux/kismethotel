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
 * Query params:
 * - hoursAhead: Number of hours to look ahead (default: 4)
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
    const hoursAhead = parseInt(searchParams.get("hoursAhead") || "4");
    const testMode = searchParams.get("test") === "true";

    try {
        // Get all confirmed bookings
        const bookings = await bookingService.getBookings();
        const rooms = await roomService.getRoomsSummary();

        const now = new Date();
        const checkoutWindow = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

        // Find bookings checking out within the window
        const checkingOutSoon = bookings.filter(booking => {
            if (booking.status !== "active") return false;
            if (booking.preCheckoutEmailSent) return false;

            const room = rooms.find(r => r.id === booking.roomId);
            const timeStr = room?.checkOutTime?.slice(0, 5) || "11:00";

            // 1. Get current time in Athens
            // This creates a Date object that "looks like" Athens time in UTC
            const athensTimeStr = new Date().toLocaleString("en-US", { timeZone: "Europe/Athens" });
            const nowAthens = new Date(athensTimeStr);

            // 2. Construct Checkout Time in Athens context
            // checkOut is YYYY-MM-DD. timeStr is HH:MM.
            // We create a date that "looks like" the checkout time in UTC
            const checkOutAthens = new Date(`${booking.checkOut}T${timeStr}:00`);

            // If invalid date, fallback to simple day comparison (safety)
            if (isNaN(checkOutAthens.getTime())) {
                const checkOut = new Date(booking.checkOut);
                return checkOut >= now && checkOut <= checkoutWindow;
            }

            // 3. Compare difference in hours
            const diffMs = checkOutAthens.getTime() - nowAthens.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);

            // Check if within window (e.g. 0 to 1.2 hours)
            // Using a slightly larger window than 1.0 to account for cron latency
            // but checked hourly, so 1.2 ensures we catch it.
            return diffHours > 0 && diffHours <= hoursAhead;
        });

        if (testMode) {
            return NextResponse.json({
                mode: "test",
                hoursAhead,
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
                html: `<p>Sent ${successCount} goodbye emails to guests checking out within ${hoursAhead} hours.</p>
                       <ul>${results.map(r => `<li>${r.guestEmail}: ${r.sent ? '✓' : '✗'}</li>`).join('')}</ul>`
            });
        }

        return NextResponse.json({
            success: true,
            hoursAhead,
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
