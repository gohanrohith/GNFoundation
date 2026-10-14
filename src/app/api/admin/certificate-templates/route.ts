import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CertificateTemplate from '@/models/CertificateTemplate';
import { verifyAuth } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  const auth = verifyAuth();
  if (!auth.success) return auth.response;

  try {
    await connectDB();

    const templates = await CertificateTemplate.find({})
      .sort({ year: -1, examType: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      templates: templates,
    });
  } catch (error: any) {
    console.error('Error fetching certificate templates:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch certificate templates',
      },
      { status: 500 }
    );
  }
}
