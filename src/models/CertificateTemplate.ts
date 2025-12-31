import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ICertificateTemplate extends Document {
  examType: 'RMTH' | 'RSTH';
  year: number;
  templateUrl: string; // Cloudinary URL
  cloudinaryPublicId?: string;
  fieldPositions: any; // Can be Object or Array
  orientation: 'portrait' | 'landscape';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateTemplateSchema = new Schema<ICertificateTemplate>(
  {
    examType: {
      type: String,
      enum: ['RMTH', 'RSTH'],
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    templateUrl: {
      type: String,
      required: true,
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: false,
      trim: true,
    },
    fieldPositions: Schema.Types.Mixed, // Can be Object or Array - no type validation
    orientation: {
      type: String,
      enum: ['portrait', 'landscape'],
      default: 'portrait',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Only one active template per exam type per year
CertificateTemplateSchema.index({ examType: 1, year: 1, isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

const CertificateTemplate: Model<ICertificateTemplate> =
  mongoose.models.CertificateTemplate ||
  mongoose.model<ICertificateTemplate>('CertificateTemplate', CertificateTemplateSchema);

export default CertificateTemplate;
