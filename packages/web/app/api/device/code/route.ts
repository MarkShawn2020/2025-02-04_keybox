import { NextResponse } from 'next/server';
import { generateDeviceCode } from '@/utils/actions/auth';

export async function POST() {
  try {
    const result = await generateDeviceCode();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
