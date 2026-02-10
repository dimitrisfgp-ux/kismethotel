
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkProfile() {
    const email = 'dimitris.katopodis@distarter.com';
    console.log(`Checking profile for: ${email}`);

    // 1. Get User ID from Auth
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        console.error('❌ User not found in auth.users!');
        return;
    }
    console.log(`✅ Found Auth User: ${user.id}`);
    console.log('   Metadata:', user.user_metadata);

    // 2. Get Profile from Public Table
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error('❌ Failed to fetch profile:', profileError);
    } else {
        console.log('✅ Found Public Profile:', profile);
        console.log(`   Role is: [${profile.role}]`);

        if (profile.role !== 'admin') {
            console.log('⚠️  MISMATCH! Auth might say admin (in metadata) but Profile says ' + profile.role);

            // Auto-fix attempt
            console.log('🔄 Attempting to fix role to ADMIN...');
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', user.id);

            if (updateError) console.error('   ❌ Fix failed:', updateError.message);
            else console.log('   ✅ Role updated to ADMIN. Try refreshing the app.');
        } else {
            console.log('✅ Role is correct in DB. Issue might be RLS or Caching.');
        }
    }
}

checkProfile();
