import connectDB from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';

export interface AuditEntry {
  action: string;
  entity: string;
  entityId?: string;
  detail: string;
  performedBy?: string;
  ip?: string;
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    await connectDB();
    await AuditLog.create({
      ...entry,
      performedBy: entry.performedBy ?? 'admin',
      performedAt: new Date(),
    });
  } catch {
    // Logging must never break an admin action
  }
}
