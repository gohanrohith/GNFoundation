'use client';

import { useState, useTransition } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { deleteAwardee, updateAwardee } from '../actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface Awardee {
  _id: string;
  name: string;
  award: string;
  year: number;
  school: string;
  class: string;
  imageUrl?: string;
  imageId?: string;
  examType: 'RMTH' | 'RSTH';
  rank: number;
  marks?: number;
}

export function AwardeesTable({ awardees }: { awardees: Awardee[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [editingAwardee, setEditingAwardee] = useState<Awardee | null>(null);
  const [deletingAwardee, setDeletingAwardee] = useState<Awardee | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleEdit = (awardee: Awardee) => {
    setEditingAwardee(awardee);
    setEditFormData({
      name: awardee.name,
      award: awardee.award,
      examType: awardee.examType,
      year: awardee.year,
      class: awardee.class,
      school: awardee.school,
      rank: awardee.rank,
      marks: awardee.marks || '',
    });
    setSelectedImage(null);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAwardee) return;

    const formData = new FormData();
    Object.keys(editFormData).forEach((key) => {
      if (editFormData[key] !== '' && editFormData[key] !== undefined) {
        formData.append(key, editFormData[key]);
      }
    });

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    startTransition(async () => {
      const result = await updateAwardee(editingAwardee._id, { success: false, message: '' }, formData);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
        setEditingAwardee(null);
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
    if (!deletingAwardee) return;

    startTransition(async () => {
      const result = await deleteAwardee(deletingAwardee._id);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
        setDeletingAwardee(null);
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

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Award</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Exam Type</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {awardees.map((awardee) => (
              <TableRow key={awardee._id}>
                <TableCell className="font-medium">{awardee.name}</TableCell>
                <TableCell>{awardee.award}</TableCell>
                <TableCell>{awardee.year}</TableCell>
                <TableCell>{awardee.school}</TableCell>
                <TableCell>{awardee.class}</TableCell>
                <TableCell>{awardee.examType}</TableCell>
                <TableCell>{awardee.rank}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(awardee)}
                    disabled={isPending}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingAwardee(awardee)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingAwardee} onOpenChange={(open) => !open && setEditingAwardee(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Awardee</DialogTitle>
            <DialogDescription>Update the awardee information below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-award">Award *</Label>
                <Input
                  id="edit-award"
                  value={editFormData.award || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, award: e.target.value })}
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
                <Label htmlFor="edit-class">Class *</Label>
                <Input
                  id="edit-class"
                  value={editFormData.class || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, class: e.target.value })}
                  required
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
                <Label htmlFor="edit-rank">Rank *</Label>
                <Input
                  id="edit-rank"
                  type="number"
                  value={editFormData.rank || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, rank: e.target.value })}
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Update Image (optional)</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingAwardee(null)} disabled={isPending}>
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
      <AlertDialog open={!!deletingAwardee} onOpenChange={(open) => !open && setDeletingAwardee(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the awardee &quot;{deletingAwardee?.name}&quot;. This action cannot be undone.
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
