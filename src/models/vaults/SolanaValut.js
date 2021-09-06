import { Keypair } from '@solana/web3.js';
import { AES, enc } from 'crypto-js';

export default class SolanaVault {
  constructor() {
    this.keypair = null;
  }

  create() {
    this.keypair = Keypair.generate();
  }

  async restore(encryptedString, password) {
    const bytes = AES.decrypt(encryptedString, password);
    const data = JSON.parse(bytes.toString(enc.Utf8));

    this.keypair = Keypair.fromSecretKey(new Uint8Array(Object.values(data.secretKey)));
  }

  getDefaultAccount() {
    return this.keypair.publicKey.toString();
  }

  getBackupData(password) {
    return AES.encrypt(JSON.stringify({ secretKey: this.keypair.secretKey }), password).toString();
  }
}
