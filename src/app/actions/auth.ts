'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

import { sendEmail } from '@/services/emailService';
import { welcomeEmail } from '@/services/emailTemplates';
import { requirePermission } from '@/lib/auth/guards';

/**
 * Get all users with their profiles
 */
export async function getUsersAction() {
    await requirePermission('users.view');

    const supabase = createAdminClient();

    // We fetch profiles because that's where the role/name lives for display
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*, roles(name)') // Join with new roles table
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return profiles;
}

/**
 * Invite (Create) a new user
 * Note: Supabase 'inviteUserByEmail' sends an email. 
 * 'createUser' creates it immediately (good for manual provisioning).
 * We'll use 'createUser' and auto-confirm for now as we don't have SMTP set up.
 */
export async function inviteUserAction(formData: FormData) {
    await requirePermission('users.manage');

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const roleId = formData.get('roleId') as string; // Changed from 'role' to 'roleId'

    const supabaseAdmin = createAdminClient();

    // 1. Create User in Auth
    const { data: { user }, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm
        user_metadata: { full_name: fullName }
    });

    if (createError) {
        throw new Error(createError.message);
    }

    if (!user) throw new Error('User creation failed');

    // 2. Update Profile with Role ID
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
            id: user.id,
            email,
            full_name: fullName,
            role_id: roleId,
        });

    if (profileError) {
        console.error('Profile update warning:', profileError);
    }

    // 3. Send Welcome Email
    try {
        const { subject, html } = welcomeEmail(email, password, fullName);
        const emailSent = await sendEmail({
            to: email,
            subject,
            html
        });

        if (!emailSent) {
            console.warn('⚠️ Welcome email could not be sent. Check SMTP credentials.');
        }
    } catch (emailErr) {
        console.error('Failed to send welcome email:', emailErr);
    }

    revalidatePath('/admin/settings');
    return { success: true };
}

/**
 * Delete a user
 */
export async function deleteUserAction(userId: string) {
    const caller = await requirePermission('users.manage');

    if (caller.id === userId) {
        throw new Error('You cannot delete your own account.');
    }

    const supabaseAdmin = createAdminClient();

    // Delete from Auth
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
        // If user is not found in Auth, they might still be in Profiles (orphaned).
        // We should allow the deletion to proceed for the profile.
        if (error.message.includes('User not found') || error.status === 404) {
            console.warn(`User ${userId} not found in Auth, deleting orphaned profile.`);
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (profileError) throw new Error(profileError.message);
        } else {
            throw new Error(error.message);
        }
    } else {
        // If Auth deletion succeeded, the Trigger or FK Cascade should handle the profile.
        // But for extra robustness in this specific manual action, we can ensure it's gone.
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', userId);
        if (profileError) console.error("Profile deletion warning:", profileError);
    }

    revalidatePath('/admin/settings');
    return { success: true };
}

/**
 * Update a user's details (Profile + Auth)
 */
export async function updateUserAction(userId: string, data: {
    email: string;
    fullName: string;
    roleId: string;
    password?: string;
}) {
    const caller = await requirePermission('users.manage');
    const supabaseAdmin = createAdminClient();

    // 1. Prepare Auth Updates (Email, Password)
    const authUpdates: {
        email: string;
        user_metadata: Record<string, string>;
        email_confirm: boolean;
        password?: string;
    } = {
        email: data.email,
        user_metadata: { full_name: data.fullName },
        email_confirm: true // Auto-confirm email changes
    };

    if (data.password && data.password.trim() !== '') {
        authUpdates.password = data.password;
    }

    // 3. Update Auth User
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        authUpdates
    );

    if (authError) throw new Error(`Auth Update Failed: ${authError.message}`);

    // 4. Update Profile (Role ID, Name)
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
            full_name: data.fullName,
            email: data.email,
            role_id: data.roleId,
        })
        .eq('id', userId);

    if (profileError) throw new Error(`Profile Update Failed: ${profileError.message}`);

    revalidatePath('/admin/settings');
    return { success: true };
}

/**
 * Update CURRENT user's profile (Self-Service)
 * Allows updating Name and Password.
 * Does NOT allow updating Role or Email.
 */
export async function updateProfileAction(data: {
    fullName: string;
    password?: string;
    email?: string;
}) {
    // 1. Get Current User
    const supabase = await createClient(); // Regular client, scoped to user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error('Unauthorized');
    }

    const userId = user.id;

    // 2. Check if Email is changing
    if (data.email && data.email !== user.email) {
        // Only Admins can change their email directly via this method
        // We need to verify their role securely
        const supabaseAdmin = createAdminClient();
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('role_id, roles(name)')
            .eq('id', userId)
            .single();

        const rolesData = profile?.roles as unknown;
        const roleName = Array.isArray(rolesData)
            ? (rolesData[0] as { name: string })?.name
            : (rolesData as { name: string } | null)?.name;

        if (roleName !== 'admin') {
            throw new Error('Only Administrators can change their email address directly. Please contact support.');
        }

        // Admin: Update Email via Admin API (to skip verification if desired, or handle standard flow)
        const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { email: data.email, email_confirm: true }
        );

        if (emailError) throw new Error(`Email Update Failed: ${emailError.message}`);

        // Sync Profile Email
        await supabaseAdmin.from('profiles').update({ email: data.email }).eq('id', userId);
    }

    // 3. Prepare Auth Updates (Password & Metadata)
    const authUpdates: { data: { full_name: string }; password?: string } = {
        data: { full_name: data.fullName }
    };

    if (data.password && data.password.trim() !== '') {
        authUpdates.password = data.password;
    }

    const { error: authError } = await supabase.auth.updateUser(authUpdates);

    if (authError) throw new Error(`Auth Update Failed: ${authError.message}`);

    // 4. Update Profile (Name)
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            full_name: data.fullName,
        })
        .eq('id', userId);

    if (profileError) throw new Error(`Profile Update Failed: ${profileError.message}`);

    revalidatePath('/admin/profile');
    return { success: true };
}
