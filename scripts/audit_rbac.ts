
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} catch (e) {
    console.warn('Could not load .env.local, relying on process.env');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function dumpRBAC() {
    console.log('\n--- ROLES ---');
    const { data: roles } = await supabase.from('roles').select('*').order('name');
    console.table(roles?.map(r => ({ id: r.id, name: r.name, is_system: r.is_system })));

    console.log('\n--- PERMISSIONS ---');
    const { data: permissions } = await supabase.from('permissions').select('*').order('module, slug');
    console.table(permissions?.map(p => ({ id: p.id, slug: p.slug, module: p.module })));

    console.log('\n--- ROLE PERMISSIONS ---');
    // Fetch join table
    const { data: rolePerms } = await supabase
        .from('role_permissions')
        .select('role_id, permission_id');

    // Map IDs to names for readability
    const roleMap = new Map(roles?.map(r => [r.id, r.name]));
    const permMap = new Map(permissions?.map(p => [p.id, p.slug]));

    const readable = rolePerms?.map(rp => ({
        role: roleMap.get(rp.role_id) || rp.role_id,
        permission: permMap.get(rp.permission_id) || rp.permission_id
    })).sort((a, b) => a.role.localeCompare(b.role) || a.permission.localeCompare(b.permission));

    console.table(readable);
}

dumpRBAC().catch(console.error);
