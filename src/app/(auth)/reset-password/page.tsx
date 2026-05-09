import { redirect } from 'next/navigation';
import { getMode } from '@/lib/mode';
import ResetPasswordClient from './ResetPasswordClient';

export default async function ResetPasswordPage() {
    // Recovery flow is unreachable in Guesty mode (no /login → no recovery emails).
    if ((await getMode()) === 'guesty') {
        redirect('/');
    }
    return <ResetPasswordClient />;
}
