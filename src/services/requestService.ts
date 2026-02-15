import { createClient } from "@/lib/supabase/server";
import { ContactRequest, RequestStatus, PaginatedResponse } from "@/types";

export const requestService = {
    getRequests: async (
        page: number = 1,
        limit: number = 10,
        filters?: { status?: RequestStatus }
    ): Promise<PaginatedResponse<ContactRequest>> => {
        const supabase = await createClient();
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // Check Auth context
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        let query = supabase
            .from('contact_requests')
            .select(`
                id,
                subject,
                name,
                email,
                phone,
                message,
                booking_id,
                new_check_in,
                new_check_out,
                original_check_in,
                original_check_out,
                status,
                created_at
            `)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        const { data, error } = await query;

        // Separate count query to avoid "{" error on empty pages/pagination
        let countQuery = supabase
            .from('contact_requests')
            .select('*', { count: 'exact', head: true });

        if (filters?.status) {
            countQuery = countQuery.eq('status', filters.status);
        }

        const { count, error: countError } = await countQuery;

        if (countError) {
            console.error('ERROR FETCHING COUNT:', countError);
        }

        if (error) {
            const description = {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            };
            console.error('FAILED REQUEST:', { page, limit, from, to, filters });
            console.error('RAW ERROR OBJECT:', error); // Log the raw object
            console.error('SUPABASE ERROR:', description);
            return { data: [], total: 0, page, limit };
        }

        const requests = (data || []).map((r: Record<string, unknown>) => ({
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

        return {
            data: requests,
            total: count || 0,
            page,
            limit
        };
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

    createRequest: async (request: ContactRequest): Promise<{ success: boolean; error?: any }> => {
        const supabase = await createClient();
        console.log('Creating request payload:', {
            id: request.id,
            subject: request.subject,
            booking_id: request.bookingId
        });
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

        if (error) {
            console.error("Error creating request:", error);
            return { success: false, error };
        }
        return { success: true };
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
