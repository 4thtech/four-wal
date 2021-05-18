import { ethers } from 'ethers';

export default class EthereumVault {
  constructor() {
    this.wallet = null;
  }

  create() {
    this.wallet = ethers.Wallet.createRandom();
  }

  async restore(encryptedString, password) {
    this.wallet = await ethers.Wallet.fromEncryptedJson(encryptedString, password);
  }

  getDefaultAccount() {
    return this.wallet.address;
  }

  getBackupData(password) {
    return this.wallet.encrypt(password);
  }

  signMessage(message) {
    return this.wallet.signMessage(message);
  }

  signTransaction(transaction) {
    return this.wallet.signTransaction(transaction);
  }
}
