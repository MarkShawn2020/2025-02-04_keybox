import { Router } from 'express';
import { ProjectWithKeys } from '@keybox/shared';
import { authenticate } from '../middleware/auth';
import { supabase } from '../lib/supabase';

export const router = Router();

// Get environment variables for a project
router.get('/:name/keys', authenticate, async (req, res) => {
  try {
    console.log('[DEBUG] Authenticated user:', req.user?.id);
    const { name } = req.params;
    console.log('[DEBUG] Looking for project:', name);
    
    // First get the project
    const { data: projects, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('name', name)
      .eq('user_id', req.user.id);
    
    // Check if we got exactly one project
    if (projects && projects.length > 1) {
      return res.status(409).json({ 
        error: `Found multiple projects with name: ${name}. This should not happen due to unique constraint.` 
      });
    }
    
    const project = projects?.[0];

    if (projectError) {
      console.error('[DEBUG] Project error:', projectError);
      throw projectError;
    }
    if (!project) {
      console.log('[DEBUG] Project not found for name:', name);
      return res.status(404).json({ error: 'Project not found' });
    }
    console.log('[DEBUG] Found project:', project);

    // Then get all keys for the project
    const { data: projectKeys, error: keysError } = await supabase
      .from('project_keys')
      .select(`
        key_id,
        keys!inner(
          value,
          key_groups!inner(
            name
          )
        )
      `)
      .eq('project_id', project.id);

    if (keysError) {
      console.error('[DEBUG] Keys error:', keysError);
      throw keysError;
    }
    console.log('[DEBUG] Found project keys:', projectKeys);

    // Transform to key-value pairs
    const envVars = projectKeys.reduce((acc: Record<string, string>, pk: any) => {
      if (pk.keys?.key_groups?.name && pk.keys.value) {
        acc[pk.keys.key_groups.name] = pk.keys.value;
      }
      return acc;
    }, {});

    res.json(envVars);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


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
      .select('keys(*, key_groups(name))')
      .eq('project_id', id);

    if (error) throw error;

    console.log(JSON.stringify(keys, null, 2));
    

    // Generate .env content
    const envContent = keys
      .map((pk: any) => {
        const key = pk.keys;
        return `${key.key_groups.name}=${key.value}`;
      })
      .join('\n');

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=.env');
    res.send(envContent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

