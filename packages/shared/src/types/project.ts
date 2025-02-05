export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ProjectKey {
  project_id: string;
  key_id: string;
  created_at: string;
}

export interface ProjectWithKeys extends Project {
  keys: string[]; // Array of key IDs associated with this project
}
