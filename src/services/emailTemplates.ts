import { Booking, ContactRequest, Room } from "@/types";
import { format } from "date-fns";

// Brand colors - matching globals.css
const COLORS = {
    aegeanBlue: '#17324a',      // --color-aegean-blue
    warmWhite: '#FAFAF8',       // --color-warm-white
    sand: '#E8DCC4',            // --color-sand
    gold: '#C9A961',            // --color-accent-gold
    charcoal: '#2F3437',        // --color-charcoal
    deepMed: '#2C5F8D',         // --color-deep-med
    white: '#FFFFFF',           // --color-white
    success: '#5F9B7C',         // --color-success
    error: '#D47B6A'            // --color-error
};

// Brand fonts - matching globals.css
const FONTS = {
    heading: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
};

// Base email wrapper with Kismet branding
// Uses tables for maximum email client compatibility
function emailWrapper(content: string, preheader?: string): string {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kismet</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet" />
    <!--[if mso]>
    <style type="text/css">
        table { border-collapse: collapse; }
        .content { padding: 40px 30px !important; }
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.warmWhite}; font-family: ${FONTS.body}; -webkit-font-smoothing: antialiased;">
    ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>` : ''}
    
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${COLORS.warmWhite};">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; max-width: 600px;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: ${COLORS.aegeanBlue}; padding: 30px 20px; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; padding: 0; color: #ffffff; font-size: 32px; font-weight: 500; letter-spacing: 3px; font-family: ${FONTS.heading};">KISMET</h1>
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top: 12px;">
                                <tr>
                                    <td width="40" height="2" style="background-color: ${COLORS.gold};"></td>
                                    <td width="8"></td>
                                    <td width="8" height="8" style="background-color: ${COLORS.gold};"></td>
                                    <td width="8"></td>
                                    <td width="40" height="2" style="background-color: ${COLORS.gold};"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px; font-family: ${FONTS.body};">
                            ${content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: ${COLORS.sand}; padding: 25px 30px; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; padding: 0; color: ${COLORS.charcoal}; font-size: 14px; font-family: ${FONTS.body};">Kismet</p>
                            <p style="margin: 5px 0 0; padding: 0; color: ${COLORS.charcoal}; font-size: 12px; font-family: ${FONTS.body}; opacity: 0.7;">Agios Nikolaos, Crete, Greece</p>
                            <p style="margin: 10px 0 0; padding: 0; color: ${COLORS.charcoal}; font-size: 11px; font-family: ${FONTS.body}; opacity: 0.6;">+30 2810 123 456 &#8226; stay@kismethotel.com</p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

// Helper to format currency
function formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR' }).format(amount);
}

// ============ EMAIL TEMPLATES ============

/**
 * Email #1: Booking confirmation to guest
 */
export function bookingConfirmationEmail(booking: Booking, room?: Room): { subject: string; html: string } {
    const checkInDate = format(new Date(booking.checkIn), "EEEE, MMMM d, yyyy");
    const checkOutDate = format(new Date(booking.checkOut), "EEEE, MMMM d, yyyy");

    const content = `
        <h2 style="margin:0 0 20px;color:${COLORS.aegeanBlue};font-size:24px;font-weight:400;">Your Stay is Confirmed</h2>
        
        <p style="margin:0 0 25px;color:${COLORS.charcoal};font-size:16px;line-height:1.6;">
            Dear ${booking.guestName},<br><br>
            Thank you for choosing Kismet. We are delighted to confirm your reservation.
        </p>
        
        <!-- Booking ID Box -->
        <div style="background-color:${COLORS.warmWhite};border-left:4px solid ${COLORS.gold};padding:15px 20px;margin-bottom:25px;">
            <p style="margin:0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Booking Reference</p>
            <p style="margin:5px 0 0;color:${COLORS.aegeanBlue};font-size:18px;font-family:monospace;font-weight:bold;">${booking.id}</p>
        </div>
        
        <!-- Reservation Details -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:25px;">
            <tr>
                <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                    <span style="color:#6b7280;font-size:14px;">Room</span><br>
                    <span style="color:${COLORS.charcoal};font-size:16px;font-weight:500;">${room?.name || 'Your Selected Room'}</span>
                </td>
            </tr>
            <tr>
                <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                    <span style="color:#6b7280;font-size:14px;">Check-in</span><br>
                    <span style="color:${COLORS.charcoal};font-size:16px;">${checkInDate}</span>
                </td>
            </tr>
            <tr>
                <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                    <span style="color:#6b7280;font-size:14px;">Check-out</span><br>
                    <span style="color:${COLORS.charcoal};font-size:16px;">${checkOutDate}</span>
                </td>
            </tr>
            <tr>
                <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                    <span style="color:#6b7280;font-size:14px;">Guests</span><br>
                    <span style="color:${COLORS.charcoal};font-size:16px;">${booking.guestsCount} ${booking.guestsCount === 1 ? 'Guest' : 'Guests'}</span>
                </td>
            </tr>
            <tr>
                <td style="padding:12px 0;">
                    <span style="color:#6b7280;font-size:14px;">Total</span><br>
                    <span style="color:${COLORS.aegeanBlue};font-size:20px;font-weight:bold;">${formatPrice(booking.totalPrice)}</span>
                </td>
            </tr>
        </table>
        
        <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
            Please save your booking reference for any future inquiries. We look forward to welcoming you to Crete.
        </p>
    `;

    return {
        subject: `Booking Confirmed – ${room?.name || 'Your Stay at Kismet'}`,
        html: emailWrapper(content, `Your booking ${booking.id} is confirmed for ${checkInDate}`)
    };
}

/**
 * Email #2: New booking alert to admin
 */
export function newBookingAlertEmail(booking: Booking, room?: Room): { subject: string; html: string } {
    const checkInDate = format(new Date(booking.checkIn), "MMM d, yyyy");
    const checkOutDate = format(new Date(booking.checkOut), "MMM d, yyyy");

    const content = `
        <h2 style="margin:0 0 20px;color:${COLORS.aegeanBlue};font-size:24px;font-weight:400;">🎉 New Booking Received</h2>
        
        <div style="background-color:${COLORS.warmWhite};border-radius:8px;padding:20px;margin-bottom:20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="padding:8px 0;"><strong>Booking ID:</strong></td>
                    <td style="padding:8px 0;font-family:monospace;">${booking.id}</td>
                </tr>
                <tr>
                    <td style="padding:8px 0;"><strong>Guest:</strong></td>
                    <td style="padding:8px 0;">${booking.guestName}</td>
                </tr>
                <tr>
                    <td style="padding:8px 0;"><strong>Email:</strong></td>
                    <td style="padding:8px 0;"><a href="mailto:${booking.guestEmail}">${booking.guestEmail}</a></td>
                </tr>
                ${booking.guestPhone ? `
                <tr>
                    <td style="padding:8px 0;"><strong>Phone:</strong></td>
                    <td style="padding:8px 0;">${booking.guestPhone}</td>
                </tr>` : ''}
                <tr>
                    <td style="padding:8px 0;"><strong>Room:</strong></td>
                    <td style="padding:8px 0;">${room?.name || booking.roomId}</td>
                </tr>
                <tr>
                    <td style="padding:8px 0;"><strong>Dates:</strong></td>
                    <td style="padding:8px 0;">${checkInDate} → ${checkOutDate}</td>
                </tr>
                <tr>
                    <td style="padding:8px 0;"><strong>Guests:</strong></td>
                    <td style="padding:8px 0;">${booking.guestsCount}</td>
                </tr>
                <tr>
                    <td style="padding:8px 0;"><strong>Total:</strong></td>
                    <td style="padding:8px 0;color:${COLORS.aegeanBlue};font-weight:bold;">${formatPrice(booking.totalPrice)}</td>
                </tr>
            </table>
        </div>
        
        <p style="margin:0;color:#6b7280;font-size:14px;">
            View in admin dashboard: <a href="/admin/bookings" style="color:${COLORS.aegeanBlue};">Admin → Bookings</a>
        </p>
    `;

    return {
        subject: `🎉 New Booking: ${booking.guestName} – ${room?.name || 'Room'} (${checkInDate})`,
        html: emailWrapper(content)
    };
}

/**
 * Email #3: New contact request alert to admin
 */
export function newRequestAlertEmail(request: ContactRequest): { subject: string; html: string } {
    const subjectLabels: Record<string, string> = {
        general: '💬 General Inquiry',
        reschedule: '📅 Reschedule Request',
        cancellation: '❌ Cancellation Request'
    };

    const content = `
        <h2 style="margin: 0; padding: 0 0 20px 0; color: ${COLORS.aegeanBlue}; font-size: 24px; font-weight: 400; font-family: Georgia, serif;">${subjectLabels[request.subject] || 'New Request'}</h2>
        
        <!-- Info Box -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${COLORS.warmWhite}; border-radius: 8px; margin-bottom: 20px;">
            <tr>
                <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td width="120" style="padding: 8px 0; color: ${COLORS.charcoal}; font-weight: bold; font-family: Georgia, serif;">From:</td>
                            <td style="padding: 8px 0; color: ${COLORS.charcoal}; font-family: Georgia, serif; text-transform: uppercase;">${request.name}</td>
                        </tr>
                        <tr>
                            <td width="120" style="padding: 8px 0; color: ${COLORS.charcoal}; font-weight: bold; font-family: Georgia, serif;">Email:</td>
                            <td style="padding: 8px 0; font-family: Georgia, serif;"><a href="mailto:${request.email}" style="color: ${COLORS.aegeanBlue}; text-decoration: underline;">${request.email}</a></td>
                        </tr>
                        ${request.phone ? `
                        <tr>
                            <td width="120" style="padding: 8px 0; color: ${COLORS.charcoal}; font-weight: bold; font-family: Georgia, serif;">Phone:</td>
                            <td style="padding: 8px 0; color: ${COLORS.charcoal}; font-family: Georgia, serif;">${request.phone}</td>
                        </tr>` : ''}
                        ${request.bookingId ? `
                        <tr>
                            <td width="120" style="padding: 8px 0; color: ${COLORS.charcoal}; font-weight: bold; font-family: Georgia, serif;">Booking ID:</td>
                            <td style="padding: 8px 0; color: ${COLORS.charcoal}; font-family: 'Courier New', monospace;">${request.bookingId}</td>
                        </tr>` : ''}
                        ${request.newCheckIn && request.newCheckOut ? `
                        <tr>
                            <td width="120" style="padding: 8px 0; color: ${COLORS.charcoal}; font-weight: bold; font-family: Georgia, serif;">Requested Dates:</td>
                            <td style="padding: 8px 0; color: ${COLORS.charcoal}; font-family: Georgia, serif;">${format(new Date(request.newCheckIn), "MMM d")} &#8594; ${format(new Date(request.newCheckOut), "MMM d, yyyy")}</td>
                        </tr>` : ''}
                    </table>
                </td>
            </tr>
        </table>
        
        ${request.message ? `
        <!-- Message Box -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
            <tr>
                <td style="background-color: #f9fafb; border-left: 4px solid ${COLORS.aegeanBlue}; padding: 15px 20px;">
                    <p style="margin: 0 0 8px 0; padding: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-family: Georgia, serif;">Message</p>
                    <p style="margin: 0; padding: 0; color: ${COLORS.charcoal}; font-size: 15px; line-height: 1.6; font-family: Georgia, serif;">${request.message}</p>
                </td>
            </tr>
        </table>` : ''}
        
        <p style="margin: 0; padding: 0; color: #6b7280; font-size: 14px; font-family: Georgia, serif;">
            Review in admin: <a href="/admin/requests" style="color: ${COLORS.aegeanBlue}; text-decoration: underline;">Admin &#8594; Requests</a>
        </p>
    `;

    return {
        subject: `${subjectLabels[request.subject] || 'New Request'} from ${request.name}`,
        html: emailWrapper(content)
    };
}

/**
 * Email #4: Request approved notification to guest
 */
export function requestApprovedEmail(request: ContactRequest, booking?: Booking | null): { subject: string; html: string } {
    const isReschedule = request.subject === 'reschedule';
    const isCancellation = request.subject === 'cancellation';

    let statusMessage = '';
    let details = '';

    if (isReschedule && request.newCheckIn && request.newCheckOut) {
        const newCheckIn = format(new Date(request.newCheckIn), "EEEE, MMMM d, yyyy");
        const newCheckOut = format(new Date(request.newCheckOut), "EEEE, MMMM d, yyyy");
        statusMessage = 'Your reschedule request has been approved.';
        details = `
            <div style="background-color:#dcfce7;border-radius:8px;padding:20px;margin:20px 0;">
                <p style="margin:0 0 10px;color:#166534;font-weight:bold;">✓ New Dates Confirmed</p>
                <p style="margin:0;color:#166534;">
                    <strong>Check-in:</strong> ${newCheckIn}<br>
                    <strong>Check-out:</strong> ${newCheckOut}
                </p>
            </div>
        `;
    } else if (isCancellation) {
        statusMessage = 'Your cancellation request has been approved.';
        details = `
            <div style="background-color:#fef2f2;border-radius:8px;padding:20px;margin:20px 0;">
                <p style="margin:0;color:#991b1b;">Your booking has been successfully cancelled. We hope to welcome you another time.</p>
            </div>
        `;
    }

    const content = `
        <h2 style="margin:0 0 20px;color:${COLORS.aegeanBlue};font-size:24px;font-weight:400;">Request Approved</h2>
        
        <p style="margin:0 0 15px;color:${COLORS.charcoal};font-size:16px;line-height:1.6;">
            Dear ${request.name},<br><br>
            ${statusMessage}
        </p>
        
        ${request.bookingId ? `
        <div style="background-color:${COLORS.warmWhite};border-left:4px solid ${COLORS.gold};padding:15px 20px;margin-bottom:20px;">
            <p style="margin:0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Booking Reference</p>
            <p style="margin:5px 0 0;color:${COLORS.aegeanBlue};font-size:16px;font-family:monospace;">${request.bookingId}</p>
        </div>` : ''}
        
        ${details}
        
        <p style="margin:20px 0 0;color:#6b7280;font-size:14px;line-height:1.6;">
            If you have any questions, please don't hesitate to contact us.
        </p>
    `;

    return {
        subject: isReschedule ? 'Your Reschedule Request Has Been Approved' : 'Your Cancellation Request Has Been Approved',
        html: emailWrapper(content)
    };
}

/**
 * Email #5: Pre-checkout goodbye email
 */
export function preCheckoutEmail(booking: Booking, room?: Room): { subject: string; html: string } {
    const content = `
        <h2 style="margin:0 0 20px;color:${COLORS.aegeanBlue};font-size:24px;font-weight:400;">Thank You for Staying With Us</h2>
        
        <p style="margin:0 0 25px;color:${COLORS.charcoal};font-size:16px;line-height:1.6;">
            Dear ${booking.guestName},<br><br>
            As your stay at Kismet comes to an end, we wanted to take a moment to express our heartfelt gratitude for choosing us.
        </p>
        
        <div style="background-color:${COLORS.warmWhite};border-radius:8px;padding:25px;margin-bottom:25px;text-align:center;">
            <p style="margin:0;color:${COLORS.aegeanBlue};font-size:18px;font-style:italic;">
                "Every ending is a new beginning. We hope Kismet has been a beautiful chapter in your journey."
            </p>
        </div>
        
        <h3 style="margin:0 0 15px;color:${COLORS.charcoal};font-size:18px;font-weight:400;">Before You Go</h3>
        
        <ul style="margin:0 0 25px;padding-left:20px;color:${COLORS.charcoal};font-size:15px;line-height:1.8;">
            <li>Please ensure all personal belongings are packed</li>
            <li>Return room keys at reception</li>
            <li>Check-out time is 11:00 AM</li>
            <li>Need a later check-out? Please ask at reception</li>
        </ul>
        
        <div style="background-color:${COLORS.gold};border-radius:8px;padding:20px;margin-bottom:25px;text-align:center;">
            <p style="margin:0 0 10px;color:#ffffff;font-size:16px;font-weight:bold;">Share Your Experience</p>
            <p style="margin:0;color:#ffffff;font-size:14px;">Your feedback helps us improve and helps other travelers discover Kismet.</p>
            <a href="https://g.page/r/kismethotel/review" style="display:inline-block;margin-top:15px;padding:10px 25px;background-color:#ffffff;color:${COLORS.gold};text-decoration:none;border-radius:4px;font-weight:bold;">Leave a Review</a>
        </div>
        
        <p style="margin:0;color:${COLORS.charcoal};font-size:16px;line-height:1.6;">
            Safe travels, and we hope to see you again soon. 🌊
        </p>
        
        <p style="margin:20px 0 0;color:${COLORS.aegeanBlue};font-size:16px;font-style:italic;">
            — The Kismet Team
        </p>
    `;

    return {
        subject: `Safe Travels, ${booking.guestName} 🌊`,
        html: emailWrapper(content, 'Thank you for staying at Kismet. We hope to see you again!')
    };
}

/**
 * Email #6: Welcome / Staff Invitation
 */
export function welcomeEmail(email: string, password: string, name: string): { subject: string; html: string } {
    const loginUrl = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/login` : 'http://localhost:3000/login';

    const content = `
        <h2 style="color: ${COLORS.aegeanBlue}; margin-top: 0;">Welcome to Kismet CMS</h2>
        <p style="font-size: 16px; line-height: 1.5; color: ${COLORS.charcoal};">
            Hello <strong>${name}</strong>,
        </p>
        <p style="font-size: 16px; line-height: 1.5; color: ${COLORS.charcoal};">
            You have been invited to join the Kismet Content Management System.
            Manage bookings, availability, and guest requests all in one place.
        </p>
        
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; background-color: #F8F9FA; border-radius: 8px; border: 1px solid #E9ECEF;">
            <tr>
                <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: ${COLORS.charcoal}; letter-spacing: 1px;">Your Credentials</p>
                    <p style="margin: 10px 0 5px 0; font-size: 14px; color: ${COLORS.charcoal};"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 0; font-size: 14px; color: ${COLORS.charcoal};"><strong>Password:</strong> ${password}</p>
                </td>
            </tr>
        </table>
        
        <p style="font-size: 14px; line-height: 1.5; color: ${COLORS.charcoal}; opacity: 0.8;">
            *For security, please change your password after your first login.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px;">
            <tr>
                <td align="center" style="background-color: ${COLORS.aegeanBlue}; border-radius: 6px;">
                    <a href="${loginUrl}" style="display: inline-block; padding: 14px 30px; color: #ffffff; text-decoration: none; font-weight: 500; font-size: 16px; font-family: ${FONTS.body};">Log In to CMS &rarr;</a>
                </td>
            </tr>
        </table>
    `;

    return {
        subject: `Welcome to Kismet Team`,
        html: emailWrapper(content, "Your access credentials for Kismet CMS")
    };
}
