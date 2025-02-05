import keytar from 'keytar';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { getAuthToken, fetchEnvVars } from '../utils/api';

interface PullOptions {
  project?: string;
  output: string;
}

export async function pull(options: PullOptions) {
  try {
    const token = await getAuthToken();
    if (!token) {
      console.log(chalk.red('Not logged in. Please run `keybox login` first.'));
      return;
    }

    let projectName = options.project;
    if (!projectName) {
      // Try to get project from current directory
      projectName = path.basename(process.cwd());
      console.log(chalk.yellow(`Using current directory name as project: ${projectName}`));
    }

    console.log(chalk.blue(`Pulling environment variables for project: ${projectName}`));
    
    const envVars = await fetchEnvVars(token, projectName);
    
    // Format env vars
    const envContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Write to file
    await fs.writeFile(options.output, envContent);
    
    console.log(chalk.green(`✓ Environment variables saved to ${options.output}`));
  } catch (error) {
    let errorMessage = 'Failed to pull environment variables';
    
    if (error.message.includes('Project not found')) {
      errorMessage = `Project '${projectName}' not found. Please create it first using 'keybox create'.`;
    } else if (error.message.includes('Not logged in')) {
      errorMessage = 'Not logged in. Please run `keybox login` first.';
    } else {
      // Try to parse error message if it's JSON
      try {
        const parsed = JSON.parse(error.message);
        if (parsed.error) {
          errorMessage = parsed.error;
        }
      } catch {}
    }
    
    console.error(chalk.red(errorMessage));
    process.exit(1);
  }
}
