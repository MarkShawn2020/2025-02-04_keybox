import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Platform, KeyGroup, Key, VariableGroup } from '@/utils/localStorage';
import { ENVIRONMENT_CONFIG, generateInstanceIdentity } from '@/lib/instance-utils';

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

// Variable Group atoms
export const addVariableGroupAtom = atom(
  null,
  (get, set, { platformId, variableGroup }: {
    platformId: string;
    variableGroup: Omit<VariableGroup, 'id' | 'created_at' | 'updated_at'>
  }) => {
    const platforms = get(platformsAtom);
    
    const newVariableGroup: VariableGroup = {
      ...variableGroup,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const updatedPlatforms = platforms.map(p => 
      p.id === platformId 
        ? { 
            ...p, 
            variable_groups: [...(p.variable_groups || []), newVariableGroup],
            updated_at: new Date().toISOString()
          }
        : p
    );
    
    set(platformsAtom, updatedPlatforms);
    return newVariableGroup;
  }
);

export const importTemplateAtom = atom(
  null,
  (get, set, { 
    platformId, 
    templateId, 
    instanceName,
    environment,
    variablePrefix,
    variableValues 
  }: {
    platformId: string;
    templateId: string;
    instanceName: string;
    environment?: string;
    variablePrefix?: string;
    variableValues: Record<string, string>;
  }) => {
    const platforms = get(platformsAtom);
    const platform = platforms.find(p => p.id === platformId);
    
    if (!platform) {
      throw new Error('Platform not found');
    }
    
    // Calculate instance number
    const existingInstances = (platform.variable_groups || []).filter(
      vg => vg.template_id === templateId
    );
    const instanceNumber = existingInstances.length + 1;
    
    // Create variable group
    const variableGroupId = crypto.randomUUID();
    const keyGroupIds: string[] = [];
    
    // Apply prefix to variables if provided
    const finalVariables = variablePrefix 
      ? Object.entries(variableValues).reduce((acc, [key, value]) => {
          acc[`${variablePrefix}${key}`] = value;
          return acc;
        }, {} as Record<string, string>)
      : variableValues;
    
    // Create key groups for each variable
    const updatedKeyGroups: KeyGroup[] = [...platform.key_groups];
    
    Object.entries(finalVariables).forEach(([variableName, variableValue]) => {
      if (!variableValue) return;
      
      const keyGroupId = crypto.randomUUID();
      const keyId = crypto.randomUUID();
      
      const newKeyGroup: KeyGroup = {
        id: keyGroupId,
        name: variableName,
        description: undefined,
        tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        variable_group_id: variableGroupId,
        keys: [{
          id: keyId,
          value: variableValue,
          note: `${instanceName} - ${environment || 'default'}`,
          revoked: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      };
      
      updatedKeyGroups.push(newKeyGroup);
      keyGroupIds.push(keyGroupId);
    });
    
    // Generate instance identity
    const instanceIdentity = generateInstanceIdentity(
      templateId,
      environment || 'default',
      instanceNumber,
      instanceName
    );
    
    // Create the variable group with enhanced metadata
    const newVariableGroup: VariableGroup = {
      id: variableGroupId,
      name: instanceName,
      description: `${templateId} configuration for ${environment || 'default'} environment`,
      template_id: templateId,
      key_group_ids: keyGroupIds,
      relationship_type: 'required_group',
      instance_identity: instanceIdentity,
      instance_name: instanceName,
      environment_tag: environment,
      variable_prefix: variablePrefix,
      instance_number: instanceNumber,
      instance_metadata: {
        purpose: instanceNumber === 1 ? 'primary' : 'secondary',
        color: environment ? ENVIRONMENT_CONFIG[environment as keyof typeof ENVIRONMENT_CONFIG]?.color : undefined,
        icon: environment ? ENVIRONMENT_CONFIG[environment as keyof typeof ENVIRONMENT_CONFIG]?.icon : undefined,
      },
      validation_rules: {
        template_id: templateId,
        required_variables: Object.keys(variableValues)
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Update the platform
    const updatedPlatforms = platforms.map(p => 
      p.id === platformId 
        ? { 
            ...p, 
            key_groups: updatedKeyGroups,
            variable_groups: [...(p.variable_groups || []), newVariableGroup],
            updated_at: new Date().toISOString()
          }
        : p
    );
    
    set(platformsAtom, updatedPlatforms);
    return { variableGroupId, keyGroupIds };
  }
);

// Helper atom to get variable groups for a platform
export const getVariableGroupsAtom = atom(
  (get) => (platformId: string) => {
    const platforms = get(platformsAtom);
    const platform = platforms.find(p => p.id === platformId);
    return platform?.variable_groups || [];
  }
);

// Delete variable group atom - also deletes associated key groups
export const deleteVariableGroupAtom = atom(
  null,
  (get, set, { platformId, groupId }: {
    platformId: string;
    groupId: string
  }) => {
    const platforms = get(platformsAtom);
    
    const updatedPlatforms = platforms.map(p => {
      if (p.id === platformId) {
        const variableGroup = p.variable_groups?.find(vg => vg.id === groupId);
        
        if (!variableGroup) return p;
        
        // Remove all key groups that belong to this variable group
        const updatedKeyGroups = p.key_groups.filter(kg => 
          !variableGroup.key_group_ids.includes(kg.id)
        );
        
        return {
          ...p,
          key_groups: updatedKeyGroups,
          variable_groups: p.variable_groups?.filter(vg => vg.id !== groupId) || [],
          updated_at: new Date().toISOString()
        };
      }
      return p;
    });
    
    set(platformsAtom, updatedPlatforms);
  }
);