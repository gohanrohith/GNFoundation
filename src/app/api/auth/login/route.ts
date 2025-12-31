import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Get credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin password not configured' },
        { status: 500 }
      );
    }

    if (!jwtSecret) {
      return NextResponse.json(
        { error: 'JWT secret not configured' },
        { status: 500 }
      );
    }

    // Validate credentials
    if (username === adminUsername && password === adminPassword) {
      // Generate JWT token with 15 minute expiration
      const token = jwt.sign(
        {
          username,
          role: 'admin',
          loginTime: Date.now()
        },
        jwtSecret,
        { expiresIn: '15m' }
      );

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        token,
        expiresIn: 900000, // 15 minutes in milliseconds
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
