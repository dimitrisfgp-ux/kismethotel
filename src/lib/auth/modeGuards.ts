import { getMode } from '@/lib/mode';
import { redirect } from 'next/navigation';

/**
 * Booking-engine admin pages (bookings, requests, rooms, page-content) don't
 * apply in Guesty mode — send the user to the homepage editor instead.
 */
export async function requireSelfContainedAdmin() {
    if ((await getMode()) === 'guesty') {
        redirect('/admin/homepage');
    }
}

/**
 * The Guesty homepage editor only applies in Guesty mode — in self_contained
 * mode the equivalent surfaces are Rooms + Page Content.
 */
export async function requireGuestyAdmin() {
    if ((await getMode()) === 'self_contained') {
        redirect('/admin/rooms');
    }
}
