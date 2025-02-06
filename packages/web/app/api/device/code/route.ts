import { NextResponse } from 'next/server';
import { generateDeviceCode } from '@/utils/actions/auth';

export async function POST(request: Request) {
  try {
    const { callback_url } = await request.json();
    if (!callback_url) {
      return NextResponse.json(
        { error: 'Missing callback_url' },
        { status: 400 }
      );
    }

    const result = await generateDeviceCode(callback_url);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Device code generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
