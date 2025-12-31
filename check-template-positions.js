// Check what field positions are saved in the database
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  examType: String,
  year: Number,
  templateUrl: String,
  cloudinaryPublicId: String,
  fieldPositions: Object,
  isActive: Boolean,
}, { timestamps: true });

const CertificateTemplate = mongoose.models.CertificateTemplate ||
  mongoose.model('CertificateTemplate', templateSchema);

async function checkTemplatePositions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find all templates
    const templates = await CertificateTemplate.find({});

    if (templates.length === 0) {
      console.log('❌ No templates found in database!');
      console.log('\nYou need to:');
      console.log('1. Upload a PDF template in Admin Panel → Manage Certificates');
      console.log('2. Then configure field positions');
      await mongoose.disconnect();
      return;
    }

    console.log(`Found ${templates.length} template(s):\n`);

    templates.forEach((template, index) => {
      console.log(`Template ${index + 1}:`);
      console.log('  Exam Type:', template.examType);
      console.log('  Year:', template.year);
      console.log('  Active:', template.isActive);
      console.log('  Template URL:', template.templateUrl ? '✓ Set' : '❌ Not set');

      if (template.fieldPositions && Object.keys(template.fieldPositions).length > 0) {
        console.log('  Field Positions: ✓ Configured');
        console.log('\n  Configured positions:');
        for (const [field, pos] of Object.entries(template.fieldPositions)) {
          if (pos && typeof pos === 'object') {
            console.log(`    ${field}: X=${pos.x}, Y=${pos.y}, Size=${pos.fontSize}`);
          }
        }
      } else {
        console.log('  Field Positions: ❌ Not configured (will use defaults)');
      }
      console.log('');
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTemplatePositions();
