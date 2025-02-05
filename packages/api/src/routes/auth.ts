import { Router } from 'express';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import { supabase } from '../lib/supabase';
import { authenticate } from '../middleware/auth';

export const router = Router();

// In-memory store for device codes
const deviceCodes = new Map<string, {
  code: string;
  createdAt: number;
  token?: string;
}>();

// Clean up expired device codes every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of deviceCodes.entries()) {
    if (now - value.createdAt > 10 * 60 * 1000) { // 10 minutes expiry
      deviceCodes.delete(key);
    }
  }
}, 5 * 60 * 1000);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Generate a device code for CLI login
router.post('/device/code', (_req, res) => {
  const deviceCode = randomBytes(32).toString('hex');
  const userCode = randomBytes(4).toString('hex').toUpperCase(); // Shorter code for user to type
  
  deviceCodes.set(deviceCode, {
    code: userCode,
    createdAt: Date.now(),
  });

  res.json({
    device_code: deviceCode,
    user_code: userCode,
    verification_uri: `${process.env.FRONTEND_URL}/verify-device`,
    expires_in: 600, // 10 minutes
    interval: 5, // poll every 5 seconds
  });
});

// Check device code status
router.post('/device/token', async (req, res) => {
  const { device_code } = req.body;
  
  const codeData = deviceCodes.get(device_code);
  if (!codeData) {
    return res.status(404).json({ error: 'Device code not found' });
  }

  if (Date.now() - codeData.createdAt > 10 * 60 * 1000) {
    deviceCodes.delete(device_code);
    return res.status(400).json({ error: 'Device code expired' });
  }

  if (!codeData.token) {
    return res.status(400).json({ error: 'Authorization pending' });
  }

  deviceCodes.delete(device_code);
  return res.json({ token: codeData.token });
});

// Verify and bind device code
router.post('/device/verify', async (req, res) => {
  const { user_code, token } = req.body;
  
  for (const [deviceCode, data] of deviceCodes.entries()) {
    if (data.code === user_code) {
      data.token = token;
      return res.json({ success: true });
    }
  }

  return res.status(404).json({ error: 'Invalid user code' });
});

// Get current user info
router.get('/me', authenticate, async (req, res) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1] || '');
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user's last login time from metadata
    const { data: profile } = await supabase
      .from('profiles')
      .select('last_login_at')
      .eq('id', user.id)
      .single();

    return res.json({
      id: user.id,
      email: user.email,
      username: user.email,
      lastLoginAt: profile?.last_login_at ?? user.last_sign_in_at
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // Update last login time
    await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        last_login_at: new Date().toISOString()
      });

    return res.json({ 
      token: data.session.access_token,
      user: data.user
    });
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' });
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});
