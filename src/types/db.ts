/**
 * Raw Database Types
 * These match the Supabase schema exactly (snake_case).
 */

export interface DbRole {
    id: string;
    name: string;
    description: string | null;
    is_system: boolean;
    created_at: string;
}

export interface DbPermission {
    id: string;
    slug: string;
    description: string;
    module: string;
}

export interface DbRolePermission {
    role_id: string;
    permission_id: string;
}
