"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
const chalk_1 = __importDefault(require("chalk"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const api_1 = require("../utils/api");
async function create(options) {
    try {
        const token = await (0, api_1.getAuthToken)();
        if (!token) {
            console.log(chalk_1.default.red('Not logged in. Please run `keybox login` first.'));
            return;
        }
        let projectName = options.name;
        if (!projectName) {
            projectName = path_1.default.basename(process.cwd());
            console.log(chalk_1.default.yellow(`Using current directory name as project: ${projectName}`));
        }
        // Read .env.example
        let envExample;
        try {
            envExample = await promises_1.default.readFile(options.example, 'utf-8');
        }
        catch (error) {
            console.error(chalk_1.default.red(`Could not read ${options.example}:`), error);
            process.exit(1);
        }
        // Parse .env.example to get keys
        const envKeys = envExample
            .split('\n')
            .filter(line => line.trim() && !line.startsWith('#'))
            .map(line => line.split('=')[0]);
        console.log(chalk_1.default.blue(`Creating project ${projectName} with ${envKeys.length} environment variables...`));
        // Create project and get generated env vars
        const envVars = await (0, api_1.createProject)(token, {
            name: projectName,
            envKeys
        });
        // Write to .env
        const envContent = Object.entries(envVars)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        await promises_1.default.writeFile('.env', envContent);
        console.log(chalk_1.default.green(`✓ Project created and environment variables saved to .env`));
    }
    catch (error) {
        console.error(chalk_1.default.red('Failed to create project:'), error);
        process.exit(1);
    }
}
