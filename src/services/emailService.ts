import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
}

// Create transporter with Gmail SMTP
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });
};

/**
 * Send an email using Gmail SMTP
 * Credentials are read from environment variables
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
    // Check if credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('📧 Email not configured - GMAIL_USER or GMAIL_APP_PASSWORD missing');
        return false;
    }

    try {
        const transporter = createTransporter();

        await transporter.sendMail({
            from: `"Kismet" <${process.env.GMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html
        });

        return true;
    } catch (error) {
        console.error('📧 Email sending failed:', error);
        return false;
    }
}

/**
 * Get the configured admin email for notifications
 */
export function getAdminEmail(): string {
    return process.env.ADMIN_EMAIL || 'stay@kismethotel.com';
}
