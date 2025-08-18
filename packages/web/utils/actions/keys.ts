import { parse as parseEnv } from 'dotenv';
import { createPlatformSchema, createKeyNameSchema, createKeySchema, KeyNameSchema } from '@keybox/shared';

// Note: These functions now serve as placeholders since the system has moved to local storage (Jotai atoms)
// The actual data management is now handled on the client side

export async function listKeys() {
  // This function is no longer used - data is managed via Jotai atoms on the client
  throw new Error('This function is deprecated. Data is now managed via client-side Jotai atoms.');
}

export async function createPlatform(data: any) {
  // This function is no longer used - data is managed via Jotai atoms on the client
  const validatedData = createPlatformSchema.parse(data);
  throw new Error('This function is deprecated. Data is now managed via client-side Jotai atoms.');
}

export async function createKeyName(platformId: string, data: any) {
  // This function is no longer used - data is managed via Jotai atoms on the client
  const validatedData = createKeyNameSchema.parse(data);
  throw new Error('This function is deprecated. Data is now managed via client-side Jotai atoms.');
}

export async function createKey(groupId: string, data: any) {
  // This function is no longer used - data is managed via Jotai atoms on the client
  const validatedData = createKeySchema.parse(data);
  throw new Error('This function is deprecated. Data is now managed via client-side Jotai atoms.');
}

export async function deleteKey(id: string) {
  // This function is no longer used - data is managed via Jotai atoms on the client
  throw new Error('This function is deprecated. Data is now managed via client-side Jotai atoms.');
}

export async function importEnvFile(content: string) {
  try {
    const env = parseEnv(content);
    return { env };
  } catch (error: any) {
    throw new Error(`Failed to parse .env file: ${error.message}`);
  }
}

export async function exportEnvFile(env: Record<string, string>) {
  try {
    return JSON.stringify(env, null, 2);
  } catch (error: any) {
    throw new Error(`Failed to stringify env: ${error.message}`);
  }
}

export async function updateKeyName(groupId: string, data: any) {
  // This function is no longer used - data is managed via Jotai atoms on the client
  const validatedData = KeyNameSchema.omit({ id: true, created_at: true, updated_at: true, keys: true }).parse(data);
  throw new Error('This function is deprecated. Data is now managed via client-side Jotai atoms.');
}

export async function updateKeyNote(keyId: string, note: string) {
  // This function is no longer used - data is managed via Jotai atoms on the client
  throw new Error('This function is deprecated. Data is now managed via client-side Jotai atoms.');
}

export async function toggleKeyStatus(keyId: string) {
  // This function is no longer used - data is managed via Jotai atoms on the client
  throw new Error('This function is deprecated. Data is now managed via client-side Jotai atoms.');
}

export async function deleteKeyName(groupId: string) {
  // This function is no longer used - data is managed via Jotai atoms on the client
  throw new Error('This function is deprecated. Data is now managed via client-side Jotai atoms.');
}

export async function deletePlatform(platformId: string) {
  // This function is no longer used - data is managed via Jotai atoms on the client
  throw new Error('This function is deprecated. Data is now managed via client-side Jotai atoms.');
}
