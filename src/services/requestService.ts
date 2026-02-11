import { createClient } from "@/lib/supabase/server";
import { ContactRequest, RequestStatus } from "@/types";

export const requestService = {
    getRequests: async (): Promise<ContactRequest[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('contact_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching requests:', error);
            return [];
        }

        return (data || []).map((r: Record<string, unknown>) => ({
            id: r.id as string,
            subject: r.subject as ContactRequest['subject'],
            name: r.name as string,
            email: r.email as string,
            phone: r.phone as string | undefined,
            message: r.message as string,
            bookingId: r.booking_id as string | undefined,
            newCheckIn: r.new_check_in as string | undefined,
            newCheckOut: r.new_check_out as string | undefined,
            originalCheckIn: r.original_check_in as string | undefined,
            originalCheckOut: r.original_check_out as string | undefined,
            status: r.status as RequestStatus,
            createdAt: r.created_at as string
        }));
    },

    getRequest: async (id: string): Promise<ContactRequest | undefined> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('contact_requests')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return undefined;

        return {
            id: data.id,
            subject: data.subject,
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message,
            bookingId: data.booking_id,
            newCheckIn: data.new_check_in,
            newCheckOut: data.new_check_out,
            originalCheckIn: data.original_check_in,
            originalCheckOut: data.original_check_out,
            status: data.status,
            createdAt: data.created_at
        };
    },

    createRequest: async (request: ContactRequest): Promise<boolean> => {
        const supabase = await createClient();
        const { error } = await supabase
            .from('contact_requests')
            .insert({
                id: request.id,
                subject: request.subject,
                name: request.name,
                email: request.email,
                phone: request.phone,
                message: request.message,
                booking_id: request.bookingId,
                new_check_in: request.newCheckIn,
                new_check_out: request.newCheckOut,
                original_check_in: request.originalCheckIn,
                original_check_out: request.originalCheckOut,
                status: request.status || 'pending'
            });

        return !error;
    },

    updateRequestStatus: async (
        id: string,
        status: RequestStatus,
        originalDates?: { originalCheckIn: string; originalCheckOut: string }
    ): Promise<boolean> => {
        const supabase = await createClient();

        const updateData: Record<string, unknown> = { status };
        if (originalDates) {
            updateData.original_check_in = originalDates.originalCheckIn;
            updateData.original_check_out = originalDates.originalCheckOut;
        }

        const { error } = await supabase
            .from('contact_requests')
            .update(updateData)
            .eq('id', id);

        return !error;
    }
};
