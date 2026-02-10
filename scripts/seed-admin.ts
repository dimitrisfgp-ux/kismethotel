
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function seedAdmin() {
    console.log('🔍 Environment Check:')
    console.log('   SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ MISSING')
    console.log('   SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Present' : '❌ MISSING')

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('\n❌ Missing environment variables!')
        process.exit(1)
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    const email = 'dimitris.katopodis@distarter.com'
    const password = 'ds123'

    console.log('\n🔍 Step 1: Checking database setup...')

    // Check if profiles table exists
    const { data: tableCheck, error: tableError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)

    if (tableError) {
        console.error('❌ Profiles table issue:', tableError.message)
        console.log('👉 ACTION: Run "supabase_scripts/03_fix_database.sql" in SQL Editor!')
        // We don't exit here, we try to proceed or just warn
    } else {
        console.log('✅ Profiles table exists')
    }

    console.log('\n🔍 Step 2: Checking for existing user...')

    // Check if user already exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
        console.error('❌ Cannot list users:', listError.message)
        process.exit(1)
    }

    const existingUser = users.find(u => u.email === email)

    if (existingUser) {
        console.log('⚠️  User already exists:', existingUser.id)
        console.log('   Deleting and recreating...')

        const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id)
        if (deleteError) {
            console.error('❌ Could not delete user:', deleteError.message)
            console.log('👉 ACTION: Manually delete user in Supabase Dashboard.')
            return;
        }
        console.log('✅ Old user deleted')

        // Wait for propagation
        await new Promise(resolve => setTimeout(resolve, 1000))
    } else {
        console.log('✅ No existing user found')
    }

    console.log('\n🔍 Step 3: Creating admin user...')

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: 'System Administrator',
            role: 'admin'
        }
    })

    if (authError) {
        console.error('❌ Auth error:', authError.message)
        return;
    }

    if (!authData.user) {
        console.log('❌ User created but returned null data?');
        return;
    }

    console.log('✅ User created:', authData.user.id)

    console.log('\n🔍 Step 4: Ensuring admin role in Profiles...')

    // Wait for trigger to fire
    await new Promise(resolve => setTimeout(resolve, 1000))

    const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
            id: authData.user.id,
            email,
            role: 'admin',
            full_name: 'System Administrator'
        })

    if (updateError) {
        console.error('⚠️  Could not set role:', updateError.message)
    } else {
        console.log('✅ Admin role assigned/verified')
    }
}

seedAdmin().catch(console.error)
