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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Loader2, ExternalLink, Trash } from 'lucide-react';
import { deleteCertificateTemplate, deleteInactiveCertificateTemplates } from '../actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface CertificateTemplate {
  _id: string;
  examType: 'RMTH' | 'RSTH';
  year: number;
  templateUrl: string;
  orientation: 'portrait' | 'landscape';
  isActive: boolean;
  createdAt: string;
}

interface CertificateTemplateManagerProps {
  templates: CertificateTemplate[];
}

export function CertificateTemplateManager({ templates }: CertificateTemplateManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [deletingTemplate, setDeletingTemplate] = useState<CertificateTemplate | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);

  // Filter templates based on showInactive toggle
  const filteredTemplates = showInactive ? templates : templates.filter((t) => t.isActive);
  const inactiveCount = templates.filter((t) => !t.isActive).length;

  const handleDelete = async () => {
    if (!deletingTemplate) return;

    startTransition(async () => {
      const result = await deleteCertificateTemplate(deletingTemplate._id);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
        setDeletingTemplate(null);
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

  const handleCleanupInactive = async () => {
    startTransition(async () => {
      const result = await deleteInactiveCertificateTemplates();

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
        setShowCleanupDialog(false);
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

  if (templates.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        No certificate templates found. Upload a template to get started.
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredTemplates.length} of {templates.length} templates
          {inactiveCount > 0 && !showInactive && ` (${inactiveCount} inactive hidden)`}
        </div>
        <div className="flex gap-2">
          {inactiveCount > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={() => setShowInactive(!showInactive)}>
                {showInactive ? 'Hide Inactive' : 'Show Inactive'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowCleanupDialog(true)}
                disabled={isPending}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete All Inactive ({inactiveCount})
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam Type</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Orientation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.map((template) => (
              <TableRow key={template._id}>
                <TableCell className="font-medium">{template.examType}</TableCell>
                <TableCell>{template.year}</TableCell>
                <TableCell className="capitalize">{template.orientation}</TableCell>
                <TableCell>
                  {template.isActive ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(template.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(template.templateUrl, '_blank')}
                    title="View Template"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingTemplate(template)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingTemplate} onOpenChange={(open) => !open && setDeletingTemplate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {deletingTemplate?.examType} {deletingTemplate?.year} template. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cleanup Inactive Templates Dialog */}
      <AlertDialog open={showCleanupDialog} onOpenChange={(open) => !open && setShowCleanupDialog(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Inactive Templates?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {inactiveCount} inactive template(s) from both the database and Cloudinary.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCleanupInactive}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete All Inactive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
