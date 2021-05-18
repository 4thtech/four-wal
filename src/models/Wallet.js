import EthereumVault from '@/models/vaults/EthereumVault';
import SubstrateVault from '@/models/vaults/SubstrateVault';
import RsaVault from '@/models/vaults/RsaVault';
import ethAddressToTolarAddress from '@/helpers/hashnet';

export default class Wallet {
  constructor() {
    this.ethereumVault = new EthereumVault();
    this.substrateVault = new SubstrateVault();
    this.rsaVault = new RsaVault();
  }

  getAccounts() {
    const ethereumAddress = this.ethereumVault.getDefaultAccount();

    return [
      {
        type: 'ETH',
        name: 'Ethereum Account',
        address: ethereumAddress,
      },
      {
        type: 'DOT',
        name: 'Substrate Account',
        address: this.substrateVault.getDefaultAccount(),
      },
      {
        type: 'TOL',
        name: 'Tolar Account',
        address: ethAddressToTolarAddress(ethereumAddress),
      },
    ];
  }

  async getBackupData(password) {
    return {
      eth: await this.ethereumVault.getBackupData(password),
      dot: this.substrateVault.getBackupData(password),
      rsa: this.rsaVault.getBackupData(password),
    };
  }

  static async create() {
    const wallet = new Wallet();

    // Create Vaults
    await Promise.all([
      wallet.ethereumVault.create(),
      wallet.substrateVault.create(),
      wallet.rsaVault.create(),
    ]);

    return wallet;
  }

  async sendPublicKeyToPlatform() {
    const signedMessage = await this.ethereumVault.signMessage('@4thtech');
    await this.rsaVault.sendPublicKeyToPlatform(this.getAccounts(), signedMessage);
  }

  static async restore(jsonString, password) {
    const encryptedVaults = JSON.parse(jsonString);
    const wallet = new Wallet();

    // Restore Vaults
    await Promise.all([
      wallet.ethereumVault.restore(encryptedVaults.eth, password),
      wallet.substrateVault.restore(encryptedVaults.dot, password),
      wallet.rsaVault.restore(encryptedVaults.rsa, password),
    ]);

    return wallet;
  }

  getStoreData() {
    return {
      accounts: this.getAccounts(),
    };
  }
}
