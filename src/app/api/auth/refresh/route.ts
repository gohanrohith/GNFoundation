import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { verifyAuth } from '@/lib/auth-server';

export async function POST() {
  const auth = verifyAuth();
  if (!auth.success) return auth.response;

  const jwtSecret = process.env.JWT_SECRET!;
  const token = jwt.sign(
    { role: 'admin', loginTime: Date.now() },
    jwtSecret,
    { expiresIn: '15m' }
  );

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 900,
    path: '/',
  });
  return response;
}
