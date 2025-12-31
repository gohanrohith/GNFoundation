// src/app/admin/_components/visual-certificate-builder.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Save, Eye, Trash2, Move } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Field {
  id: string;
  name: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  text: string;
}

interface VisualCertificateBuilderProps {
  examType: 'RMTH' | 'RSTH';
  year: number;
}

export function VisualCertificateBuilder({ examType, year }: VisualCertificateBuilderProps) {
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [fields, setFields] = useState<Field[]>([
    { id: 'admissionNumber', name: 'Admission Number', x: 70, y: 10, fontSize: 14, fontFamily: 'Arial', color: '#000000', text: '{admissionNumber}' },
    { id: 'studentName', name: 'Student Name', x: 50, y: 45, fontSize: 32, fontFamily: 'Arial', color: '#000000', text: '{studentName}' },
    { id: 'school', x: 50, y: 65, fontSize: 18, fontFamily: 'Arial', color: '#000000', text: '{school}', name: 'School' },
    { id: 'class', x: 30, y: 65, fontSize: 18, fontFamily: 'Arial', color: '#000000', text: '{class}', name: 'Class' },
  ]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadConfiguration();
  }, [examType, year]);

  const loadConfiguration = async () => {
    try {
      const response = await fetch(`/api/admin/visual-template?examType=${examType}&year=${year}`);
      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setBackgroundImage(data.config.backgroundImage || '');
          setOrientation(data.config.orientation || 'portrait');
          if (Array.isArray(data.config.fields)) setFields(data.config.fields);
        }
      }
    } catch (error) {
      console.error('Failed to load configuration:', error);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackgroundImage(URL.createObjectURL(file));
    setBackgroundFile(file);
  };

  const getCanvasCoords = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    // Convert to percentage of the canvas size
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return { x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) };
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (dragging || !selectedField) return;
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    setFields(fields.map(f => f.id === selectedField ? { ...f, x, y } : f));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    setFields(fields.map(f => f.id === dragging ? { ...f, x, y } : f));
  };

  const saveConfiguration = async () => {
    try {
      let cloudinaryUrl = backgroundImage;

      // Upload background if a new file is selected
      if (backgroundFile) {
        const formData = new FormData();
        formData.append('file', backgroundFile);
        formData.append('examType', examType);
        formData.append('year', year.toString());

        const uploadRes = await fetch('/api/admin/upload-background', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.url) {
          throw new Error(uploadData.error || 'Failed to upload background image');
        }

        cloudinaryUrl = uploadData.url;
      }

      // Check if we have a background image
      if (!cloudinaryUrl) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'Please upload a background image first.'
        });
        return;
      }

      // Save template configuration
      const saveRes = await fetch('/api/admin/visual-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examType, year, backgroundImage: cloudinaryUrl, fields, orientation }),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok) {
        throw new Error(saveData.error || 'Failed to save template');
      }

      toast({
        title: 'Success!',
        description: `${examType} ${year} template saved successfully.`
      });

      setBackgroundFile(null); // Clear the file after successful upload
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        variant: 'destructive',
        description: error.message || 'Failed to save template. Please try again.'
      });
    }
  };

  const selectedFieldData = fields.find(f => f.id === selectedField);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visual Builder (Percentage Based)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 mb-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">Upload Background</Button>
            <Select value={orientation} onValueChange={(v: any) => setOrientation(v)}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
            </Select>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleBackgroundUpload} />
        </div>

        <div className="relative border-2 border-gray-300 rounded overflow-hidden bg-gray-100" 
             style={{ height: '600px', width: '100%', display: 'flex', justifyContent: 'center' }}>
          {backgroundImage && (
            <div
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              onMouseUp={() => setDragging(null)}
              className="relative shadow-xl"
              style={{
                height: '100%',
                aspectRatio: orientation === 'portrait' ? '210/297' : '297/210',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: '100% 100%',
              }}
            >
              {fields.map((field) => (
                <div
                  key={field.id}
                  onMouseDown={(e) => { e.stopPropagation(); setDragging(field.id); setSelectedField(field.id); }}
                  className={`absolute cursor-move whitespace-nowrap px-1 ${selectedField === field.id ? 'ring-1 ring-blue-500 bg-blue-50/50' : ''}`}
                  style={{
                    left: `${field.x}%`,
                    top: `${field.y}%`,
                    fontSize: `${field.fontSize}px`,
                    fontFamily: field.fontFamily,
                    color: field.color,
                    fontWeight: field.id === 'studentName' ? 'bold' : 'normal',
                    transform: 'translate(-50%, -50%)', // Anchor center for easier alignment
                  }}
                >
                  {field.text}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
            {fields.map(f => (
                <Button key={f.id} size="sm" variant={selectedField === f.id ? 'default' : 'outline'} onClick={() => setSelectedField(f.id)}>
                    {f.name} ({f.x}%, {f.y}%)
                </Button>
            ))}
        </div>
        
        <Button onClick={saveConfiguration} className="w-full"><Save className="mr-2" /> Save Template</Button>
      </CardContent>
    </Card>
  );
}