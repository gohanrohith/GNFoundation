import { redirect } from 'next/navigation';
import { verifyAuth } from '@/lib/auth-server';
import { AdminSessionGuard } from './_components/admin-session-guard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = verifyAuth();
  if (!auth.success) {
    redirect('/login');
  }

  return <AdminSessionGuard>{children}</AdminSessionGuard>;
}
