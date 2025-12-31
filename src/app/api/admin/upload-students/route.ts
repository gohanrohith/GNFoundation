import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';

export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const examType = formData.get('examType') as 'RMTH' | 'RSTH';
    const year = parseInt(formData.get('year') as string);

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!examType || !year) {
      return NextResponse.json(
        { error: 'Exam type and year are required' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Excel file is empty' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Process and save students
    const students = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row: any = data[i];

      try {
        // Map Excel columns to student fields
        // Expected columns: Admission Number, Student Name, Father Name, School, Class, Marks, Rank, Grade
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
          year,
          marks: row['Marks'] || row['marks'] ? parseFloat(row['Marks'] || row['marks']) : undefined,
          rank: row['Rank'] || row['rank'] ? parseInt(row['Rank'] || row['rank']) : undefined,
          grade: row['Grade']?.toString().trim() || row['grade']?.toString().trim() || undefined,
          certificateGenerated: false,
        };

        // Validate required fields
        if (!studentData.admissionNumber || !studentData.studentName ||
            !studentData.fatherName || !studentData.school || !studentData.class) {
          errors.push({
            row: i + 2, // Excel row (1-indexed + header row)
            error: 'Missing required fields',
            data: row,
          });
          continue;
        }

        // Upsert student (update if exists, insert if not)
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
          data: row,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${students.length} students`,
      studentsProcessed: students.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Upload students error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload students' },
      { status: 500 }
    );
  }
}
