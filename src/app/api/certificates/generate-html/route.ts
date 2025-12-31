// src/app/api/certificates/generate-html/route.ts
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import CertificateTemplate from '@/models/CertificateTemplate';

export async function POST(request: NextRequest) {
  try {
    const { admissionNumber } = await request.json();
    await connectDB();

    const student = await Student.findOne({ admissionNumber: admissionNumber.toUpperCase().trim() });
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

    const template = await CertificateTemplate.findOne({ examType: student.examType, year: student.year, isActive: true });
    if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

    const html = generateCertificateHTML(student, template);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: template.orientation === 'landscape',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();
        // Explicitly wrap the Uint8Array in a Buffer
    return new NextResponse(Buffer.from(pdfBuffer), { 
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Certificate_${admissionNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateCertificateHTML(student: any, template: any) {
  const fields = template.fieldPositions || [];
  const fieldData: any = {
    '{admissionNumber}': student.admissionNumber || '',
    '{studentName}': student.studentName || '',
    '{school}': student.school || '',
    '{class}': student.class || '',
  };

  const isLandscape = template.orientation === 'landscape';
  
  // Scale factor: UI font sizes (e.g. 28px) are designed on small screens.
  // On a real A4 PDF at 96dpi, we need to boost this slightly for readability.
  const scaleFactor = 1.25; 

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; width: ${isLandscape ? '297mm' : '210mm'}; height: ${isLandscape ? '210mm' : '297mm'}; position: relative; }
    .bg { position: absolute; width: 100%; height: 100%; background: url('${template.templateUrl}') no-repeat center/cover; }
    .field { 
        position: absolute; 
        white-space: nowrap; 
        transform: translate(-50%, -50%); /* Match the builder's anchor point */
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
        font-family: ${f.fontFamily}; 
        color: ${f.color};
        font-weight: ${f.id === 'studentName' ? 'bold' : 'normal'};
    ">
        ${fieldData[f.text] || f.text}
    </div>`).join('')}
</body>
</html>`;
}