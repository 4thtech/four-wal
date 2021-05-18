export default class StorageService {
  static saveWallet(wallet) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ wallet }, () => {
        resolve(wallet);
      });
    });
  }

  static getWallet() {
    return new Promise((resolve) => {
      chrome.storage.local.get('wallet', (obj) => {
        resolve(obj.wallet);
      });
    });
  }

  static saveIsPublicKeySavedOnPlatform(isPublicKeySavedOnPlatform) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ isPublicKeySavedOnPlatform }, () => {
        resolve(isPublicKeySavedOnPlatform);
      });
    });
  }

  static getIsPublicKeySavedOnPlatform() {
    return new Promise((resolve) => {
      chrome.storage.local.get('isPublicKeySavedOnPlatform', (obj) => {
        resolve(obj.isPublicKeySavedOnPlatform);
      });
    });
  }
}
