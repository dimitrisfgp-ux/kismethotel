"use server";

import { revalidatePath } from "next/cache";
import { requestService } from "@/services/requestService";
import { bookingService } from "@/services/bookingService";
import { sendEmail, getAdminEmail } from "@/services/emailService";
import { newRequestAlertEmail, requestApprovedEmail } from "@/services/emailTemplates";
import { ContactRequest, Booking } from "@/types";

export async function submitContactRequestAction(request: ContactRequest) {
    const success = await requestService.createRequest(request);
    if (success) {
        // Email #3: Send alert to admin
        const alertEmail = newRequestAlertEmail(request);
        await sendEmail({
            to: getAdminEmail(),
            subject: alertEmail.subject,
            html: alertEmail.html
        });

        revalidatePath("/admin/requests");
    }
    return success;
}

export async function getRequestsAction() {
    return requestService.getRequests();
}

export async function approveRequestAction(requestId: string) {
    const request = await requestService.getRequest(requestId);
    if (!request) return false;

    let originalDates: { originalCheckIn: string; originalCheckOut: string } | undefined;
    let booking: Booking | undefined;

    if (request.subject === 'cancellation' && request.bookingId) {
        booking = await bookingService.getBookingById(request.bookingId);
        await bookingService.cancelBooking(request.bookingId);
    } else if (request.subject === 'reschedule' && request.bookingId && request.newCheckIn && request.newCheckOut) {
        // Capture original dates BEFORE updating the booking
        booking = await bookingService.getBookingById(request.bookingId);
        if (booking) {
            originalDates = {
                originalCheckIn: booking.checkIn,
                originalCheckOut: booking.checkOut
            };
        }
        await bookingService.updateBookingDates(request.bookingId, request.newCheckIn, request.newCheckOut);
    }

    await requestService.updateRequestStatus(requestId, 'approved', originalDates);

    // Email #4: Send approval notification to guest
    if (request.subject === 'reschedule' || request.subject === 'cancellation') {
        const approvalEmail = requestApprovedEmail(request, booking);
        await sendEmail({
            to: request.email,
            subject: approvalEmail.subject,
            html: approvalEmail.html
        });
    }

    revalidatePath("/admin/requests");
    revalidatePath("/admin/bookings");
    revalidatePath("/rooms");
    return true;
}

export async function discardRequestAction(requestId: string) {
    const success = await requestService.updateRequestStatus(requestId, 'discarded');
    if (success) {
        revalidatePath("/admin/requests");
    }
    return success;
}
