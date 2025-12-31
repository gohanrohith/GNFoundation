'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Awardee from '@/models/Awardee';
import { uploadToCloudinary } from '@/lib/cloudinary';

const awardeeSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  award: z.string().min(1, 'Award is required.'),
  examType: z.enum(['RMTH', 'RSTH'], { required_error: 'Exam type is required.' }),
  year: z.coerce.number().min(2000, 'Year must be valid.'),
  class: z.string().min(1, 'Class is required.'),
  school: z.string().min(1, 'School is required.'),
  rank: z.coerce.number().min(1, 'Rank is required.'),
  marks: z.coerce.number().min(0).optional(),
});

export type FormState = {
  success: boolean;
  message: string;
};

export async function addAwardee(prevState: FormState, formData: FormData): Promise<FormState> {
  const image = formData.get('image') as File;

  if (!image || image.size === 0) {
    return {
      success: false,
      message: 'Please upload a student photo.',
    };
  }

  const validatedFields = awardeeSchema.safeParse({
    name: formData.get('name'),
    award: formData.get('award'),
    examType: formData.get('examType'),
    year: formData.get('year'),
    class: formData.get('class'),
    school: formData.get('school'),
    rank: formData.get('rank'),
    marks: formData.get('marks') || undefined,
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map((e) => e.message).join(' ');
    return {
      success: false,
      message: `There was an error with your submission: ${errorMessages}`,
    };
  }

  try {
    // Upload image to Cloudinary
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await uploadToCloudinary(
      buffer,
      'awardees',
      'image'
    );

    // Connect to MongoDB and save awardee
    await connectDB();

    await Awardee.create({
      ...validatedFields.data,
      imageUrl: uploadResult.url,
    });

    revalidatePath('/awards');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'New awardee has been added successfully.',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Failed to add awardee. Please check the server logs.',
    };
  }
}

export async function uploadCertificateData(prevState: FormState, formData: FormData): Promise<FormState> {
    const file = formData.get('certificateFile') as File;
    const examType = formData.get('examType') as string;
    const year = formData.get('year') as string;

    if (!file || file.size === 0) {
        return { success: false, message: 'Please select a file to upload.' };
    }

    if (!examType || !year) {
        return { success: false, message: 'Please select exam type and year.' };
    }

    try {
        // Import XLSX
        const XLSX = await import('xlsx');

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Parse Excel file
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        if (!data || data.length === 0) {
            return {
                success: false,
                message: 'Excel file is empty'
            };
        }

        // Connect to MongoDB
        await connectDB();

        // Import Student model
        const Student = (await import('@/models/Student')).default;

        // Process and save students
        const students = [];
        const errors = [];

        for (let i = 0; i < data.length; i++) {
            const row: any = data[i];

            try {
                // Map Excel columns to student fields
                const studentData = {
                    admissionNumber: row['Admission Number']?.toString().trim().toUpperCase() ||
                                    row['admissionNumber']?.toString().trim().toUpperCase() ||
                                    row['AdmissionNumber']?.toString().trim().toUpperCase(),
                    studentName: row['Student Name']?.toString().trim() ||
                                row['studentName']?.toString().trim() ||
                                row['StudentName']?.toString().trim(),
                    fatherName: row['Father Name']?.toString().trim() ||
                               row['fatherName']?.toString().trim() ||
                               row['FatherName']?.toString().trim(),
                    school: row['School']?.toString().trim() ||
                           row['school']?.toString().trim(),
                    class: row['Class']?.toString().trim() ||
                          row['class']?.toString().trim(),
                    examType,
                    year: parseInt(year),
                    marks: row['Marks'] || row['marks'] ? parseFloat(row['Marks'] || row['marks']) : undefined,
                    rank: row['Rank'] || row['rank'] ? parseInt(row['Rank'] || row['rank']) : undefined,
                    grade: row['Grade']?.toString().trim() || row['grade']?.toString().trim() || undefined,
                    certificateGenerated: false,
                };

                // Validate required fields (only 4 required)
                if (!studentData.admissionNumber || !studentData.studentName ||
                    !studentData.school || !studentData.class) {
                    errors.push({
                        row: i + 2,
                        error: 'Missing required fields (Admission Number, Student Name, School, Class)',
                    });
                    continue;
                }

                // Upsert student
                await Student.findOneAndUpdate(
                    { admissionNumber: studentData.admissionNumber },
                    studentData,
                    { upsert: true, new: true }
                );

                students.push(studentData.admissionNumber);
            } catch (error: any) {
                errors.push({
                    row: i + 2,
                    error: error.message,
                });
            }
        }

        revalidatePath('/admin');

        return {
            success: true,
            message: `Successfully processed ${students.length} students${errors.length > 0 ? ` (${errors.length} errors)` : ''}`
        };
    } catch (error: any) {
        console.error('Upload error:', error);
        return {
            success: false,
            message: error.message || 'Failed to upload student data. Please try again.'
        };
    }
}


