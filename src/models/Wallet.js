import EthereumVault from '@/models/vaults/EthereumVault';
import SubstrateVault from '@/models/vaults/SubstrateVault';
import RsaVault from '@/models/vaults/RsaVault';
import SolanaVault from '@/models/vaults/SolanaValut';
import TronVault from '@/models/vaults/TronValut';
import ethAddressToTolarAddress from '@/helpers/hashnet';
import StorageService from './StorageService';

export default class Wallet {
  constructor() {
    this.ethereumVault = new EthereumVault();
    this.substrateVault = new SubstrateVault();
    this.rsaVault = new RsaVault();
    this.solanaValut = new SolanaVault();
    this.tronValut = new TronVault();
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
      {
        type: 'SOL',
        name: 'Solana Account',
        address: this.solanaValut.getDefaultAccount(),
      },
      {
        type: 'TRX',
        name: 'Tron Account',
        address: this.tronValut.getPublicKey(),
      },
    ];
  }

  async getBackupData(password) {
    return {
      eth: await this.ethereumVault.getBackupData(password),
      dot: this.substrateVault.getBackupData(password),
      rsa: this.rsaVault.getBackupData(password),
      sol: this.solanaValut.getBackupData(password),
      trx: this.tronValut.getBackupData(password),
    };
  }

  static async create() {
    const wallet = new Wallet();

    // Create Vaults
    await Promise.all([
      wallet.ethereumVault.create(),
      wallet.substrateVault.create(),
      wallet.rsaVault.create(),
      wallet.solanaValut.create(),
      wallet.tronValut.create(),
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
      encryptedVaults.sol
        ? wallet.solanaValut.restore(encryptedVaults.sol, password)
        : wallet.solanaValut.create(),
      encryptedVaults.trx
        ? wallet.tronValut.restore(encryptedVaults.trx, password)
        : wallet.tronValut.create(),
    ]);

    if (!encryptedVaults.trx) {
      wallet.sendPublicKeyToPlatform();
    }

    if (Object.keys(encryptedVaults).length < Object.keys(wallet).length) {
      await wallet.getBackupData(password).then((backupData) => {
        StorageService.saveWallet(JSON.stringify(backupData));
      });
    }

    return wallet;
  }

  getStoreData() {
    return {
      accounts: this.getAccounts(),
    };
  }
}
