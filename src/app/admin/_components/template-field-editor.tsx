'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FieldPosition {
  x: number;
  y: number;
  fontSize: number;
}

interface FieldPositions {
  admissionNumber?: FieldPosition;
  studentName?: FieldPosition;
  fatherName?: FieldPosition;
  school?: FieldPosition;
  class?: FieldPosition;
  marks?: FieldPosition;
  rank?: FieldPosition;
  grade?: FieldPosition;
  date?: FieldPosition;
}

interface TemplateFieldEditorProps {
  templateType: 'RMTH' | 'RSTH';
  year: number;
}

const defaultPositions: FieldPositions = {
  admissionNumber: { x: 450, y: 750, fontSize: 12 },
  studentName: { x: 150, y: 450, fontSize: 24 },
  school: { x: 150, y: 350, fontSize: 14 },
  class: { x: 150, y: 300, fontSize: 14 },
};

// Only show the 4 required fields in the UI
const fields = [
  { key: 'admissionNumber', label: 'Admission Number', description: 'Usually top-right corner' },
  { key: 'studentName', label: 'Student Name', description: 'Center area, large text' },
  { key: 'school', label: 'School', description: 'Below student name' },
  { key: 'class', label: 'Class', description: 'Below school' },
];

export function TemplateFieldEditor({ templateType, year }: TemplateFieldEditorProps) {
  const [open, setOpen] = useState(false);
  const [positions, setPositions] = useState<FieldPositions>(defaultPositions);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const updatePosition = (fieldKey: string, property: 'x' | 'y' | 'fontSize', value: number) => {
    setPositions(prev => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey as keyof FieldPositions],
        [property]: value,
      } as FieldPosition,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/update-field-positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examType: templateType,
          year,
          fieldPositions: positions,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Field positions saved successfully.',
        });
        setOpen(false);
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save positions',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save field positions',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Configure Fields
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Field Positions - {templateType} {year}</DialogTitle>
          <DialogDescription>
            Set the X, Y coordinates and font size for each field on the PDF certificate.
            <br />
            <strong>Tip:</strong> Use the Coordinate Finder tool at <code>/coordinate-finder.html</code> to easily find positions by clicking on your PDF!
            <br />
            <span className="text-xs">PDF coordinates start from bottom-left. X goes right (0-612), Y goes up (0-792).</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {fields.map(({ key, label, description }) => (
            <div key={key} className="grid grid-cols-4 items-center gap-4 p-4 border rounded-lg">
              <div>
                <Label className="font-semibold">{label}</Label>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${key}-x`} className="text-xs text-muted-foreground">
                  X Position
                </Label>
                <Input
                  id={`${key}-x`}
                  type="number"
                  value={positions[key as keyof FieldPositions]?.x || 0}
                  onChange={(e) => updatePosition(key, 'x', parseInt(e.target.value) || 0)}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${key}-y`} className="text-xs text-muted-foreground">
                  Y Position
                </Label>
                <Input
                  id={`${key}-y`}
                  type="number"
                  value={positions[key as keyof FieldPositions]?.y || 0}
                  onChange={(e) => updatePosition(key, 'y', parseInt(e.target.value) || 0)}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${key}-fontSize`} className="text-xs text-muted-foreground">
                  Font Size
                </Label>
                <Input
                  id={`${key}-fontSize`}
                  type="number"
                  value={positions[key as keyof FieldPositions]?.fontSize || 12}
                  onChange={(e) => updatePosition(key, 'fontSize', parseInt(e.target.value) || 12)}
                  className="h-8"
                />
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Positions</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
