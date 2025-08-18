import { ProjectWithKeys } from '@keybox/shared';

// Note: These functions now serve as placeholders since the system has moved to local storage (Jotai atoms)
// The actual data management is now handled on the client side

export async function getProjectKeys(name: string) {
  // This function is no longer used - data is managed via Jotai atoms on the client
  throw new Error('This function is deprecated. Data is now managed via client-side Jotai atoms.');
}

export async function createProject(data: ProjectWithKeys) {
  // This function is no longer used - data is managed via Jotai atoms on the client
  throw new Error('This function is deprecated. Data is now managed via client-side Jotai atoms.');
}

export async function deleteProject(id: string) {
  // This function is no longer used - data is managed via Jotai atoms on the client
  throw new Error('This function is deprecated. Data is now managed via client-side Jotai atoms.');
}
