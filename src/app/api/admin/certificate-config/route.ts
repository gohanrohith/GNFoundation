import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CertificateConfig from '@/models/CertificateConfig';

// GET - Load certificate configuration
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

    const config = await CertificateConfig.findOne({
      examType,
      year: parseInt(year),
      isActive: true,
    });

    if (!config) {
      // Return default configuration
      return NextResponse.json({
        config: {
          organizationName: 'GN Foundation',
          certificateTitle: 'Certificate of Participation',
          primaryColor: '#667eea',
          secondaryColor: '#764ba2',
          textColor: '#333333',
          backgroundColor: '#ffffff',
          titleFont: 'Georgia, serif',
          bodyFont: 'Arial, sans-serif',
          subtitleText: 'For successful participation in the {examType} Examination {year}',
          footerText: 'Keep up the excellent work!',
          showLogo: true,
          borderStyle: 'double',
          borderColor: '#667eea',
          showSignature: true,
          signatureText: 'Authorized Signature',
        },
      });
    }

    return NextResponse.json({ config });
  } catch (error: any) {
    console.error('Failed to load config:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load configuration' },
      { status: 500 }
    );
  }
}

// POST - Save certificate configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { examType, year, ...configData } = body;

    if (!examType || !year) {
      return NextResponse.json(
        { error: 'examType and year are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Deactivate old configs
    await CertificateConfig.updateMany(
      { examType, year, isActive: true },
      { isActive: false }
    );

    // Create new config
    const config = await CertificateConfig.create({
      examType,
      year,
      ...configData,
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      config,
    });
  } catch (error: any) {
    console.error('Failed to save config:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save configuration' },
      { status: 500 }
    );
  }
}
