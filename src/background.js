import { LocalStream } from 'extension-streams';
import { InternalMessageTypes } from '@/popup/constants/messages';
import Wallet from '@/models/Wallet';
import StorageService from '@/models/StorageService';
import { cryptoWaitReady } from '@polkadot/util-crypto';

class Background {
  constructor() {
    this.wallet = null;
    this.setupInternalMessaging();
  }

  /**
   * Watches for messages over extension streams
   */
  setupInternalMessaging() {
    LocalStream.watch((request, sendResponse) => {
      this.processMessage(request, sendResponse);
    });
  }

  /**
   * Method delegate message to responsible method
   *
   * @param message
   * @param sendResponse
   */
  async processMessage(message, sendResponse) {
    switch (message.type) {
      case InternalMessageTypes.CREATE_WALLET:
        this.createWallet(message.payload, sendResponse);
        break;

      case InternalMessageTypes.LOAD_WALLET:
        this.loadWallet(sendResponse);
        break;

      case InternalMessageTypes.LOCK_WALLET:
        this.lockWallet(sendResponse);
        break;

      case InternalMessageTypes.UNLOCK_WALLET:
        this.unlockWallet(message.payload, sendResponse);
        break;

      case InternalMessageTypes.EXPORT_BACKUP:
        this.exportBackup();
        break;

      case InternalMessageTypes.EXPORT_ETHEREUM_BACKUP:
        this.exportEthereumBackup();
        break;

      case InternalMessageTypes.EXPORT_SOLANA_BACKUP:
        this.exportSolanaBackup();
        break;

      case InternalMessageTypes.RESTORE_ACCOUNTS:
        this.restoreAccounts(message.payload, sendResponse);
        break;

      case InternalMessageTypes.GET_ACCOUNTS:
        this.getAccounts(sendResponse);
        break;

      case InternalMessageTypes.SUBSTRATE_SIGN_PAYLOAD:
        this.substrateSignPayload(message.payload, sendResponse);
        break;

      case InternalMessageTypes.SIGN_ETHEREUM_MESSAGE:
        this.signEthereumMessage(message.payload, sendResponse);
        break;

      case InternalMessageTypes.SIGN_ETHEREUM_TRANSACTION:
        this.signEthereumTransaction(message.payload, sendResponse);
        break;

      case InternalMessageTypes.SIGN_TOLAR_TRANSACTION:
        this.signTolarTransaction(message.payload, sendResponse);
        break;

      case InternalMessageTypes.SIGN_SOLANA_TRANSACTION:
        this.signSolanaTransaction(message.payload, sendResponse);
        break;

      case InternalMessageTypes.SIGN_TRON_TRANSACTION:
        this.signTronTransaction(message.payload, sendResponse);
        break;

      case InternalMessageTypes.REQUEST_FILE_DOWNLOAD:
        this.requestFileDownload(message.payload, sendResponse);
        break;

      case InternalMessageTypes.DECRYPT_FILE_DATA:
        this.decryptFileData(message.payload, sendResponse);
        break;

      case InternalMessageTypes.DECRYPT_ASYMMETRIC_DATA:
        this.decryptAsymmetricData(message.payload, sendResponse);
        break;

      case InternalMessageTypes.DECRYPT_MESSAGE:
        this.decryptMessage(message.payload, sendResponse);
        break;

      default:
        break;
    }
  }

  createWallet = (password, sendResponse) => {
    Wallet.create().then(async (wallet) => {
      this.wallet = wallet;
      await this.saveWallet(password);
      await this.loadWallet(sendResponse);
    });
  };

  saveWallet = async (password) => {
    const backupData = await this.wallet.getBackupData(password);
    return StorageService.saveWallet(JSON.stringify(backupData));
  };

  retrieveWallet = async () => {
    return StorageService.getWallet();
  };

  loadWallet = async (sendResponse) => {
    await cryptoWaitReady();

    // Wallet is unlocked
    if (this.wallet) {
      await this.sendPublicKeyToPlatform();
      sendResponse(this.wallet.getStoreData());
      return;
    }

    // Wallet is locked
    const wallet = await this.retrieveWallet();
    if (wallet) {
      sendResponse({
        accounts: [],
      });
      return;
    }

    // Wallet not exist
    sendResponse(null);
  };

  sendPublicKeyToPlatform = async () => {
    if (!(await StorageService.getIsPublicKeySavedOnPlatform())) {
      this.wallet.sendPublicKeyToPlatform().then(() => {
        StorageService.saveIsPublicKeySavedOnPlatform(true);
      });
    }
  };

  lockWallet = async (sendResponse) => {
    this.wallet = null;
    await this.loadWallet(sendResponse);
  };

