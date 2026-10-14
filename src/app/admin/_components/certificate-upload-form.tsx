'use client';

import { useState, useTransition, useRef } from 'react';
import { uploadCertificateData } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Loader2, Upload, Eye, CheckCircle, X } from 'lucide-react';

interface PreviewRow {
  admissionNumber: string;
  studentName: string;
  fatherName?: string;
  school: string;
  class: string;
  marks?: string;
  rank?: string;
  grade?: string;
  _error?: string;
}

interface ParseResult {
  rows: PreviewRow[];
  totalRows: number;
  errorRows: number;
}

function parseRow(raw: any): PreviewRow {
  const get = (...keys: string[]) => {
    for (const k of keys) {
      if (raw[k] !== undefined && raw[k] !== null && raw[k] !== '') return String(raw[k]).trim();
    }
    return '';
  };
  const admissionNumber = get('Admission Number', 'admissionNumber', 'AdmissionNumber');
  const studentName = get('Student Name', 'studentName', 'StudentName');
  const school = get('School', 'school');
  const cls = get('Class', 'class');

  const missing = [];
  if (!admissionNumber) missing.push('Admission Number');
  if (!studentName) missing.push('Student Name');
  if (!school) missing.push('School');
  if (!cls) missing.push('Class');

  return {
    admissionNumber: admissionNumber || '—',
    studentName: studentName || '—',
    fatherName: get('Father Name', 'fatherName', 'FatherName') || undefined,
    school: school || '—',
    class: cls || '—',
    marks: get('Marks', 'marks') || undefined,
    rank: get('Rank', 'rank') || undefined,
    grade: get('Grade', 'grade') || undefined,
    _error: missing.length > 0 ? `Missing: ${missing.join(', ')}` : undefined,
  };
}

export function CertificateUploadForm() {
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const [examType, setExamType] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ParseResult | null>(null);
  const [step, setStep] = useState<'select' | 'preview'>('select');
  const [parsing, setParsing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(null);
    setStep('select');
  };

  const handlePreview = async () => {
    if (!file) return;
    setParsing(true);
    try {
      const XLSX = await import('xlsx');
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data: any[] = XLSX.utils.sheet_to_json(ws);
      const rows = data.map(parseRow);
      setPreview({
        rows,
        totalRows: rows.length,
        errorRows: rows.filter((r) => r._error).length,
      });
      setStep('preview');
    } catch (err: any) {
      toast({ title: 'Parse Error', description: err.message || 'Failed to read Excel file.', variant: 'destructive' });
    } finally {
      setParsing(false);
    }
  };

  const handleConfirm = () => {
    if (!file || !examType || !year) return;
    const formData = new FormData();
    formData.append('certificateFile', file);
    formData.append('examType', examType);
    formData.append('year', year);

    startTransition(async () => {
      const result = await uploadCertificateData({ success: false, message: '' }, formData);
      if (result.message.toLowerCase().includes('unauthorized')) { router.push('/login'); return; }
      toast({ title: result.success ? 'Success!' : 'Error', description: result.message, variant: result.success ? 'default' : 'destructive' });
      if (result.success) {
        setStep('select');
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    });
  };

  const handleCancel = () => {
    setStep('select');
    setPreview(null);
  };

  const previewRows = preview ? preview.rows.slice(0, 10) : [];

  return (
    <>
      <CardContent className="space-y-4">
        {step === 'select' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examType">Exam Type</Label>
                <select
                  id="examType"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
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
                <Input id="year" type="number" min="2020" max={new Date().getFullYear() + 1}
                  value={year} onChange={(e) => setYear(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="certificateFile">Participant Data File</Label>
              <Input id="certificateFile" type="file" ref={fileInputRef}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange} />
              <p className="text-sm text-muted-foreground">
                Excel (.xlsx) with columns: Admission Number, Student Name, School, Class
              </p>
            </div>
          </>
        )}

        {step === 'preview' && preview && (
          <div className="space-y-4">
            <div className="flex gap-4 text-sm">
              <span className="font-semibold">{preview.totalRows} rows total</span>
              {preview.errorRows > 0 && (
                <span className="text-destructive font-semibold">{preview.errorRows} with missing required fields</span>
              )}
              {preview.errorRows === 0 && (
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> All rows valid
                </span>
              )}
              <span className="text-muted-foreground">(showing first {Math.min(10, preview.totalRows)} rows)</span>
            </div>
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Admission No.</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewRows.map((row, i) => (
                    <TableRow key={i} className={row._error ? 'bg-destructive/5' : ''}>
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell>{row.admissionNumber}</TableCell>
                      <TableCell>{row.studentName}</TableCell>
                      <TableCell>{row.school}</TableCell>
                      <TableCell>{row.class}</TableCell>
                      <TableCell>
                        {row._error
                          ? <span className="text-destructive text-xs">{row._error}</span>
                          : <CheckCircle className="h-4 w-4 text-green-600" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-sm text-muted-foreground">
              Rows with missing required fields will be skipped. Valid rows will be upserted.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-3">
        {step === 'select' && (
          <Button onClick={handlePreview} disabled={!file || !examType || !year || parsing}>
            {parsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
            Preview Import
          </Button>
        )}
        {step === 'preview' && (
          <>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Confirm Import
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isPending}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </>
        )}
      </CardFooter>
    </>
  );
}
