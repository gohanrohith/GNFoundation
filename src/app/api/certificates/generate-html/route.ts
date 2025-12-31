import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import CertificateTemplate from '@/models/CertificateTemplate';

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { admissionNumber } = await request.json();
    await connectDB();

    const student = await Student.findOne({ 
      admissionNumber: admissionNumber.toUpperCase().trim() 
    });
    
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const template = await CertificateTemplate.findOne({ 
      examType: student.examType, 
      year: student.year, 
      isActive: true 
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const html = generateCertificateHTML(student, template);

    // Use Gotenberg for PDF generation
    const gotenbergUrl = process.env.GOTENBERG_URL || 'http://localhost:3000';

    // Prepare form data for Gotenberg
    const formData = new FormData();
    formData.append('files', new Blob([html], { type: 'text/html' }), 'index.html');

    const isLandscape = template.orientation === 'landscape';

    // FIX: Explicitly type the params object to avoid TS error 2339
    const params: Record<string, string> = {
      marginTop: '0',
      marginBottom: '0',
      marginLeft: '0',
      marginRight: '0',
      printBackground: 'true',
      preferCSSPageSize: 'true',
    };

    if (isLandscape) {
      params.landscape = 'true';
    }

    const searchParams = new URLSearchParams(params);

    // Call Gotenberg API
    const response = await fetch(`${gotenbergUrl}/forms/chromium/convert/html?${searchParams}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Gotenberg conversion failed: ${response.statusText}`);
    }

    // This returns an ArrayBuffer
    const pdfBuffer = await response.arrayBuffer();

    // FIX: Pass ArrayBuffer directly to NextResponse to avoid TS error 2345
    return new NextResponse(pdfBuffer, { 
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Certificate_${admissionNumber}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateCertificateHTML(student: any, template: any) {
  const fields = template.fieldPositions || [];
  const fieldData: Record<string, string> = {
    '{admissionNumber}': student.admissionNumber || '',
    '{studentName}': student.studentName || '',
    '{school}': student.school || '',
    '{class}': student.class || '',
  };

  const isLandscape = template.orientation === 'landscape';
  // scaleFactor helps adjust pixel sizes to look correct in print
  const scaleFactor = 1.25; 

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page {
      size: ${isLandscape ? '297mm 210mm' : '210mm 297mm'};
      margin: 0;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: ${isLandscape ? '297mm' : '210mm'};
      height: ${isLandscape ? '210mm' : '297mm'};
      overflow: hidden;
      font-family: Arial, sans-serif;
    }
    body { position: relative; }
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${template.templateUrl}');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% 100%;
      z-index: -1;
    }
    .field { 
      position: absolute; 
      white-space: nowrap; 
      transform: translate(-50%, -50%); 
    }
  </style>
</head>
<body>
  <div class="bg"></div>
  ${fields.map((f: any) => `
    <div class="field" style="
        left: ${f.x}%; 
        top: ${f.y}%; 
        font-size: ${f.fontSize * scaleFactor}px; 
        font-family: ${f.fontFamily || 'Arial'}; 
        color: ${f.color || '#000000'};
        font-weight: ${f.id === 'studentName' ? 'bold' : 'normal'};
    ">
        ${fieldData[f.text] || f.text}
    </div>`).join('')}
</body>
</html>`;
}