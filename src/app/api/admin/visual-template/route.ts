import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CertificateTemplate from '@/models/CertificateTemplate';

// GET - Load visual template configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const examType = searchParams.get('examType');
    const year = searchParams.get('year');

    if (!examType || !year) {
      return NextResponse.json(
        { error: 'examType and year are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const template = await CertificateTemplate.findOne({
      examType,
      year: parseInt(year),
      isActive: true,
    });

    if (!template) {
      return NextResponse.json({ config: null });
    }

    // Convert old object format to new array format if needed
    let fields = template.fieldPositions;
    if (fields && !Array.isArray(fields)) {
      // Old format - convert to array
      fields = [
        { id: 'admissionNumber', ...fields.admissionNumber, text: '{admissionNumber}', name: 'Admission Number' },
        { id: 'studentName', ...fields.studentName, text: '{studentName}', name: 'Student Name' },
        { id: 'school', ...fields.school, text: '{school}', name: 'School' },
        { id: 'class', ...fields.class, text: '{class}', name: 'Class' },
      ].filter(f => f.x !== undefined); // Only include fields that have positions
    }

    return NextResponse.json({
      config: {
        backgroundImage: template.templateUrl || '',
        fields: fields || [],
        orientation: template.orientation || 'portrait',
      },
    });
  } catch (error: any) {
    console.error('Failed to load template:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load template' },
      { status: 500 }
    );
  }
}

// POST - Save visual template configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { examType, year, backgroundImage, fields, orientation } = body;

    console.log('Saving visual template:', { examType, year, hasBackground: !!backgroundImage, fieldCount: fields?.length, orientation });

    if (!examType || !year) {
      return NextResponse.json(
        { error: 'examType and year are required' },
        { status: 400 }
      );
    }

    if (!backgroundImage) {
      return NextResponse.json(
        { error: 'Please upload a background image first' },
        { status: 400 }
      );
    }

    await connectDB();

    // Deactivate old templates
    await CertificateTemplate.updateMany(
      { examType, year: parseInt(year), isActive: true },
      { isActive: false }
    );

    // Save new template
    const template = await CertificateTemplate.create({
      examType,
      year: parseInt(year),
      templateUrl: backgroundImage,
      fieldPositions: fields,
      orientation: orientation || 'portrait',
      isActive: true,
    });

    console.log('Template saved successfully:', template._id);

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error: any) {
    console.error('Failed to save template:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save template' },
      { status: 500 }
    );
  }
}
