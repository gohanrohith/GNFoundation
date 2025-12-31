'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AwardeesTable } from './_components/awardees-table';
import { AddAwardeeForm } from './_components/add-awardee-form';
import { CertificateUploadForm } from './_components/certificate-upload-form';
import { CertificateTemplateManager } from './_components/certificate-template-manager';
import { StudentsTable } from './_components/students-table';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TemplateUploadCard } from './_components/template-upload-card';
import { TemplateFieldEditor } from './_components/template-field-editor';
import { CertificateDesigner } from './_components/certificate-designer';
import { VisualCertificateBuilder } from './_components/visual-certificate-builder';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface Awardee {
  _id: string;
  name: string;
  award: string;
  year: number;
  school: string;
  class: string;
  imageUrl?: string;
  imageId: string;
  examType: 'RMTH' | 'RSTH';
  rank: number;
  marks?: number;
}

interface CertificateTemplate {
  _id: string;
  examType: 'RMTH' | 'RSTH';
  year: number;
  templateUrl: string;
  orientation: 'portrait' | 'landscape';
  isActive: boolean;
  createdAt: string;
}

interface Student {
  _id: string;
  admissionNumber: string;
  studentName: string;
  fatherName?: string;
  school: string;
  class: string;
  examType: 'RMTH' | 'RSTH';
  year: number;
  marks?: number;
  rank?: number;
  grade?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [awardees, setAwardees] = useState<Awardee[]>([]);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(true);

  const rmthTemplate = PlaceHolderImages.find((p) => p.id === 'cert-rmth');
  const rsthTemplate = PlaceHolderImages.find((p) => p.id === 'cert-rsth');

  useEffect(() => {
    async function fetchAwardees() {
      try {
        const response = await fetch('/api/awardees');
        const data = await response.json();
        if (data.success) {
          setAwardees(data.awardees);
        }
      } catch (error) {
        console.error('Failed to fetch awardees:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAwardees();
  }, []);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch('/api/admin/certificate-templates');
        const data = await response.json();
        if (data.success) {
          setTemplates(data.templates);
        }
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setTemplatesLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch('/api/students');
        const data = await response.json();
        if (data.success) {
          setStudents(data.students);
          setSchools(data.filters.schools);
          setClasses(data.filters.classes);
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setStudentsLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">Admin Panel</h1>
          <p className="mt-2 text-lg text-muted-foreground">Manage your website content here.</p>
        </div>
        <Button onClick={handleLogout} variant="outline" title="Logout">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="awards">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="awards">Manage Awards</TabsTrigger>
          <TabsTrigger value="certificates">Manage Certificates</TabsTrigger>
        </TabsList>
        <TabsContent value="awards" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Add New Awardee</CardTitle>
              <CardDescription>Fill out the form to add a new award winner to the list.</CardDescription>
            </CardHeader>
            <AddAwardeeForm />
          </Card>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-4">Current Awardees</h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <AwardeesTable awardees={awardees} />
            )}
          </div>
        </TabsContent>
        <TabsContent value="certificates" className="space-y-8">
          <div className="space-y-6">
            <VisualCertificateBuilder examType="RMTH" year={2025} />
            <VisualCertificateBuilder examType="RSTH" year={2025} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload Participation Data</CardTitle>
              <CardDescription>
                Upload an Excel/CSV file with participant data (Admission No., Name, etc.). This data will be merged
                with the templates above to generate the final certificates.
              </CardDescription>
            </CardHeader>
            <CertificateUploadForm />
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Students</CardTitle>
              <CardDescription>View, filter, edit, and delete student records. Filter by exam type, school, or class.</CardDescription>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <StudentsTable initialStudents={students} schools={schools} classes={classes} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Certificate Templates</CardTitle>
              <CardDescription>View and manage all certificate templates. You can delete templates that are no longer needed.</CardDescription>
            </CardHeader>
            <CardContent>
              {templatesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <CertificateTemplateManager templates={templates} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
