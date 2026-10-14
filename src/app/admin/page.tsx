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
    <div style={{ background: 'var(--cream, #F8F5EF)', minHeight: '100vh' }}>
      {/* Admin masthead */}
      <div style={{ background: 'var(--navy, #0D2340)', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1200px' }}>
          <div className="flex justify-between items-center py-4">
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold2, #B8920A)', marginBottom: '4px' }}>
                GN Foundation
              </div>
              <h1 className="font-heading" style={{ fontSize: '22px', fontWeight: 600, color: '#fff', lineHeight: 1 }}>
                Administration
              </h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              style={{ borderColor: 'rgba(255,255,255,.25)', color: 'rgba(255,255,255,.7)', background: 'transparent' }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: '1200px' }}>
        <Tabs defaultValue="awards">
          <div style={{ borderBottom: '2px solid var(--navy, #0D2340)', marginBottom: '24px' }}>
            <TabsList style={{ background: 'transparent', gap: '0', borderRadius: 0, padding: 0 }}>
              <TabsTrigger
                value="awards"
                style={{ borderRadius: 0, fontWeight: 600, letterSpacing: '.04em', fontSize: '13px' }}
              >
                Manage Awards
              </TabsTrigger>
              <TabsTrigger
                value="certificates"
                style={{ borderRadius: 0, fontWeight: 600, letterSpacing: '.04em', fontSize: '13px' }}
              >
                Manage Certificates
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="awards" className="space-y-8">
            <Card style={{ borderRadius: '2px', border: '1px solid var(--rule, #C8BFA8)' }}>
              <CardHeader style={{ borderBottom: '1px solid var(--rule, #C8BFA8)', background: 'white' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold, #8C6A1A)', marginBottom: '4px' }}>
                  Awards
                </div>
                <CardTitle className="font-heading" style={{ fontSize: '20px', color: 'var(--navy, #0D2340)' }}>Add New Awardee</CardTitle>
                <CardDescription>Fill out the form to add a new award winner to the list.</CardDescription>
              </CardHeader>
              <AddAwardeeForm />
            </Card>

            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', paddingBottom: '12px', borderBottom: '2px solid var(--navy, #0D2340)', marginBottom: '16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold, #8C6A1A)' }}>Current</span>
                <h2 className="font-heading" style={{ fontSize: '22px', fontWeight: 600, color: 'var(--navy, #0D2340)' }}>Awardees</h2>
              </div>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--navy, #0D2340)' }} />
                </div>
              ) : (
                <AwardeesTable awardees={awardees} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-8">
            <div className="space-y-6">
              <VisualCertificateBuilder examType="RMTH" year={new Date().getFullYear()} />
              <VisualCertificateBuilder examType="RSTH" year={new Date().getFullYear()} />
            </div>

            <Card style={{ borderRadius: '2px', border: '1px solid var(--rule, #C8BFA8)' }}>
              <CardHeader style={{ borderBottom: '1px solid var(--rule, #C8BFA8)', background: 'white' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold, #8C6A1A)', marginBottom: '4px' }}>
                  Data
                </div>
                <CardTitle className="font-heading" style={{ fontSize: '20px', color: 'var(--navy, #0D2340)' }}>Upload Participation Data</CardTitle>
                <CardDescription>
                  Upload an Excel/CSV file with participant data (Admission No., Name, etc.). This data will be merged
                  with the templates above to generate the final certificates.
                </CardDescription>
              </CardHeader>
              <CertificateUploadForm />
            </Card>

            <Card style={{ borderRadius: '2px', border: '1px solid var(--rule, #C8BFA8)' }}>
              <CardHeader style={{ borderBottom: '1px solid var(--rule, #C8BFA8)', background: 'white' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold, #8C6A1A)', marginBottom: '4px' }}>
                  Records
                </div>
                <CardTitle className="font-heading" style={{ fontSize: '20px', color: 'var(--navy, #0D2340)' }}>Manage Students</CardTitle>
                <CardDescription>View, filter, edit, and delete student records. Filter by exam type, school, or class.</CardDescription>
              </CardHeader>
              <CardContent>
                {studentsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--navy, #0D2340)' }} />
                  </div>
                ) : (
                  <StudentsTable initialStudents={students} schools={schools} classes={classes} />
                )}
              </CardContent>
            </Card>

            <Card style={{ borderRadius: '2px', border: '1px solid var(--rule, #C8BFA8)' }}>
              <CardHeader style={{ borderBottom: '1px solid var(--rule, #C8BFA8)', background: 'white' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold, #8C6A1A)', marginBottom: '4px' }}>
                  Templates
                </div>
                <CardTitle className="font-heading" style={{ fontSize: '20px', color: 'var(--navy, #0D2340)' }}>Manage Certificate Templates</CardTitle>
                <CardDescription>View and manage all certificate templates. You can delete templates that are no longer needed.</CardDescription>
              </CardHeader>
              <CardContent>
                {templatesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--navy, #0D2340)' }} />
                  </div>
                ) : (
                  <CertificateTemplateManager templates={templates} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
