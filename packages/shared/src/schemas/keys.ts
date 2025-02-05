import { z } from 'zod';

export const keySchema = z.object({
  id: z.string(),
  value: z.string().min(1),
  note: z.string().optional(),
  revoked: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
});

export const keyGroupSchema = z.object({
  id: z.string(),
  name: z.string().min(1),  // e.g. API_KEY
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  created_at: z.string(),
  updated_at: z.string(),
  keys: z.array(keySchema).optional(),
});

export const platformSchema = z.object({
  id: z.string(),
  name: z.string().min(1),  // e.g. OPENAI, ALICLOUD
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  created_at: z.string(),
  updated_at: z.string(),
  key_groups: z.array(keyGroupSchema).optional(),
});

// Request schemas
export const createKeySchema = keySchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const createKeyGroupSchema = keyGroupSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true,
  keys: true
});

export const createPlatformSchema = platformSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true,
  key_groups: true
});

// Response types
export type Key = z.infer<typeof keySchema>;
export type KeyGroup = z.infer<typeof keyGroupSchema>;
export type Platform = z.infer<typeof platformSchema>;
