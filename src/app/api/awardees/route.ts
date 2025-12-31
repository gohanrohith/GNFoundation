import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Awardee from '@/models/Awardee';

export async function GET() {
  try {
    await connectDB();

    const awardees = await Awardee.find({})
      .sort({ year: -1, rank: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      awardees,
    });
  } catch (error: any) {
    console.error('Fetch awardees error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch awardees' },
      { status: 500 }
    );
  }
}
