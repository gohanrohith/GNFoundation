import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';
import { verifyAuth } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = verifyAuth();
  if (!auth.success) return auth.response;

  try {
    await connectDB();

    const logs = await AuditLog.find({})
      .sort({ performedAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
