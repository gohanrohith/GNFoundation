'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef } from 'react';
import { uploadCertificateData } from '../actions';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, Upload } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Upload className="mr-2 h-4 w-4" />
      )}
      Upload File
    </Button>
  );
}

export function CertificateUploadForm() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction] = useActionState(uploadCertificateData, {
    success: false,
    message: '',
  });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success && formRef.current) {
        formRef.current.reset();
        // Also reset the file input visually
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      }
    }
  }, [state, toast]);

  return (
    <form action={formAction} ref={formRef}>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="examType">Exam Type</Label>
            <select
              id="examType"
              name="examType"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select exam type</option>
              <option value="RMTH">RMTH</option>
              <option value="RSTH">RSTH</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              name="year"
              type="number"
              min="2020"
              max={new Date().getFullYear() + 1}
              defaultValue={new Date().getFullYear()}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="certificateFile">Participant Data File</Label>
          <Input id="certificateFile" name="certificateFile" type="file" required ref={fileInputRef}
                 accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
          <p className="text-sm text-muted-foreground">
            Upload an Excel (.xlsx) file with columns: Admission Number, Student Name, School, Class
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <SubmitButton />
      </CardFooter>
    </form>
  );
}
