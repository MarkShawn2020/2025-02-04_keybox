"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const keytar_1 = __importDefault(require("keytar"));
const http_1 = require("http");
const url_1 = require("url");
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const crypto_1 = __importDefault(require("crypto"));
const KEYBOX_SERVICE = 'keybox-cli';
const TOKEN_KEY = 'auth-token';
const AUTH_PORT = 3333;
const API_URL = process.env.KEYBOX_API_URL || 'http://localhost:3000';
// PKCE helper functions
function base64URLEncode(str) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
function sha256(str) {
    return crypto_1.default.createHash('sha256').update(str).digest();
}
function generateCodeVerifier() {
    return base64URLEncode(crypto_1.default.randomBytes(32));
}
function generateCodeChallenge(verifier) {
    return base64URLEncode(sha256(verifier));
}
async function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
async function promptForEmail() {
    const { email } = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'email',
            message: 'Enter your email address:',
            validate: async (input) => {
                if (!await validateEmail(input)) {
                    return 'Please enter a valid email address';
                }
                return true;
            }
        }
    ]);
    return email;
}
async function startAuthServer(codeVerifier) {
    return new Promise((resolve, reject) => {
        const server = (0, http_1.createServer)(async (req, res) => {
            if (!req.url) {
                res.writeHead(400);
                res.end('Bad Request');
                return;
            }
            const { searchParams } = new url_1.URL(req.url, `http://localhost:${AUTH_PORT}`);
            const code = searchParams.get('code');
            const error = searchParams.get('error');
            if (error) {
                res.writeHead(400, { 'Content-Type': 'text/html' });
                res.end(`
          <html>
            <body>
              <h1>Authentication Failed</h1>
              <p>${error}</p>
              <p>Please close this window and try again.</p>
              <script>setTimeout(() => window.close(), 3000)</script>
            </body>
          </html>
        `);
                server.close();
                reject(new Error(error));
                return;
            }
            if (code) {
                try {
                    // 使用 code 和 verifier 交换 token
                    const tokenResponse = await (0, node_fetch_1.default)(`${API_URL}/api/cli/auth/callback`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            code,
                            code_verifier: codeVerifier,
                        }),
                    });
                    if (!tokenResponse.ok) {
                        const error = await tokenResponse.text();
                        throw new Error(error);
                    }
                    const { token } = await tokenResponse.json();
                    await keytar_1.default.setPassword(KEYBOX_SERVICE, TOKEN_KEY, token);
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(`
            <html>
              <body>
                <h1>Successfully logged in to KeyBox!</h1>
                <p>You can close this window and return to the terminal.</p>
                <script>window.close()</script>
              </body>
            </html>
          `);
                    server.close();
                    resolve(token);
                }
                catch (error) {
                    console.error('Token exchange error:', error);
                    reject(error);
                }
            }
            else {
                res.writeHead(400);
                res.end('No token provided');
            }
        });
        server.listen(AUTH_PORT);
    });
}
async function login() {
    console.log(chalk_1.default.blue('Starting login process...'));
    try {
        // 1. Get email from user
        const email = await promptForEmail();
        console.log(chalk_1.default.gray(`Using email: ${email}`));
        // 2. Generate PKCE parameters
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = generateCodeChallenge(codeVerifier);
        // 3. Start local server for callback
        const serverPromise = startAuthServer(codeVerifier);
        // 4. Initiate authentication
        const authUrl = `${API_URL}/api/cli/auth?callback=http://localhost:${AUTH_PORT}&email=${encodeURIComponent(email)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;
        console.log(chalk_1.default.gray(`Debug: Using API URL: ${API_URL}`));
        console.log(chalk_1.default.yellow('\nSending magic link to your email...'));
        try {
            const response = await (0, node_fetch_1.default)(authUrl);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || data.message || 'Authentication failed');
            }
        }
        catch (error) {
            console.error(chalk_1.default.red('Debug: Fetch error details:'), error);
            throw new Error(`Network request failed: ${error.message}`);
        }
        console.log(chalk_1.default.green('\n✓ Magic link sent!'));
        console.log(chalk_1.default.yellow('Please check your email and click the login link.'));
        // 4. Wait for authentication to complete
        await serverPromise;
        console.log(chalk_1.default.green('\n✓ Successfully logged in!'));
    }
    catch (error) {
        console.error(chalk_1.default.red('\n✗ Authentication failed:'), error.message);
        process.exit(1);
    }
}
