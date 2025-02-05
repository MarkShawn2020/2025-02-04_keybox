#!/usr/bin/env node

import { Command } from 'commander';
import { login } from './commands/login';
import { logout } from './commands/logout';
import { pull } from './commands/pull';
import { create } from './commands/create';

const program = new Command();

program
  .name('keybox')
  .description('KeyBox CLI - Manage your environment variables with ease')
  .version('0.1.0');

program
  .command('login')
  .description('Login to KeyBox')
  .action(login);

program
  .command('logout')
  .description('Logout from KeyBox')
  .action(logout);

program
  .command('pull')
  .description('Pull environment variables for a project')
  .option('-p, --project <name>', 'Project name')
  .option('-o, --output <path>', 'Output file path', '.env')
  .action(pull);

program
  .command('create')
  .description('Create a new project based on .env.example')
  .option('-n, --name <name>', 'Project name (defaults to current directory name)')
  .option('-e, --example <path>', 'Path to .env.example file', '.env.example')
  .action(create);

program.parse();