export async function replaceTemplate(prevState: FormState, formData: FormData): Promise<FormState> {
    const file = formData.get('templateFile') as File;
    const templateType = formData.get('templateType') as string;
    const year = formData.get('year') as string;

    if (!file || file.size === 0) {
        return { success: false, message: 'Please select a file to upload.' };
    }

    if (!templateType) {
        return { success: false, message: 'Template type is missing.' };
    }

    if (!year) {
        return { success: false, message: 'Please select a year for the template.' };
    }

    try {
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload PDF to Cloudinary
        const uploadResult = await uploadToCloudinary(
            buffer,
            `certificate-templates/${templateType}/${year}`,
            'raw' // PDF files are uploaded as raw
        );

        // Connect to MongoDB
        await connectDB();

        // Import CertificateTemplate model
        const CertificateTemplate = (await import('@/models/CertificateTemplate')).default;

        // Deactivate old templates for this exam type and year
        await CertificateTemplate.updateMany(
            { examType: templateType, year: parseInt(year), isActive: true },
            { isActive: false }
        );

        // Create new template
        await CertificateTemplate.create({
            examType: templateType,
            year: parseInt(year),
            templateUrl: uploadResult.url,
            cloudinaryPublicId: uploadResult.publicId,
            fieldPositions: {},
            isActive: true,
        });

        revalidatePath('/admin');

        return {
            success: true,
            message: `Template for ${templateType} ${year} has been uploaded successfully.`
        };
    } catch (error: any) {
        console.error('Template upload error:', error);
        return {
            success: false,
            message: error.message || 'Failed to upload template. Please try again.'
        };
    }
}

export async function deleteAwardee(awardeeId: string): Promise<FormState> {
    try {
        await connectDB();

        const deletedAwardee = await Awardee.findByIdAndDelete(awardeeId);

        if (!deletedAwardee) {
            return {
                success: false,
                message: 'Awardee not found.'
            };
        }

        revalidatePath('/awards');
        revalidatePath('/admin');

        return {
            success: true,
            message: 'Awardee has been deleted successfully.'
        };
    } catch (error: any) {
        console.error('Delete error:', error);
        return {
            success: false,
            message: error.message || 'Failed to delete awardee. Please try again.'
        };
    }
}

export async function updateAwardee(awardeeId: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = awardeeSchema.safeParse({
        name: formData.get('name'),
        award: formData.get('award'),
        examType: formData.get('examType'),
        year: formData.get('year'),
        class: formData.get('class'),
        school: formData.get('school'),
        rank: formData.get('rank'),
        marks: formData.get('marks') || undefined,
    });

    if (!validatedFields.success) {
        const errorMessages = validatedFields.error.errors.map((e) => e.message).join(' ');
        return {
            success: false,
            message: `There was an error with your submission: ${errorMessages}`,
        };
    }

    try {
        await connectDB();

        const updateData: any = { ...validatedFields.data };

        // Handle image upload if a new image is provided
        const image = formData.get('image') as File;
        if (image && image.size > 0) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult = await uploadToCloudinary(
                buffer,
                'awardees',
                'image'
            );

            updateData.imageUrl = uploadResult.url;
        }

        const updatedAwardee = await Awardee.findByIdAndUpdate(
            awardeeId,
            updateData,
            { new: true }
        );

        if (!updatedAwardee) {
            return {
                success: false,
                message: 'Awardee not found.'
            };
        }

        revalidatePath('/awards');
        revalidatePath('/admin');

        return {
            success: true,
            message: 'Awardee has been updated successfully.'
        };
    } catch (error: any) {
        console.error('Update error:', error);
        return {
            success: false,
            message: error.message || 'Failed to update awardee. Please try again.'
        };
    }
}

