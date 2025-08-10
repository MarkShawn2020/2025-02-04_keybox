'use client';

import { Platform, KeyGroup, Key } from '@/utils/localStorage';

export async function listKeys(): Promise<Platform[]> {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const stored = window.localStorage.getItem('keybox_config');
  if (!stored) {
    return [];
  }
  
  try {
    const config = JSON.parse(stored);
    return config.platforms || [];
  } catch {
    return [];
  }
}

export async function createPlatform(data: Omit<Platform, 'id' | 'created_at' | 'updated_at' | 'key_groups'>): Promise<{ success: boolean; platform?: Platform }> {
  const platforms = await listKeys();
  const newPlatform: Platform = {
    ...data,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    key_groups: []
  };
  
  const config = {
    platforms: [...platforms, newPlatform],
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  };
  
  window.localStorage.setItem('keybox_config', JSON.stringify(config));
  return { success: true, platform: newPlatform };
}

export async function createKeyName(platformId: string, data: Omit<KeyGroup, 'id' | 'created_at' | 'updated_at' | 'keys'>): Promise<{ success: boolean; groupId?: string }> {
  const platforms = await listKeys();
  const platform = platforms.find(p => p.id === platformId);
  
  if (!platform) {
    throw new Error('Platform not found');
  }
  
  const newGroup: KeyGroup = {
    ...data,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    keys: []
  };
  
  platform.key_groups.push(newGroup);
  platform.updated_at = new Date().toISOString();
  
  const config = {
    platforms,
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  };
  
  window.localStorage.setItem('keybox_config', JSON.stringify(config));
  return { success: true, groupId: newGroup.id };
}

export async function createKey(groupId: string, data: Omit<Key, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean }> {
  const platforms = await listKeys();
  let found = false;
  
  for (const platform of platforms) {
    for (const group of platform.key_groups) {
      if (group.id === groupId) {
        const newKey: Key = {
          ...data,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        group.keys.push(newKey);
        group.updated_at = new Date().toISOString();
        platform.updated_at = new Date().toISOString();
        found = true;
        break;
      }
    }
    if (found) break;
  }
  
  if (!found) {
    throw new Error('Key group not found');
  }
  
  const config = {
    platforms,
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  };
  
  window.localStorage.setItem('keybox_config', JSON.stringify(config));
  return { success: true };
}

export async function deleteKey(id: string): Promise<{ success: boolean }> {
  const platforms = await listKeys();
  let found = false;
  
  for (const platform of platforms) {
    for (const group of platform.key_groups) {
      const keyIndex = group.keys.findIndex(k => k.id === id);
      if (keyIndex !== -1) {
        group.keys.splice(keyIndex, 1);
        group.updated_at = new Date().toISOString();
        platform.updated_at = new Date().toISOString();
        found = true;
        break;
      }
    }
    if (found) break;
  }
  
  if (!found) {
    throw new Error('Key not found');
  }
  
  const config = {
    platforms,
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  };
  
  window.localStorage.setItem('keybox_config', JSON.stringify(config));
  return { success: true };
}

export async function toggleKeyStatus(keyId: string): Promise<{ success: boolean }> {
  const platforms = await listKeys();
  let found = false;
  
  for (const platform of platforms) {
    for (const group of platform.key_groups) {
      const key = group.keys.find(k => k.id === keyId);
      if (key) {
        key.revoked = !key.revoked;
        key.updated_at = new Date().toISOString();
        group.updated_at = new Date().toISOString();
        platform.updated_at = new Date().toISOString();
        found = true;
        break;
      }
    }
    if (found) break;
  }
  
  if (!found) {
    throw new Error('Key not found');
  }
  
  const config = {
    platforms,
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  };
  
  window.localStorage.setItem('keybox_config', JSON.stringify(config));
  return { success: true };
}

export async function updateKeyNote(keyId: string, note: string): Promise<{ success: boolean }> {
  const platforms = await listKeys();
  let found = false;
  
  for (const platform of platforms) {
    for (const group of platform.key_groups) {
      const key = group.keys.find(k => k.id === keyId);
      if (key) {
        key.note = note;
        key.updated_at = new Date().toISOString();
        group.updated_at = new Date().toISOString();
        platform.updated_at = new Date().toISOString();
        found = true;
        break;
      }
    }
    if (found) break;
  }
  
  if (!found) {
    throw new Error('Key not found');
  }
  
  const config = {
    platforms,
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  };
  
  window.localStorage.setItem('keybox_config', JSON.stringify(config));
  return { success: true };
}

export async function updateKeyName(groupId: string, data: Partial<Omit<KeyGroup, 'id' | 'created_at' | 'keys'>>): Promise<{ success: boolean }> {
  const platforms = await listKeys();
  let found = false;
  
  for (const platform of platforms) {
    const group = platform.key_groups.find(g => g.id === groupId);
    if (group) {
      Object.assign(group, data);
      group.updated_at = new Date().toISOString();
      platform.updated_at = new Date().toISOString();
      found = true;
      break;
    }
  }
  
  if (!found) {
    throw new Error('Key group not found');
  }
  
  const config = {
    platforms,
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  };
  
  window.localStorage.setItem('keybox_config', JSON.stringify(config));
  return { success: true };
}

export async function deleteKeyName(groupId: string): Promise<{ success: boolean }> {
  const platforms = await listKeys();
  let found = false;
  
  for (const platform of platforms) {
    const groupIndex = platform.key_groups.findIndex(g => g.id === groupId);
    if (groupIndex !== -1) {
      platform.key_groups.splice(groupIndex, 1);
      platform.updated_at = new Date().toISOString();
      found = true;
      break;
    }
  }
  
  if (!found) {
    throw new Error('Key group not found');
  }
  
  const config = {
    platforms,
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  };
  
  window.localStorage.setItem('keybox_config', JSON.stringify(config));
  return { success: true };
}

export async function deletePlatform(platformId: string): Promise<{ success: boolean }> {
  const platforms = await listKeys();
  const platformIndex = platforms.findIndex(p => p.id === platformId);
  
  if (platformIndex === -1) {
    throw new Error('Platform not found');
  }
  
  platforms.splice(platformIndex, 1);
  
  const config = {
    platforms,
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  };
  
  window.localStorage.setItem('keybox_config', JSON.stringify(config));
  return { success: true };
}

export async function importEnvFile(content: string): Promise<{ env: Record<string, string> }> {
  const lines = content.split('\n');
  const env: Record<string, string> = {};
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  }
  
  return { env };
}

export async function exportEnvFile(env: Record<string, string>): Promise<string> {
  return JSON.stringify(env, null, 2);
}