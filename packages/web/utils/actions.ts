import {
  createPlatform,
  createKeyName,
  createKey,
  deleteKey,
  deleteKeyName,
  listKeys,
  updateKeyName,
  updateKeyNote,
  toggleKeyStatus,
  deletePlatform,
} from '@/utils/actions/localStorage';

// Re-export actions for client use
export const actions = {
  // Keys & Platforms
  createPlatform,
  createKeyName,
  createKey,
  deleteKey,
  listKeys,
  updateKeyName,
  updateKeyNote,
  toggleKeyStatus,
  deletePlatform,
  deleteKeyName,
} as const;
