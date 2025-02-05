import { Router } from 'express';
import { ProjectWithKeys } from '@keybox/shared';
import { authenticate } from '../middleware/auth';
import { supabase } from '../lib/supabase';

export const router = Router();

// Get all projects for the current user
router.get('/', authenticate, async (req, res) => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*, project_keys(key_id)')
      .eq('user_id', req.user.id);

    if (error) throw error;

    // Transform to ProjectWithKeys format
    const projectsWithKeys = projects.map((project: any): ProjectWithKeys => ({
      ...project,
      keys: project.project_keys?.map((pk: any) => pk.key_id) || []
    }));

    res.json(projectsWithKeys);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new project
router.post('/', authenticate, async (req, res) => {
  const { name, description, keys = [] } = req.body;

  try {
    // Start a transaction
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        user_id: req.user.id
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Add keys to project if any
    if (keys.length > 0) {
      const { error: keysError } = await supabase
        .from('project_keys')
        .insert(
          keys.map((keyId: string) => ({
            project_id: project.id,
            key_id: keyId
          }))
        );

      if (keysError) throw keysError;
    }

    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update a project
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, description, keys } = req.body;

  try {
    // Update project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .update({ name, description })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (projectError) throw projectError;

    if (keys) {
      // Delete existing keys
      await supabase
        .from('project_keys')
        .delete()
        .eq('project_id', id);

      // Add new keys
      if (keys.length > 0) {
        const { error: keysError } = await supabase
          .from('project_keys')
          .insert(
            keys.map((keyId: string) => ({
              project_id: id,
              key_id: keyId
            }))
          );

        if (keysError) throw keysError;
      }
    }

    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a project
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate .env file for a project
router.get('/:id/env', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    // Get project keys with their values
    const { data: keys, error } = await supabase
      .from('project_keys')
      .select('keys(*)')
      .eq('project_id', id);

    if (error) throw error;

    // Generate .env content
    const envContent = keys
      .map((pk: any) => {
        const key = pk.keys;
        return `${key.name}=${key.value}`;
      })
      .join('\n');

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=.env');
    res.send(envContent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

