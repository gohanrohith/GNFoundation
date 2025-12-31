import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ICertificateConfig extends Document {
  examType: 'RMTH' | 'RSTH';
  year: number;

  // Header customization
  organizationName: string;
  certificateTitle: string;

  // Colors
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;

  // Fonts
  titleFont: string;
  bodyFont: string;

  // Content
  subtitleText: string;
  footerText: string;

  // Logo
  logoUrl?: string;
  showLogo: boolean;

  // Border style
  borderStyle: 'double' | 'solid' | 'dashed' | 'none';
  borderColor: string;

  // Signature
  showSignature: boolean;
  signatureText: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateConfigSchema = new Schema<ICertificateConfig>(
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
    organizationName: {
      type: String,
      default: 'GN Foundation',
    },
    certificateTitle: {
      type: String,
      default: 'Certificate of Participation',
    },
    primaryColor: {
      type: String,
      default: '#667eea',
    },
    secondaryColor: {
      type: String,
      default: '#764ba2',
    },
    textColor: {
      type: String,
      default: '#333333',
    },
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
    titleFont: {
      type: String,
      default: 'Georgia, serif',
    },
    bodyFont: {
      type: String,
      default: 'Arial, sans-serif',
    },
    subtitleText: {
      type: String,
      default: 'For successful participation in the {examType} Examination {year}',
    },
    footerText: {
      type: String,
      default: 'Keep up the excellent work!',
    },
    logoUrl: {
      type: String,
    },
    showLogo: {
      type: Boolean,
      default: true,
    },
    borderStyle: {
      type: String,
      enum: ['double', 'solid', 'dashed', 'none'],
      default: 'double',
    },
    borderColor: {
      type: String,
      default: '#667eea',
    },
    showSignature: {
      type: Boolean,
      default: true,
    },
    signatureText: {
      type: String,
      default: 'Authorized Signature',
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

// Only one active config per examType and year
CertificateConfigSchema.index({ examType: 1, year: 1, isActive: 1 }, { unique: true });

const CertificateConfig: Model<ICertificateConfig> =
  mongoose.models.CertificateConfig ||
  mongoose.model<ICertificateConfig>('CertificateConfig', CertificateConfigSchema);

export default CertificateConfig;
