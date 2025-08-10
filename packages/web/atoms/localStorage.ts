import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Platform, KeyGroup, Key } from '@/utils/localStorage';

export interface KeyConfig {
  platforms: Platform[];
  version: string;
  lastUpdated: string;
}

const STORAGE_KEY = 'keybox_config';
const CONFIG_VERSION = '1.0.0';

// Main storage atom using atomWithStorage
export const keyConfigAtom = atomWithStorage<KeyConfig>(
  STORAGE_KEY,
  {
    platforms: [],
    version: CONFIG_VERSION,
    lastUpdated: new Date().toISOString()
  }
);

// Derived atom for platforms array
export const platformsAtom = atom(
  (get) => get(keyConfigAtom).platforms,
  (get, set, newPlatforms: Platform[]) => {
    const config = get(keyConfigAtom);
    set(keyConfigAtom, {
      ...config,
      platforms: newPlatforms,
      lastUpdated: new Date().toISOString()
    });
  }
);

// Helper functions as regular functions, not atoms
export const addPlatform = (
  platforms: Platform[],
  platform: Omit<Platform, 'id' | 'created_at' | 'updated_at' | 'key_groups'>
): Platform => {
  const newPlatform: Platform = {
    ...platform,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    key_groups: []
  };
  return newPlatform;
};

export const addKeyGroup = (
  platforms: Platform[],
  platformId: string,
  keyGroup: Omit<KeyGroup, 'id' | 'created_at' | 'updated_at' | 'keys'>
): KeyGroup => {
  const newKeyGroup: KeyGroup = {
    ...keyGroup,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    keys: []
  };
  return newKeyGroup;
};

