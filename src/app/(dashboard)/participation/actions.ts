'use server';

import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';

const schema = z.object({
  admissionNumber: z.string().min(1, 'Admission number is required.'),
  examType: z.enum(['RMTH', 'RSTH']).optional(),
});

export type FormState = {
  success: boolean;
  message: string;
  data?: {
    name: string;
    admissionNumber: string;
    examType?: string;
  };
};

export async function findCertificate(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = schema.safeParse({
    admissionNumber: formData.get('admissionNumber'),
    examType: formData.get('examType'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid admission number provided.',
    };
  }

  try {
    const admissionNumber = validatedFields.data.admissionNumber.toUpperCase().trim();
    const examType = validatedFields.data.examType;

    // Connect to MongoDB
    await connectDB();

    // Find student in database
    const query: any = { admissionNumber };
    if (examType) {
      query.examType = examType;
    }

    const student = await Student.findOne(query);

    if (!student) {
      return {
        success: false,
        message: examType
          ? `Admission number not found for ${examType} exam. Please check your admission number or try the other exam type.`
          : 'Admission number not found. Please contact your school office for assistance.',
      };
    }

    return {
      success: true,
      message: `Certificate found for ${student.studentName || student.admissionNumber}.`,
      data: {
        name: student.studentName || 'Student',
        admissionNumber: student.admissionNumber,
        examType: student.examType,
      },
    };
  } catch (error) {
    console.error('Certificate lookup error:', error);
    return {
      success: false,
      message: 'An error occurred while searching for your certificate. Please try again.',
    };
  }
}
