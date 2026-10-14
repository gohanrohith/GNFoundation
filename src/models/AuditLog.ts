import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  entity: string;
  entityId?: string;
  detail: string;
  performedBy: string;
  performedAt: Date;
  ip?: string;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true, trim: true },
    entity: { type: String, required: true, trim: true },
    entityId: { type: String, trim: true },
    detail: { type: String, required: true, trim: true },
    performedBy: { type: String, required: true, default: 'admin' },
    performedAt: { type: Date, default: Date.now },
    ip: { type: String, trim: true },
  },
  { timestamps: false }
);

// Auto-delete logs older than 2 years
AuditLogSchema.index({ performedAt: 1 }, { expireAfterSeconds: 63072000 });

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
