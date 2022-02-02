import { ethers } from 'ethers';
import Web3 from '@dreamfactoryhr/web3t';

export default class EthereumVault {
  constructor() {
    this.wallet = null;
    this.tolarWeb3 = new Web3('https://gateway.sichain.the4thpillar.com');
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

  signTolarTransaction(tx) {
    const { tolar } = this.tolarWeb3;
    const sender = tolar.accounts.privateKeyToAccount(this.wallet.privateKey);

    return sender.signTransaction(tx, sender.privateKey);
  }
}
