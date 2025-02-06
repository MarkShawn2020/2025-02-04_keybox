import axios from 'axios';
import open from 'open';
import keytar from 'keytar';
import chalk from 'chalk';
import express from 'express';
import cors from 'cors';
import { AddressInfo } from 'net';

const port = 45678;

const API_URL = process.env.KEYBOX_API_URL || process.env.NEXT_PUBLIC_APP_URL || "https://keybox.cs-magic.cn"
console.log(chalk.gray(`Using API URL: ${API_URL}`));
const SERVICE_NAME = 'keybox-cli';

async function getCurrentUser(token: string) {
  try {
    console.log(chalk.blue('🔍 Checking current login status...'));
    const response = await axios.get(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(chalk.blue('✓ Successfully retrieved user info'));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(chalk.yellow(`ℹ Token validation failed: ${error.response?.status} ${error.response?.statusText}`));
    }
    return { email: 'anonymous@keybox.dev' };
  }
}

export async function login() {
    try {
        // Check if already logged in
        console.log(chalk.blue('🔑 Checking for existing credentials...'));
        const existingToken = await keytar.getPassword(SERVICE_NAME, 'token');
        
        if (existingToken) {
            console.log(chalk.blue('✓ Found existing token'));
            const user = await getCurrentUser(existingToken);
            if (user) {
                console.log(chalk.green('\n✓ Successfully verified existing login!'));
                console.log(`Email: ${chalk.cyan(user.email)}`);
                if (user.last_sign_in_at) {
                    console.log(`Last login: ${chalk.cyan(new Date(user.last_sign_in_at).toLocaleString())}`);
                }
                return;
            }
            
            console.log(chalk.yellow('⚠️ Existing token is invalid, clearing...'));
            await keytar.deletePassword(SERVICE_NAME, 'token');
            console.log(chalk.yellow('✓ Invalid token cleared'));
        }
        
        // Start local server
        
        const app = express();
        
        // Enable CORS
        app.use(cors({
          origin: API_URL || 'http://localhost:3000',
          methods: ['GET', 'POST'],
          credentials: true,
        }));
        
        // Create a Promise that will resolve when authentication is complete
        const authPromise = new Promise<string>((resolve, reject) => {
            const server = app.listen(port, async () => {
                const { port: actualPort } = server.address() as AddressInfo;
                console.log(chalk.blue('🔄 Starting device authentication...'));
                
                try {
                    // Request device code with local callback URL
                    const response = await axios.post(`${API_URL}/api/device/code`, {
                        callback_url: `http://localhost:${actualPort}/callback`
                    });
                    const { device_code, user_code } = response.data;
                    
                    // Add API_URL if verification_uri is a relative path
                    const verificationUrl = `${API_URL}/cli/verify-device`;
                    
                    console.log(chalk.green('\n✓ Device code generated!'));
                    console.log('\nPlease visit:');
                    console.log(chalk.cyan(verificationUrl));
                    console.log('\nAnd enter the code:');
                    console.log(chalk.yellow(user_code));
                    
                    // Open browser
                    try {
                        await open(verificationUrl);
                    } catch (error) {
                        console.log('Failed to open browser automatically.');
                        console.log(`Please open this URL manually: ${verificationUrl}`);
                    }
                } catch (error) {
                    server.close();
                    reject(new Error('Failed to start device authentication'));
                }
            });

            // Handle callback from web app
            app.post('/callback', express.json(), async (req, res) => {
                const { access_token } = req.body;
                if (!access_token) {
                    res.status(400).json({ error: 'No access token provided' });
                    return;
                }
                
                res.json({ status: 'success' });
                server.close();
                resolve(access_token);
            });

            // Handle verification failure
            app.post('/error', express.json(), (req, res) => {
                const { error } = req.body;
                res.json({ status: 'received' });
                server.close();
                reject(new Error(error || 'Authentication failed'));
            });
        });

        // Wait for authentication to complete
        console.log(chalk.blue('\nWaiting for authentication...'));
        const access_token = await authPromise;
        
        // Save token and get user info
        await keytar.setPassword(SERVICE_NAME, 'token', access_token);
        const user = await getCurrentUser(access_token);
        
        console.log(chalk.green('\n✓ Successfully logged in!'));
        console.log(`Email: ${chalk.cyan(user.email)}`);
        
    } catch (error) {
        if (error instanceof Error) {
            console.error(chalk.red(`\n✗ ${error.message}`));
        } else {
            console.error(chalk.red('\n✗ An unknown error occurred'));
        }
        process.exit(1);
    }
}
