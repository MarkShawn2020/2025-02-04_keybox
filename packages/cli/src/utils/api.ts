import keytar from 'keytar';

const KEYBOX_SERVICE = 'keybox-cli';
const TOKEN_KEY = 'auth-token';
const API_BASE_URL = 'http://localhost:3000/api';

export async function getAuthToken(): Promise<string | null> {
  return keytar.getPassword(KEYBOX_SERVICE, TOKEN_KEY);
}

export async function fetchEnvVars(token: string, projectName: string): Promise<Record<string, string>> {
  const response = await fetch(`${API_BASE_URL}/projects/${encodeURIComponent(projectName)}/env`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch env vars: ${response.statusText}`);
  }

  return response.json();
}

interface CreateProjectParams {
  name: string;
  envKeys: string[];
}

export async function createProject(token: string, params: CreateProjectParams): Promise<Record<string, string>> {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error(`Failed to create project: ${response.statusText}`);
  }

  return response.json();
}
