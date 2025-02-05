import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { getAuthToken, createProject } from '../utils/api';

interface CreateOptions {
  name?: string;
  example: string;
}

export async function create(options: CreateOptions) {
  try {
    const token = await getAuthToken();
    if (!token) {
      console.log(chalk.red('Not logged in. Please run `keybox login` first.'));
      return;
    }

    let projectName = options.name;
    if (!projectName) {
      projectName = path.basename(process.cwd());
      console.log(chalk.yellow(`Using current directory name as project: ${projectName}`));
    }

    // Read .env.example
    let envExample;
    try {
      envExample = await fs.readFile(options.example, 'utf-8');
    } catch (error) {
      console.error(chalk.red(`Could not read ${options.example}:`), error);
      process.exit(1);
    }

    // Parse .env.example to get keys
    const envKeys = envExample
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => line.split('=')[0]);

    console.log(chalk.blue(`Creating project ${projectName} with ${envKeys.length} environment variables...`));

    // Create project and get generated env vars
    const envVars = await createProject(token, {
      name: projectName,
      envKeys
    });

    // Write to .env
    const envContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    await fs.writeFile('.env', envContent);
    
    console.log(chalk.green(`✓ Project created and environment variables saved to .env`));
  } catch (error) {
    console.error(chalk.red('Failed to create project:'), error);
    process.exit(1);
  }
}
