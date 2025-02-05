import type { Platform } from '@keybox/shared';

/**
 * Generate .env file content based on selected keys
 * @param platforms - Array of platforms containing key groups and keys
 * @param selectedKeys - Array of selected key IDs
 * @returns Formatted .env file content
 */
export function generateEnvContent(platforms: Platform[], selectedKeys: string[]): string {
  // console.log({platforms, selectedKeys});
  
  const envLines: string[] = [];

  platforms.forEach(platform => {
    platform.key_groups?.forEach(group => {
      group.keys?.forEach(key => {
        if (selectedKeys.includes(key.id)) {
          // Use group name as the env variable name
          const envName = group.name.toUpperCase().replace(/\s+/g, '_');
          // Add note as comment if it exists
          const note = key.note ? ` # ${key.note}` : '';
          envLines.push(`${envName}=${key.value}${note}`);
        }
      });
    });
  });

  return envLines.join('\n');
}
