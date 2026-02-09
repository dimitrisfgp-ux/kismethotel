"use server";

import { revalidatePath } from "next/cache";
import { roomService } from "@/services/roomService";
import { contentService } from "@/services/contentService";
import { sendEmail, getAdminEmail } from "@/services/emailService";
import {
    bookingConfirmationEmail,
    newBookingAlertEmail,
    newRequestAlertEmail,
    requestApprovedEmail
} from "@/services/emailTemplates";
import { Room, HotelSettings, PageContent, FAQ, BlockedDate, Booking, Convenience, LocationCategory } from "@/types";

// --- Room Actions ---

export async function createRoomAction(room: Room) {
    const success = await roomService.createRoom(room);
    if (success) {
        revalidatePath("/admin/rooms");
        revalidatePath("/");
        revalidatePath("/(website)", "layout"); // Try to revalidate public site
    }
    return success;
}

export async function saveRoomAction(room: Room) {
    const success = await roomService.saveRoom(room);
    if (success) {
        revalidatePath("/admin/rooms");
        revalidatePath(`/admin/rooms/${room.slug}`);
        revalidatePath("/");
    }
    return success;
}

export async function deleteRoomAction(roomId: string) {
    const success = await roomService.deleteRoom(roomId);
    if (success) {
        revalidatePath("/admin/rooms");
        revalidatePath("/");
    }
    return success;
}

// --- Content Actions ---

export async function updateSettingsAction(settings: HotelSettings) {
    const success = await contentService.updateSettings(settings);
    if (success) {
        revalidatePath("/admin/settings");
        revalidatePath("/", "layout"); // Revalidate entire site as settings affect footer/meta
    }
    return success;
}

export async function updatePageContentAction(content: PageContent) {
    const success = await contentService.updatePageContent(content);
    if (success) {
        revalidatePath("/admin/settings");
        revalidatePath("/");
    }
    return success;
}

// --- FAQ Actions ---

export async function updateFAQsAction(faqs: FAQ[]) {
    const success = await contentService.updateFAQs(faqs);
    if (success) {
        revalidatePath("/admin/page-content");
        revalidatePath("/");
    }
    return success;
}

export async function updateLocationsAction(locations: Convenience[]) {
    const success = await contentService.updateConveniences(locations);
    if (success) {
        revalidatePath("/admin/page-content");
        revalidatePath("/");
    }
    return success;
}

export async function updateCategoriesAction(categories: LocationCategory[]) {
    const success = await contentService.updateCategories(categories);
    if (success) {
        revalidatePath("/admin/page-content");
        revalidatePath("/");
    }
    return success;
}

// --- Blocked Dates Actions ---

export async function addBlockedDateAction(block: BlockedDate) {
    const success = await roomService.addBlockedDate(block);
    if (success) {
        revalidatePath("/admin/bookings");
        // Revalidate public room pages so the calendar updates immediately
        revalidatePath(`/rooms`);
    }
    return success;
}

export async function removeBlockedDateAction(blockId: string) {
    const success = await roomService.removeBlockedDate(blockId);
    if (success) {
        revalidatePath("/admin/bookings");
        revalidatePath(`/rooms`);
    }
    return success;
}

export async function cancelBookingAction(bookingId: string) {
    const success = await roomService.cancelBooking(bookingId);
    if (success) {
        revalidatePath("/admin/bookings");
        revalidatePath(`/rooms`); // Update availability
    }
    return success;
}

export async function getRoomAvailabilityAction(roomId: string) {
    // Returns all unavailable dates for a room (booked + blocked)
    const bookings = await roomService.getBookings(roomId);
    const blockedDates = await roomService.getBlockedDates(roomId);

    // Convert to date ranges that the calendar can use
    const unavailableDates: { from: string; to: string; type: 'booked' | 'blocked' }[] = [];

    // Add confirmed bookings
    bookings
        .filter(b => b.status === 'confirmed')
        .forEach(booking => {
            unavailableDates.push({
                from: booking.checkIn,
                to: booking.checkOut,
                type: 'booked'
            });
        });

    // Add blocked dates
    blockedDates.forEach(block => {
        unavailableDates.push({
            from: block.from,
            to: block.to,
            type: 'blocked'
        });
    });

    return unavailableDates;
}

// --- Booking Actions ---

export async function createBookingAction(booking: Booking) {
    // In a real app, validation would happen here or in service
    const success = await roomService.createBooking(booking);
    if (success) {
        // Get room details for email
        const rooms = await roomService.getRooms();
        const room = rooms.find(r => r.id === booking.roomId);

        // Email #1: Send confirmation to guest
        const guestEmail = bookingConfirmationEmail(booking, room);
        await sendEmail({
            to: booking.guestEmail,
            subject: guestEmail.subject,
            html: guestEmail.html
        });

        // Email #2: Send alert to admin
        const adminEmail = newBookingAlertEmail(booking, room);
        await sendEmail({
            to: getAdminEmail(),
            subject: adminEmail.subject,
            html: adminEmail.html
        });

        revalidatePath("/admin/bookings");
        revalidatePath(`/rooms`);
    }
    return success;
}

// --- Availability Fetch Action (for Client Components) ---

export async function getAvailabilityAction() {
    const [bookings, blockedDates] = await Promise.all([
        roomService.getBookings(),
        roomService.getBlockedDates()
    ]);
    return { bookings, blockedDates };
}

// --- Data Fetch Actions (for Client Components) ---

export async function getRoomsAction() {
    return roomService.getRooms();
}

export async function getAmenitiesAction() {
    return contentService.getAmenities();
}

// --- Contact Request Actions ---

import { requestService } from "@/services/requestService";
import { ContactRequest } from "@/types";

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

export async function getBookingByIdAction(bookingId: string) {
    return roomService.getBookingById(bookingId);
}

export async function approveRequestAction(requestId: string) {
    const request = await requestService.getRequest(requestId);
    if (!request) return false;

    let originalDates: { originalCheckIn: string; originalCheckOut: string } | undefined;
    let booking: Booking | undefined;

    if (request.subject === 'cancellation' && request.bookingId) {
        booking = await roomService.getBookingById(request.bookingId);
        await roomService.cancelBooking(request.bookingId);
    } else if (request.subject === 'reschedule' && request.bookingId && request.newCheckIn && request.newCheckOut) {
        // Capture original dates BEFORE updating the booking
        booking = await roomService.getBookingById(request.bookingId);
        if (booking) {
            originalDates = {
                originalCheckIn: booking.checkIn,
                originalCheckOut: booking.checkOut
            };
        }
        await roomService.updateBookingDates(request.bookingId, request.newCheckIn, request.newCheckOut);
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

export async function updateBookingDatesAction(bookingId: string, checkIn: string, checkOut: string) {
    const success = await roomService.updateBookingDates(bookingId, checkIn, checkOut);
    if (success) {
        revalidatePath("/admin/bookings");
        revalidatePath("/rooms");
    }
    return success;
}
