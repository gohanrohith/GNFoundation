import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CertificateTemplate from '@/models/CertificateTemplate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { examType, year, fieldPositions } = body;

    if (!examType || !year) {
      return NextResponse.json(
        { error: 'Exam type and year are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update the active template's field positions
    const result = await CertificateTemplate.findOneAndUpdate(
      { examType, year, isActive: true },
      { fieldPositions },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Template not found. Please upload a template first.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Field positions updated successfully',
    });
  } catch (error: any) {
    console.error('Update field positions error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update field positions' },
      { status: 500 }
    );
  }
}
