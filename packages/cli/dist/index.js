#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const login_1 = require("./commands/login");
const pull_1 = require("./commands/pull");
const create_1 = require("./commands/create");
const program = new commander_1.Command();
program
    .name('keybox')
    .description('KeyBox CLI - Manage your environment variables with ease')
    .version('0.1.0');
program
    .command('login')
    .description('Login to KeyBox')
    .action(login_1.login);
program
    .command('pull')
    .description('Pull environment variables for a project')
    .option('-p, --project <name>', 'Project name')
    .option('-o, --output <path>', 'Output file path', '.env')
    .action(pull_1.pull);
program
    .command('create')
    .description('Create a new project based on .env.example')
    .option('-n, --name <name>', 'Project name (defaults to current directory name)')
    .option('-e, --example <path>', 'Path to .env.example file', '.env.example')
    .action(create_1.create);
program.parse();
