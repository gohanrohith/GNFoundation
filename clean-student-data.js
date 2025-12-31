// Script to remove optional fields from all students in database
// Keeps only: admissionNumber, studentName, school, class, examType, year
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  admissionNumber: String,
  studentName: String,
  fatherName: String,
  school: String,
  class: String,
  examType: String,
  year: Number,
  marks: Number,
  rank: Number,
  grade: String,
  certificateGenerated: Boolean,
}, { timestamps: true });

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

async function cleanStudentData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Remove optional fields from all students
    const result = await Student.updateMany(
      {},
      {
        $unset: {
          fatherName: "",
          marks: "",
          rank: "",
          grade: ""
        }
      }
    );

    console.log('✓ Cleaned student data');
    console.log(`  Updated ${result.modifiedCount} students`);
    console.log('\nRemoved fields:');
    console.log('  - fatherName');
    console.log('  - marks');
    console.log('  - rank');
    console.log('  - grade');
    console.log('\nRemaining fields (the 4 you need):');
    console.log('  ✓ admissionNumber');
    console.log('  ✓ studentName');
    console.log('  ✓ school');
    console.log('  ✓ class');
    console.log('  ✓ examType');
    console.log('  ✓ year');

    // Show sample student
    const sample = await Student.findOne({ admissionNumber: 'RMTH2025001' });
    if (sample) {
      console.log('\nSample student after cleaning:');
      console.log('  Admission Number:', sample.admissionNumber);
      console.log('  Student Name:', sample.studentName);
      console.log('  School:', sample.school);
      console.log('  Class:', sample.class);
      console.log('  Exam Type:', sample.examType);
      console.log('  Year:', sample.year);
    }

    await mongoose.disconnect();
    console.log('\n✓ Done! Now certificates will only show 4 fields.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanStudentData();
