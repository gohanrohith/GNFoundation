'use client';

import { useEffect, useRef } from 'react';
import * as React from 'react';
import { useFormState } from 'react-dom';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { replaceTemplate } from '../actions';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';

interface TemplateUploadCardProps {
  templateType: 'RMTH' | 'RSTH';
  templateImage: ImagePlaceholder;
}

export function TemplateUploadCard({ templateType, templateImage }: TemplateUploadCardProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useFormState(replaceTemplate, { success: false, message: '' });
  const [isPending, startTransition] = React.useTransition();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success && fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input
      }
    }
  }, [state, toast]);
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const formData = new FormData(formRef.current!);
      startTransition(() => {
        formAction(formData);
      });
    }
  };


  return (
    <form action={formAction} ref={formRef}>
      <Card>
        <CardHeader>
          <CardTitle>{templateType} Certificate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full h-[200px]">
            <Image
              src={templateImage.imageUrl}
              alt={templateImage.description}
              fill
              className="rounded-md border-2 border-dashed p-2 object-contain"
              data-ai-hint={templateImage.imageHint}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`year-${templateType}`}>Year</Label>
            <Input
              id={`year-${templateType}`}
              name="year"
              type="number"
              min="2020"
              max={new Date().getFullYear() + 1}
              defaultValue={new Date().getFullYear()}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Input type="hidden" name="templateType" value={templateType} />
          <Input
            type="file"
            name="templateFile"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            disabled={isPending}
          />
          <Button type="button" variant="outline" className="w-full" onClick={handleButtonClick} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload {templateType} Template
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
