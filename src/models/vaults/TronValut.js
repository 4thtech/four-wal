import TronWeb from 'tronweb';
import { AES, enc } from 'crypto-js';

export default class TronVault {
  constructor() {
    const mainOptions = {
      fullNode: 'https://api.nileex.io',
      solidityNode: 'https://api.nileex.io',
      eventServer: 'https://api.nileex.io',
    };

    this.tronWeb = new TronWeb(mainOptions);
  }

  async create() {
    const account = await this.tronWeb.createAccount();
    this.tronWeb.setPrivateKey(account.privateKey);
  }

  async restore(encryptedString, password) {
    const bytes = AES.decrypt(encryptedString, password);
    const data = bytes.toString(enc.Utf8);
    this.tronWeb.setPrivateKey(data);
  }

  getPublicKey() {
    return this.tronWeb.address.fromPrivateKey(this.getPrivateKey());
  }

  getBackupData(password) {
    return AES.encrypt(this.getPrivateKey(), password).toString();
  }

  getPrivateKey() {
    return this.tronWeb.defaultPrivateKey;
  }

  signTransaction(serializedTransaction) {
    return this.tronWeb.trx.sign(serializedTransaction, this.getPrivateKey());
  }
}
