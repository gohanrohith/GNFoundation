import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IStudent extends Document {
  admissionNumber: string;
  studentName?: string;
  fatherName?: string;
  school?: string;
  class?: string;
  examType?: 'RMTH' | 'RSTH';
  year?: number;
  marks?: number;
  rank?: number;
  grade?: string;
  certificateGenerated?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    admissionNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    studentName: {
      type: String,
      trim: true,
    },
    fatherName: {
      type: String,
      trim: true,
    },
    school: {
      type: String,
      trim: true,
    },
    class: {
      type: String,
      trim: true,
    },
    examType: {
      type: String,
      enum: ['RMTH', 'RSTH'],
    },
    year: {
      type: Number,
      index: true,
    },
    marks: {
      type: Number,
    },
    rank: {
      type: Number,
    },
    grade: {
      type: String,
      trim: true,
    },
    certificateGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster certificate lookups
StudentSchema.index({ admissionNumber: 1, examType: 1, year: 1 });

const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
