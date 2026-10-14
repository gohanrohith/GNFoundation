'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const WARNING_MS = 14 * 60 * 1000;  // 14 min
const EXPIRY_MS  = 15 * 60 * 1000;  // 15 min

export function AdminSessionGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;

    const warningTimer = setTimeout(() => {
      toast({
        title: 'Session Expiring Soon',
        description: 'Your session will expire in 1 minute due to inactivity. Move your mouse or click to stay logged in.',
      });
    }, WARNING_MS);

    const expiryTimer = setTimeout(() => {
      toast({
        title: 'Session Expired',
        description: 'You have been logged out due to inactivity.',
        variant: 'destructive',
      });
      router.push('/login');
    }, EXPIRY_MS);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(expiryTimer);
    };
  }, [isAuthenticated, toast, router]);

  return <>{children}</>;
}
