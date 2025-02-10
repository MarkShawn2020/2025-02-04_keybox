import keytar from 'keytar';
import {API_URL} from "../settings";

const KEYBOX_SERVICE = 'keybox-cli';
const TOKEN_KEY = 'token';

export async function getAuthToken(): Promise<string | null> {
  return keytar.getPassword(KEYBOX_SERVICE, TOKEN_KEY);
}

export async function fetchEnvVars(token: string, projectName: string): Promise<Record<string, string>> {
  const response = await fetch(`${API_URL}/projects/${encodeURIComponent(projectName)}/keys`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Response error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`Failed to fetch env vars: ${errorText}`);
  }

  return response.json();
}

interface CreateProjectParams {
  name: string;
  envKeys: string[];
}

export async function createProject(token: string, params: CreateProjectParams): Promise<Record<string, string>> {
  const response = await fetch(`${API_URL}/projects`, {
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
