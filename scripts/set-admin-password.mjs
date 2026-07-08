// One-off: set (reset) a Supabase Auth user's password via the service-role
// Admin API. Use this to regain admin access when the password is unknown
// (it's a one-way hash — it can't be read, only reset). SMTP isn't configured,
// so the dashboard's "send recovery email" path doesn't work here.
//
//   node scripts/set-admin-password.mjs <email> '<new-password>'
//   node scripts/set-admin-password.mjs '<new-password>'   # if there's only one user
//
// Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local,
// so it targets whichever project is ACTIVE there.

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

// Args: either (email, password) or just (password) when there's a single user.
let [, , a, b] = process.argv;
let email = b ? a : undefined;
let password = b ? b : a;
if (!password) {
    console.error("Usage: node scripts/set-admin-password.mjs <email> '<new-password>'");
    process.exit(1);
}
if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
}

const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
if (error) { console.error('listUsers failed:', error.message); process.exit(1); }
const users = data.users;

let target;
if (email) {
    target = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!target) { console.error(`No user with email ${email}. Found: ${users.map((u) => u.email).join(', ')}`); process.exit(1); }
} else if (users.length === 1) {
    target = users[0];
} else {
    console.error(`Multiple users exist — pass the email explicitly. Found: ${users.map((u) => u.email).join(', ')}`);
    process.exit(1);
}

const { error: updErr } = await admin.auth.admin.updateUserById(target.id, {
    password,
    email_confirm: true,
});
if (updErr) { console.error('updateUserById failed:', updErr.message); process.exit(1); }
console.log(`✓ Password set for ${target.email} (id ${target.id}). Log in with the new password, then rotate it in the CMS.`);
