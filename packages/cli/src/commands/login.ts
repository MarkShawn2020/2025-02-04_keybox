import axios from 'axios';
import open from 'open';
import { Spinner } from 'cli-spinner';
import keytar from 'keytar';

const API_URL = process.env.API_URL || 'http://localhost:3001';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const SERVICE_NAME = 'keybox-cli';

export async function login() {
    try {
      console.log('Connecting to API server...');
      // Step 1: Get device code
      const { data: deviceData } = await axios.post(`${API_URL}/auth/device/code`);
      
      if (!deviceData?.verification_uri) {
        throw new Error('Invalid response from server');
      }
      
      // Add FRONTEND_URL if verification_uri is a relative path
      const verificationUrl = deviceData.verification_uri.startsWith('http')
        ? deviceData.verification_uri
        : `${FRONTEND_URL}${deviceData.verification_uri}`;
      
      console.log('\nTo login, please enter this code on the verification page:');
      console.log(`\n    ${deviceData.user_code}\n`);
      
      // Open browser for verification
      console.log(`Opening browser to ${verificationUrl}...`);
      try {
        await open(verificationUrl);
      } catch (error) {
        console.log('Failed to open browser automatically.');
        console.log(`Please open this URL manually: ${verificationUrl}`);
      }
      
      // Step 2: Poll for token
      const spinner = new Spinner('Waiting for device verification... %s');
      spinner.setSpinnerString('|/-\\');
      spinner.start();
      
      while (true) {
        try {
          const { data: tokenData } = await axios.post(`${API_URL}/auth/device/token`, {
            device_code: deviceData.device_code
          });
          
          if (tokenData.token) {
            // Store token in system keychain
            await keytar.setPassword(SERVICE_NAME, 'token', tokenData.token);
            
            spinner.stop(true);
            console.log('✓ Successfully logged in!');
            break;
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 400) {
            if (error.response.data.error === 'Device code expired') {
              spinner.stop(true);
              console.log('✗ Login timeout. Please try again.');
              return;
            }
          }
          if (axios.isAxiosError(error) && error.response?.data.error === 'Authorization pending') {
            // Continue polling if authorization is pending
            await new Promise(resolve => setTimeout(resolve, deviceData.interval * 1000));
          } else {
            spinner.stop(true);
            console.error('Error while polling:', error instanceof Error ? error.message : 'Unknown error');
            process.exit(1);
          }
        }
      }
    } catch (error) {
      console.error('Failed to login:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
}
