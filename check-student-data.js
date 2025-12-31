// Quick script to check what data is in the database for a student
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

async function checkStudent(admissionNumber) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const student = await Student.findOne({
      admissionNumber: admissionNumber.toUpperCase()
    });

    if (!student) {
      console.log(`Student ${admissionNumber} not found in database`);
      return;
    }

    console.log('Student data in database:');
    console.log('========================');
    console.log('Admission Number:', student.admissionNumber);
    console.log('Student Name:', student.studentName);
    console.log('Father Name:', student.fatherName || '(not set)');
    console.log('School:', student.school);
    console.log('Class:', student.class);
    console.log('Exam Type:', student.examType);
    console.log('Year:', student.year);
    console.log('Marks:', student.marks || '(not set)');
    console.log('Rank:', student.rank || '(not set)');
    console.log('Grade:', student.grade || '(not set)');
    console.log('\nFields that will appear on certificate:');
    console.log('- Admission Number ✓');
    console.log('- Student Name ✓');
    console.log('- School ✓');
    console.log('- Class ✓');

    if (student.fatherName) console.log('- Father Name (WILL show - has data)');
    if (student.marks) console.log('- Marks (WILL show - has data)');
    if (student.rank) console.log('- Rank (WILL show - has data)');
    if (student.grade) console.log('- Grade (WILL show - has data)');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Check for RMTH2025001 or use command line argument
const admissionNumber = process.argv[2] || 'RMTH2025001';
checkStudent(admissionNumber);
