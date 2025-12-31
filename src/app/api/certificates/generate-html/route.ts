// src/app/api/certificates/generate-html/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import CertificateTemplate from '@/models/CertificateTemplate';

// Set max duration for serverless function (Vercel)
export const maxDuration = 60; // 60 seconds
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { admissionNumber } = await request.json();
    await connectDB();

    const student = await Student.findOne({ admissionNumber: admissionNumber.toUpperCase().trim() });
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

    const template = await CertificateTemplate.findOne({ examType: student.examType, year: student.year, isActive: true });
    if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

    const html = generateCertificateHTML(student, template);

    // Dynamically import puppeteer and chromium only at runtime
    const puppeteer = (await import('puppeteer-core')).default;
    const chromium = (await import('@sparticuz/chromium')).default;

    // Determine if we're in development or production
    const isDev = process.env.NODE_ENV === 'development';

    // Configure browser launch options based on environment
    let launchOptions;
    if (isDev) {
      // For local development, try to find Chrome on Windows
      const chromePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.CHROME_PATH, // Allow custom path via env variable
      ].filter(Boolean);

      launchOptions = {
        headless: true,
        executablePath: chromePaths[0], // Use first available path
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      };
    } else {
      // Use chromium for serverless environments (Vercel)
      launchOptions = {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      };
    }

    const browser = await puppeteer.launch(launchOptions);

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