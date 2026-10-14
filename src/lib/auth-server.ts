import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export function verifyAuth(): { success: true } | { success: false; response: NextResponse } {
  const token = cookies().get('admin-token')?.value;

  if (!token) {
    return {
      success: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return { success: true };
  } catch {
    return {
      success: false,
      response: NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 }),
    };
  }
}

export function verifyAuthForAction(): boolean {
  const token = cookies().get('admin-token')?.value;
  if (!token) return false;
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return true;
  } catch {
    return false;
  }
}
