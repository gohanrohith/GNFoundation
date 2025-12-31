'use client';

import { useFormStatus, useFormState } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { findCertificate, type FormState } from '../actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialState: FormState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Find Certificate
    </Button>
  );
}

interface CertificateFormProps {
  examType: 'RMTH' | 'RSTH';
}

export function CertificateForm({ examType }: CertificateFormProps) {
  const [state, formAction] = useFormState(findCertificate, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      // Don't reset the form on success so the user can see the download button
      // formRef.current?.reset();
    }
  }, [state.success]);

  const handleNewSearch = () => {
    formRef.current?.reset();
    // A bit of a hack to reset the state. A more robust solution might involve a state management library.
    window.location.reload();
  };

  const handleDownload = async () => {
    if (!state.data?.admissionNumber) return;

    setIsDownloading(true);
    try {
      const response = await fetch('/api/certificates/generate-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admissionNumber: state.data.admissionNumber,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate certificate');
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate_${state.data.admissionNumber}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Success!',
        description: 'Your certificate has been downloaded.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to download certificate. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <form action={formAction} ref={formRef}>
        <CardHeader>
          <CardTitle>Enter Admission Number</CardTitle>
          <CardDescription>e.g., {examType}2023001</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input type="hidden" name="examType" value={examType} />
          <div className="space-y-2">
            <Label htmlFor={`admissionNumber-${examType}`}>Admission Number</Label>
            <Input
              id={`admissionNumber-${examType}`}
              name="admissionNumber"
              placeholder={`${examType} admission number`}
              required
              disabled={state.success}
            />
          </div>

          {state.message && !state.success && (
            <Alert variant='destructive'>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {state.success && state.data && (
             <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-4">
          {!state.success && <SubmitButton />}
          {state.success && state.data && (
            <>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download for {state.data.name}
                  </>
                )}
              </Button>
              <Button onClick={handleNewSearch} variant="outline" className="w-full">
                Search for another
              </Button>
            </>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
