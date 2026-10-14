'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export function AdminSessionGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) return;

    const WARNING_TIME = 14 * 60 * 1000;
    const warningTimer = setTimeout(() => {
      toast({
        title: 'Session Expiring Soon',
        description: 'Your session will expire in 1 minute due to inactivity. Move your mouse or click to stay logged in.',
        variant: 'default',
      });
    }, WARNING_TIME);

    return () => clearTimeout(warningTimer);
  }, [isAuthenticated, toast]);

  return <>{children}</>;
}
