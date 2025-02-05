import keytar from 'keytar';
import chalk from 'chalk';

const SERVICE_NAME = 'keybox-cli';

export async function logout() {
  try {
    // Check if there's a token to remove
    const existingToken = await keytar.getPassword(SERVICE_NAME, 'token');
    
    if (!existingToken) {
      console.log(chalk.yellow('ℹ No active session found'));
      return;
    }

    // Remove the token from system keychain
    await keytar.deletePassword(SERVICE_NAME, 'token');
    console.log(chalk.green('✅ Successfully logged out from KeyBox'));
  } catch (error) {
    console.error(chalk.red('❌ Failed to logout:'), error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
