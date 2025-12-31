import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const examType = searchParams.get('examType');
    const school = searchParams.get('school');
    const studentClass = searchParams.get('class');
    const year = searchParams.get('year');

    await connectDB();

    // Build query
    const query: any = {};
    if (examType) query.examType = examType;
    if (school) query.school = school;
    if (studentClass) query.class = studentClass;
    if (year) query.year = parseInt(year);

    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Get unique schools and classes for filters
    const allStudents = await Student.find({}).lean();
    const schools = [...new Set(allStudents.map((s: any) => s.school).filter(Boolean))];
    const classes = [...new Set(allStudents.map((s: any) => s.class).filter(Boolean))];

    return NextResponse.json({
      success: true,
      students,
      filters: {
        schools: schools.sort(),
        classes: classes.sort(),
      },
    });
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch students',
      },
      { status: 500 }
    );
  }
}
