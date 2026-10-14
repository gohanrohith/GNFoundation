import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import { verifyAuth } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  const auth = verifyAuth();
  if (!auth.success) return auth.response;

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

    const [students, filterAgg] = await Promise.all([
      Student.find(query).sort({ createdAt: -1 }).lean(),
      Student.aggregate([
        { $group: { _id: null, schools: { $addToSet: '$school' }, classes: { $addToSet: '$class' } } },
      ]),
    ]);

    const agg = filterAgg[0] ?? { schools: [], classes: [] };
    const schools = (agg.schools as (string | null)[]).filter(Boolean).sort() as string[];
    const classes = (agg.classes as (string | null)[]).filter(Boolean).sort() as string[];

    return NextResponse.json({
      success: true,
      students,
      filters: { schools, classes },
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
