import {
  createPlatform,
  createKeyName,
  createKey,
  deleteKey,
  listKeys,
  updateKeyName,
  updateKeyNote,
  toggleKeyStatus,
  deletePlatform,
} from '@/server/actions/keys';
import { createProject, deleteProject, getProjectKeys } from '@/server/actions/projects';

// Re-export server actions for client use
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
  
  // Projects
  createProject,
  deleteProject,
  getProjectKeys,
} as const;