export const addKey = (
  platforms: Platform[],
  platformId: string,
  groupId: string,
  key: Omit<Key, 'id' | 'created_at' | 'updated_at'>
): Key => {
  const newKey: Key = {
    ...key,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  return newKey;
};

// Action atoms for mutations
export const addPlatformAtom = atom(
  null,
  (get, set, platform: Omit<Platform, 'id' | 'created_at' | 'updated_at' | 'key_groups'>) => {
    const platforms = get(platformsAtom);
    const newPlatform = addPlatform(platforms, platform);
    set(platformsAtom, [...platforms, newPlatform]);
    return newPlatform;
  }
);

export const addKeyGroupAtom = atom(
  null,
  (get, set, { platformId, keyGroup }: {
    platformId: string;
    keyGroup: Omit<KeyGroup, 'id' | 'created_at' | 'updated_at' | 'keys'>
  }) => {
    const platforms = get(platformsAtom);
    const newKeyGroup = addKeyGroup(platforms, platformId, keyGroup);
    
    const updatedPlatforms = platforms.map(p => 
      p.id === platformId 
        ? { ...p, key_groups: [...p.key_groups, newKeyGroup], updated_at: new Date().toISOString() }
        : p
    );
    
    set(platformsAtom, updatedPlatforms);
    return newKeyGroup;
  }
);

export const addKeyAtom = atom(
  null,
  (get, set, { platformId, groupId, key }: {
    platformId: string;
    groupId: string;
    key: Omit<Key, 'id' | 'created_at' | 'updated_at'>
  }) => {
    const platforms = get(platformsAtom);
    const newKey = addKey(platforms, platformId, groupId, key);
    
    const updatedPlatforms = platforms.map(p => {
      if (p.id === platformId) {
        return {
          ...p,
          key_groups: p.key_groups.map(g => 
            g.id === groupId 
              ? { ...g, keys: [...g.keys, newKey], updated_at: new Date().toISOString() }
              : g
          ),
          updated_at: new Date().toISOString()
        };
      }
      return p;
    });
    
    set(platformsAtom, updatedPlatforms);
    return newKey;
  }
);

export const deleteKeyAtom = atom(
  null,
  (get, set, { platformId, groupId, keyId }: {
    platformId: string;
    groupId: string;
    keyId: string
  }) => {
    const platforms = get(platformsAtom);
    
    const updatedPlatforms = platforms.map(p => {
      if (p.id === platformId) {
        return {
          ...p,
          key_groups: p.key_groups.map(g => 
            g.id === groupId 
              ? { ...g, keys: g.keys.filter(k => k.id !== keyId), updated_at: new Date().toISOString() }
              : g
          ),
          updated_at: new Date().toISOString()
        };
      }
      return p;
    });
    
    set(platformsAtom, updatedPlatforms);
  }
);

export const toggleKeyStatusAtom = atom(
  null,
  (get, set, { platformId, groupId, keyId }: {
    platformId: string;
    groupId: string;
    keyId: string
  }) => {
    const platforms = get(platformsAtom);
    
    const updatedPlatforms = platforms.map(p => {
      if (p.id === platformId) {
        return {
          ...p,
          key_groups: p.key_groups.map(g => 
            g.id === groupId 
              ? { 
                  ...g, 
                  keys: g.keys.map(k => 
                    k.id === keyId 
                      ? { ...k, revoked: !k.revoked, updated_at: new Date().toISOString() }
                      : k
                  ),
                  updated_at: new Date().toISOString()
                }
              : g
          ),
          updated_at: new Date().toISOString()
        };
      }
      return p;
    });
    
    set(platformsAtom, updatedPlatforms);
  }
);

export const deleteKeyGroupAtom = atom(
  null,
  (get, set, { platformId, groupId }: {
    platformId: string;
    groupId: string
  }) => {
    const platforms = get(platformsAtom);
    
    const updatedPlatforms = platforms.map(p => 
      p.id === platformId 
        ? { 
            ...p, 
            key_groups: p.key_groups.filter(g => g.id !== groupId),
            updated_at: new Date().toISOString()
          }
        : p
    );
    
    set(platformsAtom, updatedPlatforms);
  }
);

export const deletePlatformAtom = atom(
  null,
  (get, set, platformId: string) => {
    const platforms = get(platformsAtom);
    set(platformsAtom, platforms.filter(p => p.id !== platformId));
  }
);

export const updateKeyNoteAtom = atom(
  null,
  (get, set, { platformId, groupId, keyId, note }: {
    platformId: string;
    groupId: string;
    keyId: string;
    note: string
  }) => {
    const platforms = get(platformsAtom);
    
    const updatedPlatforms = platforms.map(p => {
      if (p.id === platformId) {
        return {
          ...p,
          key_groups: p.key_groups.map(g => 
            g.id === groupId 
              ? { 
                  ...g, 
                  keys: g.keys.map(k => 
                    k.id === keyId 
                      ? { ...k, note, updated_at: new Date().toISOString() }
                      : k
                  ),
                  updated_at: new Date().toISOString()
                }
              : g
          ),
          updated_at: new Date().toISOString()
        };
      }
      return p;
    });
    
    set(platformsAtom, updatedPlatforms);
  }
);

export const updateKeyGroupAtom = atom(
  null,
  (get, set, { platformId, groupId, data }: {
    platformId: string;
    groupId: string;
    data: Partial<Omit<KeyGroup, 'id' | 'created_at' | 'keys'>>
  }) => {
    const platforms = get(platformsAtom);
    
    const updatedPlatforms = platforms.map(p => {
      if (p.id === platformId) {
        return {
          ...p,
          key_groups: p.key_groups.map(g => 
            g.id === groupId 
              ? { ...g, ...data, updated_at: new Date().toISOString() }
              : g
          ),
          updated_at: new Date().toISOString()
        };
      }
      return p;
    });
    
    set(platformsAtom, updatedPlatforms);
  }
);

// Export/Import helpers
export const exportConfigAtom = atom(
  null,
  (get, set) => {
    const config = get(keyConfigAtom);
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keybox-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
);

export const importConfigAtom = atom(
  null,
  async (get, set, file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const config = JSON.parse(content) as KeyConfig;
          if (!config.platforms || !Array.isArray(config.platforms)) {
            throw new Error('Invalid configuration format');
          }
          set(keyConfigAtom, config);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
);