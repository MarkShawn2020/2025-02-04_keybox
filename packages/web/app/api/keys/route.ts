
import { NextRequest, NextResponse } from 'next/server';
import { listKeys } from '@/utils/actions/keys';

export async function GET() {
  try {
    const platforms = await listKeys();
    return NextResponse.json(platforms);
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
