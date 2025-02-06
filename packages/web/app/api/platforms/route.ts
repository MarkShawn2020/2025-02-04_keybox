
import { NextRequest, NextResponse } from 'next/server';
import { createPlatform } from '@/server/actions/keys';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    await createPlatform(data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}
