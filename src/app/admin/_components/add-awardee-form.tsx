'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef } from 'react';
import { addAwardee } from '../actions';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Add Awardee
    </Button>
  );
}

export function AddAwardeeForm() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState(addAwardee, {
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
      if (state.success) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <form action={formAction} ref={formRef}>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Student Name</Label>
            <Input id="name" name="name" placeholder="Ananya Sharma" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="award">Award</Label>
            <Input id="award" name="award" placeholder="1st Rank" required />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="examType">Exam Type</Label>
            <Select name="examType" required>
                <SelectTrigger id="examType">
                    <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="RMTH">RMTH</SelectItem>
                    <SelectItem value="RSTH">RSTH</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input id="year" name="year" type="number" placeholder="2023" min="2020" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select name="class" required>
                <SelectTrigger id="class">
                    <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="6th Class">6th Class</SelectItem>
                    <SelectItem value="7th Class">7th Class</SelectItem>
                    <SelectItem value="8th Class">8th Class</SelectItem>
                    <SelectItem value="9th Class">9th Class</SelectItem>
                    <SelectItem value="10th Class">10th Class</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rank">Rank</Label>
            <Input id="rank" name="rank" type="number" placeholder="1" min="1" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marks">Marks (Optional)</Label>
            <Input id="marks" name="marks" type="number" placeholder="98" min="0" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="school">School</Label>
          <Input id="school" name="school" placeholder="S-Greenwood School, Main Campus" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="image">Student Photo</Label>
            <Input id="image" name="image" type="file" accept="image/*" required />
            <p className="text-sm text-muted-foreground">Upload a photo of the student</p>
        </div>
      </CardContent>
      <CardFooter>
        <SubmitButton />
      </CardFooter>
    </form>
  );
}
