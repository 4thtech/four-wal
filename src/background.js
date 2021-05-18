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

      case InternalMessageTypes.REQUEST_FILE_DOWNLOAD:
        this.requestFileDownload(message.payload, sendResponse);
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

    chrome.downloads.download({
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
    if (!this.wallet) {
      sendResponse(new Error('FOURwal is locked.'));
      return;
    }
    sendResponse(await this.wallet.substrateVault.signPayload(payload));
  };

  signEthereumMessage = async (payload, sendResponse) => {
    if (!this.wallet) {
      sendResponse({ isError: true, message: 'FOURwal is locked' });
      return;
    }
    sendResponse(await this.wallet.ethereumVault.signMessage(payload));
  };

  signEthereumTransaction = async (payload, sendResponse) => {
    if (!this.wallet) {
      sendResponse({ isError: true, message: 'FOURwal is locked' });
      return;
    }
    sendResponse(await this.wallet.ethereumVault.signTransaction(payload));
  };

  requestFileDownload = async (payload, sendResponse) => {
    if (!this.wallet) {
      sendResponse({ isError: true, message: 'FOURwal is locked' });
      return;
    }

    try {
      const res = await this.wallet.rsaVault.downloadFile(payload);
      sendResponse(res);
    } catch (e) {
      sendResponse({ isError: true, message: e.message });
    }
  };
}

/* eslint-disable no-new */
new Background();
