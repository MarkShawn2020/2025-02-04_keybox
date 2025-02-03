import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { authenticate } from '../middleware/auth';

export const router = Router();

const solutionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  keyIds: z.array(z.string()),
});

// List all solutions for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const { data: solutions, error } = await supabase
      .from('solutions')
      .select(`
        id,
        name,
        description,
        created_at,
        updated_at,
        solution_keys (
          key:keys (
            id,
            name,
            description
          )
        )
      `)
      .eq('user_id', req.user.id);

    if (error) throw error;

    // Transform the response to match the expected format
    const transformedSolutions = solutions.map(solution => ({
      ...solution,
      keys: solution.solution_keys.map(sk => sk.key),
    }));

    res.json(transformedSolutions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new solution
router.post('/', authenticate, async (req, res) => {
  try {
    const { keyIds, ...data } = solutionSchema.parse(req.body);
    // Start a Supabase transaction
    const { data: solution, error: solutionError } = await supabase
      .from('solutions')
      .insert({
        ...data,
        user_id: req.user.id,
      })
      .select()
      .single();

    if (solutionError) throw solutionError;

    // Create solution_keys relationships
    const solutionKeys = keyIds.map(keyId => ({
      solution_id: solution.id,
      key_id: keyId,
    }));

    const { error: relationError } = await supabase
      .from('solution_keys')
      .insert(solutionKeys);

    if (relationError) throw relationError;

    return res.status(201).json(solution);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Get solution with all active keys
router.get('/:id/env', authenticate, async (req, res) => {
  try {
    const { data: solution, error } = await supabase
      .from('solutions')
      .select(`
        solution_keys (
          key:keys (
            name,
            value,
            revoked
          )
        )
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;

    // Filter out revoked keys and transform to env format
    type KeyType = {
      key: {
        revoked?: boolean;
        name?: string;
        value?: string;
      };
    };

    const envVars = (solution.solution_keys as KeyType[] || [])
      .filter(sk => !sk.key?.revoked)
      .reduce((acc: Record<string, string>, sk) => {
        if (sk.key?.name && sk.key?.value) {
          acc[sk.key.name] = sk.key.value;
        }
        return acc;
      }, {} as Record<string, string>);

    res.json(envVars);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
