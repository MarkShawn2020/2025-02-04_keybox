import { z } from 'zod';
import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// In-memory store for device codes (consider using Redis in production)
const deviceCodes = new Map<string, {
  code: string;
  createdAt: number;
  token?: string;
}>();

// Clean up expired device codes every 5 minutes
setInterval(() => {
  const now = Date.now();
  deviceCodes.forEach((value, key) => {
    if (now - value.createdAt > 10 * 60 * 1000) { // 10 minutes expiry
      deviceCodes.delete(key);
    }
  });
}, 5 * 60 * 1000);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function generateDeviceCode() {
  const deviceCode = randomBytes(32).toString('hex');
  const userCode = randomBytes(4).toString('hex').toUpperCase();
  
  deviceCodes.set(deviceCode, {
    code: userCode,
    createdAt: Date.now(),
  });

  return {
    device_code: deviceCode,
    user_code: userCode,
    verification_uri: `/verify-device`,
    expires_in: 600, // 10 minutes
    interval: 5, // poll every 5 seconds
  };
}

export async function verifyDeviceCode(deviceCode: string) {
  const entry = deviceCodes.get(deviceCode);
  if (!entry) {
    return { error: 'Device code not found' };
  }

  if (Date.now() - entry.createdAt > 10 * 60 * 1000) {
    deviceCodes.delete(deviceCode);
    return { error: 'Device code expired' };
  }

  if (!entry.token) {
    return { error: 'Authorization pending' };
  }

  // Clean up after successful verification
  deviceCodes.delete(deviceCode);
  return { token: entry.token };
}

export async function authorizeDevice(deviceCode: string, userCode: string) {
  const entry = deviceCodes.get(deviceCode);
  if (!entry || entry.code !== userCode) {
    return { error: 'Invalid device code' };
  }

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { error: 'User not authenticated' };
  }

  // Store the access token
  entry.token = session.access_token;
  return { success: true };
}