  unlockWallet = async (password, sendResponse) => {
    try {
      const encryptedJson = await this.retrieveWallet();
      this.wallet = await Wallet.restore(encryptedJson, password);

      await this.loadWallet(sendResponse);
    } catch (e) {
      sendResponse({ error: e.message });
    }
  };

  exportBackup = async () => {
    const encryptedJson = await this.retrieveWallet();
    const fileData = new Blob([Buffer.from(JSON.stringify(encryptedJson))], {
      type: 'application/json',
    });

    browser.downloads.download({
      filename: `fourwal-backup-${Date.now()}.json`,
      url: URL.createObjectURL(fileData),
    });
  };

  exportEthereumBackup = async () => {
    const privateKey = this.wallet.ethereumVault.getPrivateKey();
    const fileData = new Blob([Buffer.from(JSON.stringify(privateKey))], {
      type: 'application/json',
    });

    browser.downloads.download({
      filename: `fourwal-ethereum-backup-${Date.now()}.json`,
      url: URL.createObjectURL(fileData),
    });
  };

  exportSolanaBackup = async () => {
    const privateKey = this.wallet.solanaValut.getPrivateKey();
    const fileData = new Blob([Buffer.from(JSON.stringify(privateKey))], {
      type: 'application/json',
    });

    browser.downloads.download({
      filename: `fourwal-solana-backup-${Date.now()}.json`,
      url: URL.createObjectURL(fileData),
    });
  };

  restoreAccounts = async (payload, sendResponse) => {
    try {
      this.wallet = await Wallet.restore(payload.json, payload.password);
      await this.saveWallet(payload.password);

      await this.loadWallet(sendResponse);
    } catch (e) {
      sendResponse({ error: e.message });
    }
  };

  getAccounts = (sendResponse) => {
    sendResponse(this.wallet?.getAccounts());
  };

  substrateSignPayload = async (payload, sendResponse) => {
    if (this.isWalletLocked(sendResponse)) {
      return;
    }
    sendResponse(await this.wallet.substrateVault.signPayload(payload));
  };

  signEthereumMessage = async (payload, sendResponse) => {
    if (this.isWalletLocked(sendResponse)) {
      return;
    }
    sendResponse(await this.wallet.ethereumVault.signMessage(payload));
  };

  signEthereumTransaction = async (payload, sendResponse) => {
    if (this.isWalletLocked(sendResponse)) {
      return;
    }
    sendResponse(await this.wallet.ethereumVault.signTransaction(payload));
  };

  signTolarTransaction = async (payload, sendResponse) => {
    if (this.isWalletLocked(sendResponse)) {
      return;
    }
    sendResponse(await this.wallet.ethereumVault.signTolarTransaction(payload));
  };

  signSolanaTransaction = async (payload, sendResponse) => {
    if (this.isWalletLocked(sendResponse)) {
      return;
    }
    sendResponse(await this.wallet.solanaValut.signTransaction(payload));
  };

  signTronTransaction = async (payload, sendResponse) => {
    if (this.isWalletLocked(sendResponse)) {
      return;
    }
    sendResponse(await this.wallet.tronValut.signTransaction(payload));
  };

  requestFileDownload = async (payload, sendResponse) => {
    if (this.isWalletLocked(sendResponse)) {
      return;
    }

    try {
      const res = await this.wallet.rsaVault.downloadFile(payload);
      sendResponse(res);
    } catch (e) {
      sendResponse({ isError: true, message: e.message });
    }
  };

  decryptFileData = async (payload, sendResponse) => {
    if (this.isWalletLocked(sendResponse)) {
      return;
    }

    try {
      const res = await this.wallet.rsaVault.decryptFileData(payload);
      sendResponse(res);
    } catch (e) {
      sendResponse({ isError: true, message: e.message });
    }
  };

  decryptAsymmetricData = async (payload, sendResponse) => {
    if (this.isWalletLocked(sendResponse)) {
      return;
    }

    try {
      const res = await this.wallet.rsaVault.decryptAsymmetricData(payload);
      sendResponse(res);
    } catch (e) {
      sendResponse({ isError: true, message: e.message });
    }
  };

  decryptMessage = async (payload, sendResponse) => {
    if (this.isWalletLocked(sendResponse)) {
      return;
    }

    try {
      const res = await this.wallet.rsaVault.decryptMessage(payload);
      sendResponse(res);
    } catch (e) {
      sendResponse({ isError: true, message: e.message });
    }
  };

  isWalletLocked(sendResponse) {
    if (!this.wallet) {
      sendResponse({ isError: true, message: 'FOURwal is locked' });
      return true;
    }
    return false;
  }
}

/* eslint-disable no-new */
new Background();
