'use client';

import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Show warning when session is about to expire (1 minute before)
  useEffect(() => {
    if (!isAuthenticated) return;

    const WARNING_TIME = 14 * 60 * 1000; // 14 minutes (1 minute before expiry)

    const warningTimer = setTimeout(() => {
      toast({
        title: 'Session Expiring Soon',
        description: 'Your session will expire in 1 minute due to inactivity. Move your mouse or click to stay logged in.',
        variant: 'default',
      });
    }, WARNING_TIME);

    return () => clearTimeout(warningTimer);
  }, [isAuthenticated, toast]);

  if (isLoading) {
    // Show loading state while verifying authentication
    return (
      <div className="container mx-auto p-8">
        <Skeleton className="h-12 w-1/4 mb-4" />
        <Skeleton className="h-8 w-1/2 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // useAuth hook will automatically redirect to /login if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
