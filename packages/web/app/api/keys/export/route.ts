
import { NextRequest, NextResponse } from 'next/server';
import { exportEnvFile } from '@/server/actions/keys';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const content = await exportEnvFile(data);
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename=".env"',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}