export async function deleteCertificateTemplate(templateId: string): Promise<FormState> {
    try {
        await connectDB();

        const CertificateTemplate = (await import('@/models/CertificateTemplate')).default;

        const deletedTemplate = await CertificateTemplate.findByIdAndDelete(templateId);

        if (!deletedTemplate) {
            return {
                success: false,
                message: 'Template not found.'
            };
        }

        // Delete from Cloudinary if publicId exists
        if (deletedTemplate.cloudinaryPublicId) {
            try {
                const cloudinary = (await import('cloudinary')).v2;
                await cloudinary.uploader.destroy(deletedTemplate.cloudinaryPublicId, { resource_type: 'raw' });
            } catch (cloudinaryError) {
                console.error('Failed to delete from Cloudinary:', cloudinaryError);
                // Continue even if Cloudinary deletion fails
            }
        }

        revalidatePath('/admin');

        return {
            success: true,
            message: 'Certificate template has been deleted successfully.'
        };
    } catch (error: any) {
        console.error('Delete template error:', error);
        return {
            success: false,
            message: error.message || 'Failed to delete template. Please try again.'
        };
    }
}

export async function deleteInactiveCertificateTemplates(): Promise<FormState> {
    try {
        await connectDB();

        const CertificateTemplate = (await import('@/models/CertificateTemplate')).default;

        // Find all inactive templates
        const inactiveTemplates = await CertificateTemplate.find({ isActive: false });

        if (inactiveTemplates.length === 0) {
            return {
                success: true,
                message: 'No inactive templates to delete.'
            };
        }

        // Delete from Cloudinary
        const cloudinary = (await import('cloudinary')).v2;
        for (const template of inactiveTemplates) {
            if (template.cloudinaryPublicId) {
                try {
                    await cloudinary.uploader.destroy(template.cloudinaryPublicId, { resource_type: 'raw' });
                } catch (cloudinaryError) {
                    console.error(`Failed to delete ${template.cloudinaryPublicId} from Cloudinary:`, cloudinaryError);
                    // Continue even if Cloudinary deletion fails
                }
            }
        }

        // Delete from database
        const result = await CertificateTemplate.deleteMany({ isActive: false });

        revalidatePath('/admin');

        return {
            success: true,
            message: `Successfully deleted ${result.deletedCount} inactive template(s) from database and Cloudinary.`
        };
    } catch (error: any) {
        console.error('Delete inactive templates error:', error);
        return {
            success: false,
            message: error.message || 'Failed to delete inactive templates. Please try again.'
        };
    }
}

const studentSchema = z.object({
    admissionNumber: z.string().min(1, 'Admission number is required.'),
    studentName: z.string().min(1, 'Student name is required.'),
    fatherName: z.string().optional(),
    school: z.string().min(1, 'School is required.'),
    class: z.string().min(1, 'Class is required.'),
    examType: z.enum(['RMTH', 'RSTH'], { required_error: 'Exam type is required.' }),
    year: z.coerce.number().min(2000, 'Year must be valid.'),
    marks: z.coerce.number().min(0).optional(),
    rank: z.coerce.number().min(1).optional(),
    grade: z.string().optional(),
});

export async function updateStudent(studentId: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = studentSchema.safeParse({
        admissionNumber: formData.get('admissionNumber'),
        studentName: formData.get('studentName'),
        fatherName: formData.get('fatherName') || undefined,
        school: formData.get('school'),
        class: formData.get('class'),
        examType: formData.get('examType'),
        year: formData.get('year'),
        marks: formData.get('marks') || undefined,
        rank: formData.get('rank') || undefined,
        grade: formData.get('grade') || undefined,
    });

    if (!validatedFields.success) {
        const errorMessages = validatedFields.error.errors.map((e) => e.message).join(' ');
        return {
            success: false,
            message: `Validation error: ${errorMessages}`,
        };
    }

    try {
        await connectDB();
        const Student = (await import('@/models/Student')).default;

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            validatedFields.data,
            { new: true }
        );

        if (!updatedStudent) {
            return {
                success: false,
                message: 'Student not found.'
            };
        }

        revalidatePath('/admin');

        return {
            success: true,
            message: 'Student has been updated successfully.'
        };
    } catch (error: any) {
        console.error('Update student error:', error);
        return {
            success: false,
            message: error.message || 'Failed to update student. Please try again.'
        };
    }
}

export async function deleteStudent(studentId: string): Promise<FormState> {
    try {
        await connectDB();
        const Student = (await import('@/models/Student')).default;

        const deletedStudent = await Student.findByIdAndDelete(studentId);

        if (!deletedStudent) {
            return {
                success: false,
                message: 'Student not found.'
            };
        }

        revalidatePath('/admin');

        return {
            success: true,
            message: 'Student has been deleted successfully.'
        };
    } catch (error: any) {
        console.error('Delete student error:', error);
        return {
            success: false,
            message: error.message || 'Failed to delete student. Please try again.'
        };
    }
}