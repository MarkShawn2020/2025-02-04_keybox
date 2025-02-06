import { NextRequest, NextResponse } from 'next/server';
import { verifyDeviceCode } from '@/server/actions/auth';

export async function POST(request: NextRequest) {
  try {
    const { device_code } = await request.json();
    if (!device_code) {
      return NextResponse.json({ error: 'Device code is required' }, { status: 400 });
    }

    const result = await verifyDeviceCode(device_code);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
