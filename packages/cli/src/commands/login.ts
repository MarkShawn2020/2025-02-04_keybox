import axios from 'axios';
import open from 'open';
import { Spinner } from 'cli-spinner';
import keytar from 'keytar';
import chalk from 'chalk';

const API_URL = process.env.KEYBOX_API_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/api';
console.log(chalk.gray(`Using API URL: ${API_URL}`));
const SERVICE_NAME = 'keybox-cli';
const POLL_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 60; // 5 minutes total

async function getCurrentUser(token: string) {
  try {
    console.log(chalk.blue('🔍 Checking current login status...'));
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(chalk.blue('✓ Successfully retrieved user info'));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(chalk.yellow(`ℹ Token validation failed: ${error.response?.status} ${error.response?.statusText}`));
    }
    return null;
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
        // Token exists but is invalid - clear it
        await keytar.deletePassword(SERVICE_NAME, 'token');
        console.log(chalk.yellow('✓ Invalid token cleared'));
      }
      
      // Start device flow
      console.log(chalk.blue('🔄 Starting device authentication...'));
      
      // Request device code
      const response = await axios.post(`${API_URL}/device/code`);
      const { device_code, verification_uri, user_code } = response.data;
      
      // Add API_URL if verification_uri is a relative path
      const verificationUrl = verification_uri.startsWith('http')
        ? verification_uri
        : `${API_URL}${verification_uri}`;
      
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
      
      // Start polling
      const spinner = new Spinner('Waiting for authentication... %s');
      spinner.setSpinnerString('|/-\\');
      spinner.start();
      
      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          const tokenResponse = await axios.post(`${API_URL}/device/token`, {
            device_code
          });
          
          if (tokenResponse.data.access_token) {
            spinner.stop(true);
            await keytar.setPassword(SERVICE_NAME, 'token', tokenResponse.data.access_token);
            
            // Get user info
            const user = await getCurrentUser(tokenResponse.data.access_token);
            console.log(chalk.green('\n✓ Successfully logged in!'));
            console.log(`Email: ${chalk.cyan(user.email)}`);
            return;
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
              if (error.response.data.error === 'device_code_expired') {
                spinner.stop(true);
                console.log(chalk.red('\n✗ Login timeout. Please try again.'));
                return;
              }
              if (error.response.data.error === 'authorization_pending') {
                // Continue polling
                await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
                retries++;
                continue;
              }
            }
            spinner.stop(true);
            console.error('Error while polling:', error.response?.data?.error || error.message);
            process.exit(1);
          }
          // Ignore other polling errors
          await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
          retries++;
        }
      }
      
      spinner.stop(true);
      console.log(chalk.red('\n❌ Authentication timed out. Please try again.'));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(chalk.red('Failed to login:'));
        if (error.response) {
          console.error(chalk.yellow(`Status: ${error.response.status} ${error.response.statusText}`));
          console.error(chalk.yellow(`URL: ${error.config?.url}`));
          if (error.response.data) {
            console.error(chalk.yellow('Response:', JSON.stringify(error.response.data, null, 2)));
          }
        } else if (error.request) {
          console.error(chalk.yellow('No response received from server'));
          console.error(chalk.yellow(`URL: ${error.config?.url}`));
        } else {
          console.error(chalk.yellow(error.message));
        }
      } else {
        console.error(chalk.red('Failed to login:'), 
          error instanceof Error ? error.message : 'Unknown error');
      }
      process.exit(1);
    }
}
