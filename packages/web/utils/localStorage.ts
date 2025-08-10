'use client';

export interface Platform {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  key_groups: KeyGroup[];
}

export interface KeyGroup {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  keys: Key[];
}

export interface Key {
  id: string;
  value: string;
  note?: string;
  revoked: boolean;
  created_at: string;
  updated_at: string;
}

export interface KeyConfig {
  platforms: Platform[];
  version: string;
  lastUpdated: string;
}

const STORAGE_KEY = 'keybox_config';
const CONFIG_VERSION = '1.0.0';

export const localStorage = {
  getConfig(): KeyConfig {
    if (typeof window === 'undefined') {
      return {
        platforms: [],
        version: CONFIG_VERSION,
        lastUpdated: new Date().toISOString()
      };
    }
    
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        platforms: [],
        version: CONFIG_VERSION,
        lastUpdated: new Date().toISOString()
      };
    }
    
    try {
      return JSON.parse(stored);
    } catch {
      return {
        platforms: [],
        version: CONFIG_VERSION,
        lastUpdated: new Date().toISOString()
      };
    }
  },

  saveConfig(config: KeyConfig): void {
    if (typeof window === 'undefined') return;
    
    config.lastUpdated = new Date().toISOString();
    config.version = CONFIG_VERSION;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  },

  exportConfig(): string {
    const config = this.getConfig();
    return JSON.stringify(config, null, 2);
  },

  importConfig(jsonString: string): void {
    try {
      const config = JSON.parse(jsonString) as KeyConfig;
      if (!config.platforms || !Array.isArray(config.platforms)) {
        throw new Error('Invalid configuration format');
      }
      this.saveConfig(config);
    } catch (error) {
      throw new Error(`Failed to import configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  downloadConfigAsFile(): void {
    const config = this.exportConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keybox-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importConfigFromFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          this.importConfig(content);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
};