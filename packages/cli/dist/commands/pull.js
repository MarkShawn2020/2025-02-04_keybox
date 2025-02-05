"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pull = pull;
const chalk_1 = __importDefault(require("chalk"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const api_1 = require("../utils/api");
async function pull(options) {
    try {
        const token = await (0, api_1.getAuthToken)();
        if (!token) {
            console.log(chalk_1.default.red('Not logged in. Please run `keybox login` first.'));
            return;
        }
        let projectName = options.project;
        if (!projectName) {
            // Try to get project from current directory
            projectName = path_1.default.basename(process.cwd());
            console.log(chalk_1.default.yellow(`Using current directory name as project: ${projectName}`));
        }
        console.log(chalk_1.default.blue(`Pulling environment variables for project: ${projectName}`));
        const envVars = await (0, api_1.fetchEnvVars)(token, projectName);
        // Format env vars
        const envContent = Object.entries(envVars)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        // Write to file
        await promises_1.default.writeFile(options.output, envContent);
        console.log(chalk_1.default.green(`✓ Environment variables saved to ${options.output}`));
    }
    catch (error) {
        console.error(chalk_1.default.red('Failed to pull environment variables:'), error);
        process.exit(1);
    }
}
