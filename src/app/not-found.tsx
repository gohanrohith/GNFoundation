import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
      <div className="bg-primary/10 p-6 rounded-full">
        <SearchX className="h-16 w-16 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-5xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/">Go Back Home</Link>
      </Button>
    </div>
  );
}
