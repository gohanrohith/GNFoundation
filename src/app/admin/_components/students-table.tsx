'use client';

import { useState, useTransition, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Loader2, Filter } from 'lucide-react';
import { deleteStudent, updateStudent } from '../actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

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

interface StudentsTableProps {
  initialStudents: Student[];
  schools: string[];
  classes: string[];
}

export function StudentsTable({ initialStudents, schools, classes }: StudentsTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(initialStudents);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  // Filters
  const [selectedExamType, setSelectedExamType] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    setStudents(initialStudents);
    setFilteredStudents(initialStudents);
  }, [initialStudents]);

  useEffect(() => {
    let filtered = students;

    if (selectedExamType !== 'all') {
      filtered = filtered.filter((s) => s.examType === selectedExamType);
    }

    if (selectedSchool !== 'all') {
      filtered = filtered.filter((s) => s.school === selectedSchool);
    }

    if (selectedClass !== 'all') {
      filtered = filtered.filter((s) => s.class === selectedClass);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.admissionNumber.toLowerCase().includes(term) ||
          s.studentName.toLowerCase().includes(term) ||
          s.fatherName?.toLowerCase().includes(term)
      );
    }

    setFilteredStudents(filtered);
  }, [selectedExamType, selectedSchool, selectedClass, searchTerm, students]);

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setEditFormData({
      admissionNumber: student.admissionNumber,
      studentName: student.studentName,
      fatherName: student.fatherName || '',
      school: student.school,
      class: student.class,
      examType: student.examType,
      year: student.year,
      marks: student.marks || '',
      rank: student.rank || '',
      grade: student.grade || '',
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const formData = new FormData();
    Object.keys(editFormData).forEach((key) => {
      if (editFormData[key] !== '' && editFormData[key] !== undefined) {
        formData.append(key, editFormData[key]);
      }
    });

    startTransition(async () => {
      const result = await updateStudent(editingStudent._id, { success: false, message: '' }, formData);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
        setEditingStudent(null);
        router.refresh();
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  const handleDelete = async () => {
    if (!deletingStudent) return;

    startTransition(async () => {
      const result = await deleteStudent(deletingStudent._id);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
        setDeletingStudent(null);
        router.refresh();
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  const clearFilters = () => {
    setSelectedExamType('all');
    setSelectedSchool('all');
    setSelectedClass('all');
    setSearchTerm('');
  };

  return (
    <>
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4" />
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Search</Label>
            <Input
              placeholder="Admission No. or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Exam Type</Label>
            <Select value={selectedExamType} onValueChange={setSelectedExamType}>
              <SelectTrigger>
                <SelectValue placeholder="All Exams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                <SelectItem value="RMTH">RMTH</SelectItem>
                <SelectItem value="RSTH">RSTH</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>School</Label>
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger>
                <SelectValue placeholder="All Schools" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {schools.map((school) => (
                  <SelectItem key={school} value={school}>
                    {school}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Admission No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Father Name</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Exam Type</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">{student.admissionNumber}</TableCell>
                    <TableCell>{student.studentName}</TableCell>
                    <TableCell>{student.fatherName || '-'}</TableCell>
                    <TableCell>{student.school}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.examType}</TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell>{student.marks || '-'}</TableCell>
                    <TableCell>{student.rank || '-'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(student)}
                        disabled={isPending}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingStudent(student)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update the student information below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-admissionNumber">Admission Number *</Label>
                <Input
                  id="edit-admissionNumber"
                  value={editFormData.admissionNumber || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, admissionNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-studentName">Student Name *</Label>
                <Input
                  id="edit-studentName"
                  value={editFormData.studentName || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, studentName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fatherName">Father Name</Label>
                <Input
                  id="edit-fatherName"
                  value={editFormData.fatherName || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, fatherName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-school">School *</Label>
                <Input
                  id="edit-school"
                  value={editFormData.school || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, school: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-class">Class *</Label>
                <Input
                  id="edit-class"
                  value={editFormData.class || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, class: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-examType">Exam Type *</Label>
                <Select
                  value={editFormData.examType || ''}
                  onValueChange={(value) => setEditFormData({ ...editFormData, examType: value })}
                >
                  <SelectTrigger id="edit-examType">
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RMTH">RMTH</SelectItem>
                    <SelectItem value="RSTH">RSTH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-year">Year *</Label>
                <Input
                  id="edit-year"
                  type="number"
                  value={editFormData.year || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-marks">Marks</Label>
                <Input
                  id="edit-marks"
                  type="number"
                  value={editFormData.marks || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, marks: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rank">Rank</Label>
                <Input
                  id="edit-rank"
                  type="number"
                  value={editFormData.rank || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, rank: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-grade">Grade</Label>
                <Input
                  id="edit-grade"
                  value={editFormData.grade || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, grade: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingStudent(null)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingStudent} onOpenChange={(open) => !open && setDeletingStudent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete student &quot;{deletingStudent?.studentName}&quot; ({deletingStudent?.admissionNumber}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
