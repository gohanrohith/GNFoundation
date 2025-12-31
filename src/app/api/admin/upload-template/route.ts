import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CertificateTemplate from '@/models/CertificateTemplate';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const examType = formData.get('examType') as 'RMTH' | 'RSTH';
    const year = parseInt(formData.get('year') as string);
    const fieldPositionsStr = formData.get('fieldPositions') as string;

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

    // Upload PDF to Cloudinary
    const uploadResult = await uploadToCloudinary(
      buffer,
      `certificate-templates/${examType}/${year}`,
      'raw' // PDF files are uploaded as raw
    );

    // Parse field positions if provided
    let fieldPositions = {};
    if (fieldPositionsStr) {
      try {
        fieldPositions = JSON.parse(fieldPositionsStr);
      } catch (e) {
        console.warn('Invalid field positions JSON, using empty object');
      }
    }

    // Connect to MongoDB
    await connectDB();

    // Deactivate old templates for this exam type and year
    await CertificateTemplate.updateMany(
      { examType, year, isActive: true },
      { isActive: false }
    );

    // Create new template
    const template = await CertificateTemplate.create({
      examType,
      year,
      templateUrl: uploadResult.url,
      cloudinaryPublicId: uploadResult.publicId,
      fieldPositions,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Certificate template uploaded successfully',
      template: {
        id: template._id,
        examType: template.examType,
        year: template.year,
        templateUrl: template.templateUrl,
      },
    });
  } catch (error: any) {
    console.error('Upload template error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload template' },
      { status: 500 }
    );
  }
}
