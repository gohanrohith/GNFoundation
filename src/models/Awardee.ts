import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IAwardee extends Document {
  name: string;
  award: string;
  year: number;
  school: string;
  class: string;
  imageUrl?: string;
  examType: 'RMTH' | 'RSTH';
  rank: number;
  marks?: number;
  createdAt: Date;
  updatedAt: Date;
}

const AwardeeSchema = new Schema<IAwardee>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    award: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },
    school: {
      type: String,
      required: true,
      trim: true,
    },
    class: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    examType: {
      type: String,
      enum: ['RMTH', 'RSTH'],
      required: true,
    },
    rank: {
      type: Number,
      required: true,
      min: 1,
    },
    marks: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for filtering
AwardeeSchema.index({ year: 1, school: 1, class: 1, examType: 1 });

const Awardee: Model<IAwardee> =
  mongoose.models.Awardee || mongoose.model<IAwardee>('Awardee', AwardeeSchema);

export default Awardee;
