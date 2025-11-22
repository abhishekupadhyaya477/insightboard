import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const activities = [
      {
        id: 1,
        type: 'user_login',
        description: 'User logged in',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 2,
        type: 'data_export',
        description: 'Data exported to CSV',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 3,
        type: 'report_generated',
        description: 'Monthly report generated',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const activity = {
      id: Math.random(),
      ...body,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(
      { message: 'Activity recorded successfully', data: activity },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to record activity' },
      { status: 500 }
    );
  }
}