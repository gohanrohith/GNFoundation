import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import CertificateTemplate from '@/models/CertificateTemplate';
import { format } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { admissionNumber } = body;

    if (!admissionNumber) {
      return NextResponse.json(
        { error: 'Admission number is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find student
    const student = await Student.findOne({
      admissionNumber: admissionNumber.toUpperCase().trim(),
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found. Please check your admission number.' },
        { status: 404 }
      );
    }

    // Find active template for this exam type and year
    const template = await CertificateTemplate.findOne({
      examType: student.examType,
      year: student.year,
      isActive: true,
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Certificate template not available for this exam' },
        { status: 404 }
      );
    }

    // Download template PDF from Cloudinary
    const templateResponse = await fetch(template.templateUrl);
    if (!templateResponse.ok) {
      throw new Error('Failed to download certificate template');
    }
    const templateBytes = await templateResponse.arrayBuffer();

    // Load PDF template
    const pdfDoc = await PDFDocument.load(templateBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { height } = firstPage.getSize();

    // Embed fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Get field positions - merge template positions with defaults
    // This ensures any missing fields get default values
    const defaultPos = getDefaultPositions();
    const templatePos = template.fieldPositions || {};

    // Merge: use template positions if they exist and are valid, otherwise use defaults
    const positions: any = {};
    for (const [key, defaultValue] of Object.entries(defaultPos)) {
      const templateValue = templatePos[key as keyof typeof templatePos];
      // Use template position if it has valid x, y, fontSize
      if (templateValue && typeof templateValue.x === 'number' && typeof templateValue.y === 'number') {
        positions[key] = templateValue;
      } else {
        positions[key] = defaultValue;
      }
    }

    // Helper function to draw text with validation
    const drawText = (
      text: string,
      position: { x: number; y: number; fontSize: number } | undefined,
      useBold = false
    ) => {
      if (!text || !position) return;

      // Validate position values
      const x = Number(position.x);
      const y = Number(position.y);
      const fontSize = Number(position.fontSize) || 12;

      if (isNaN(x) || isNaN(y) || isNaN(fontSize)) {
        console.warn(`Invalid position values for text "${text}":`, position);
        return;
      }

      firstPage.drawText(text, {
        x: x,
        y: height - y, // PDF coordinates start from bottom
        size: fontSize,
        font: useBold ? fontBold : font,
        color: rgb(0, 0, 0),
      });
    };

    // Fill in student data
    if (positions.admissionNumber) {
      drawText(student.admissionNumber, positions.admissionNumber);
    }

    if (positions.studentName && student.studentName) {
      drawText(student.studentName, positions.studentName, true);
    }

    if (positions.fatherName && student.fatherName) {
      drawText(student.fatherName, positions.fatherName);
    }

    if (positions.school && student.school) {
      drawText(student.school, positions.school);
    }

    if (positions.class && student.class) {
      drawText(student.class, positions.class);
    }

    if (positions.marks && student.marks) {
      drawText(student.marks.toString(), positions.marks);
    }

    if (positions.rank && student.rank) {
      drawText(student.rank.toString(), positions.rank, true);
    }

    if (positions.grade && student.grade) {
      drawText(student.grade, positions.grade);
    }

    if (positions.date) {
      const dateStr = format(new Date(), 'dd/MM/yyyy');
      drawText(dateStr, positions.date);
    }

    // Save the filled PDF
    const pdfBytes = await pdfDoc.save();

    // Mark certificate as generated
    student.certificateGenerated = true;
    await student.save();

    // Return PDF as download
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${student.examType}_${student.year}_${student.admissionNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}

// Default field positions - ONLY for the 4 required fields
// Optional fields (fatherName, marks, rank, grade, date) have no defaults
// They will only appear if explicitly configured in the admin panel
function getDefaultPositions() {
  return {
    // Only the 4 required fields
    admissionNumber: { x: 450, y: 750, fontSize: 12 },
    studentName: { x: 150, y: 450, fontSize: 24 },
    school: { x: 150, y: 350, fontSize: 14 },
    class: { x: 150, y: 300, fontSize: 14 },
  };
}
