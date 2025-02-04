import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { authenticate } from '../middleware/auth';
import multer from 'multer';
import { parse as parseEnv } from 'dotenv';
import { stringify as stringifyEnv } from 'dotenv-stringify';

export const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

import { keyGroupSchema, platformSchema, keySchema } from '@keybox/shared'

// List all keys for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const { data: platforms, error } = await supabase
      .from('platforms')
      .select(`
        id,
        name,
        description,
        tags,
        created_at,
        updated_at,
        key_groups:key_groups(
          id,
          name,
          description,
          created_at,
          updated_at,
          keys:keys(
            id,
            value,
            note,
            revoked,
            created_at,
            updated_at
          )
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(platforms);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new key
// Create a new platform
router.post('/platforms', authenticate, async (req, res) => {
  try {
    const data = platformSchema.parse(req.body);
    
    const { data: platform, error } = await supabase
      .from('platforms')
      .insert({
        ...data,
        user_id: req.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(platform);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: error.message });
  }
});

// Create a new key group under a platform
router.post('/platforms/:platformId/groups', authenticate, async (req, res) => {
  try {
    const data = keyGroupSchema.parse(req.body);
    
    const { data: group, error } = await supabase
      .from('key_groups')
      .insert({
        ...data,
        platform_id: req.params.platformId,
        user_id: req.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(group);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: error.message });
  }
});

// Add a new key to a key group
router.post('/groups/:groupId/keys', authenticate, async (req, res) => {
  try {
    const data = keySchema.parse(req.body);
    
    const { data: key, error } = await supabase
      .from('keys')
      .insert({
        ...data,
        key_group_id: req.params.groupId,
        user_id: req.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(key);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: error.message });
  }
});

// Toggle key status
router.patch('/keys/:id/toggle-status', authenticate, async (req, res) => {
  try {
    const { data: currentKey, error: fetchError } = await supabase
      .from('keys')
      .select('revoked')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError) throw fetchError;
    if (!currentKey) throw new Error('Key not found');

    const { error } = await supabase
      .from('keys')
      .update({ revoked: !currentKey.revoked })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Key status updated successfully', revoked: !currentKey.revoked });
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

// Delete a key
// Delete a key
router.delete('/keys/:id', authenticate, async (req, res) => {
  try {
    const { error } = await supabase
      .from('keys')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Key deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a key group and all its keys
router.delete('/groups/:id', authenticate, async (req, res) => {
  try {
    // First delete all keys
    const { error: keysError } = await supabase
      .from('keys')
      .delete()
      .eq('key_group_id', req.params.id)
      .eq('user_id', req.user.id);

    if (keysError) throw keysError;

    // Then delete the group
    const { error: groupError } = await supabase
      .from('key_groups')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (groupError) throw groupError;
    res.json({ message: 'Key group and all its keys deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a platform and all its groups and keys
router.delete('/platforms/:id', authenticate, async (req, res) => {
  try {
    // First get all key groups for this platform
    const { data: groups, error: groupsQueryError } = await supabase
      .from('key_groups')
      .select('id')
      .eq('platform_id', req.params.id)
      .eq('user_id', req.user.id);

    if (groupsQueryError) throw groupsQueryError;
    
    if (groups && groups.length > 0) {
      // Delete all keys in these groups
      const { error: keysError } = await supabase
        .from('keys')
        .delete()
        .in('key_group_id', groups.map(g => g.id))
        .eq('user_id', req.user.id);

      if (keysError) throw keysError;
    }

    // Then delete all groups
    const { error: groupsError } = await supabase
      .from('key_groups')
      .delete()
      .eq('platform_id', req.params.id)
      .eq('user_id', req.user.id);

    if (groupsError) throw groupsError;

    // Finally delete the platform
    const { error: platformError } = await supabase
      .from('platforms')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (platformError) throw platformError;
    res.json({ message: 'Platform and all its groups and keys deleted successfully' });
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
    return res.status(201).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
