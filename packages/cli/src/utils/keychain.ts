import keytar from 'keytar';

class Keychain {
  private service = 'keybox';

  async getAccessToken(): Promise<string | null> {
    return keytar.getPassword(this.service, 'access_token');
  }

  async setAccessToken(token: string): Promise<void> {
    await keytar.setPassword(this.service, 'access_token', token);
  }

  async deletePassword(service: string, account: string): Promise<boolean> {
    return keytar.deletePassword(service, account);
  }
}

// 单例模式
let keychainInstance: Keychain | null = null;

export function getKeychain(): Keychain {
  if (!keychainInstance) {
    keychainInstance = new Keychain();
  }
  return keychainInstance;
}
