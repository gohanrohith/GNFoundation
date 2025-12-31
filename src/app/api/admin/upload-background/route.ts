import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const examType = formData.get('examType') as string;
    const year = formData.get('year') as string;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine resource type based on file type
    const fileType = file.type;
    const resourceType = fileType === 'application/pdf' ? 'raw' : 'image';

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      buffer,
      `certificate-backgrounds/${examType}/${year}`,
      resourceType
    );

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    });
  } catch (error: any) {
    console.error('Background upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload background' },
      { status: 500 }
    );
  }
}
