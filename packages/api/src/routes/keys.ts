import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { authenticate } from '../middleware/auth';
import multer from 'multer';
import { parse as parseEnv } from 'dotenv';
import { stringify as stringifyEnv } from 'dotenv-stringify';

export const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const keySchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// List all keys for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const { data: keys, error } = await supabase
      .from('keys')
      .select('id, name, description, tags, created_at, updated_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(keys);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new key
router.post('/', authenticate, async (req, res) => {
  try {
    const data = keySchema.parse(req.body);
    
    const { data: key, error } = await supabase
      .from('keys')
      .insert({
        ...data,
        user_id: req.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(key);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Revoke a key
router.post('/:id/revoke', authenticate, async (req, res) => {
  try {
    const { error } = await supabase
      .from('keys')
      .update({ revoked: true })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Key revoked successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Export keys to .env format
router.get('/export', authenticate, async (req, res) => {
  try {
    const { data: keys, error } = await supabase
      .from('keys')
      .select('name, value')
      .eq('user_id', req.user.id)
      .eq('revoked', false);

    if (error) throw error;

    const envData = keys.reduce((acc: Record<string, string>, key) => {
      acc[key.name] = key.value;
      return acc;
    }, {});

    const envString = stringifyEnv(envData);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=.env');
    res.send(envString);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Import keys from .env file
router.post('/import', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const envContent = req.file.buffer.toString();
    const parsedEnv = parseEnv(envContent);

    const keys = Object.entries(parsedEnv).map(([name, value]) => ({
      name,
      value,
      user_id: req.user.id,
    }));

    const { data, error } = await supabase
      .from('keys')
      .insert(keys)
      .select();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
