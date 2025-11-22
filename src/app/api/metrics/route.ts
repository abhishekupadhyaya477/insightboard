import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const metrics = {
      revenue: {
        current: 45231,
        previous: 40123,
        trend: 12.5,
      },
      users: {
        current: 2543,
        previous: 2349,
        trend: 8.2,
      },
      engagement: {
        current: 68,
        previous: 64.7,
        trend: 5.1,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process metrics data
    return NextResponse.json(
      { message: 'Metrics recorded successfully', data: body },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to record metrics' },
      { status: 500 }
    );
  }
}