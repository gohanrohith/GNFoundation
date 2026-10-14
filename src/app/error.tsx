'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
      <div className="bg-destructive/10 p-6 rounded-full">
        <AlertTriangle className="h-16 w-16 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground max-w-md">
          An unexpected error occurred. Please try again or contact support if the issue persists.
        </p>
      </div>
      <Button onClick={reset} size="lg">
        Try Again
      </Button>
    </div>
  );
}
