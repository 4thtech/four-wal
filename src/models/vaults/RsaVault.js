import NodeRSA from 'node-rsa';
import axios from 'axios';

const crypto = require('crypto');

export default class RsaVault {
  constructor() {
    this.privateKey = null;
  }

  create() {
    const key = new NodeRSA({ b: 2048 });
    this.privateKey = key.exportKey('private');
  }

  restore(string, password) {
    const data = JSON.parse(string);

    this.privateKey = data.privateKey;
    this.isPublicKeySavedOnPlatform = data.isPublicKeySavedOnPlatform;

    // TODO: decrypt data with password
    console.log(password);
  }

  getPublicKey() {
    const key = new NodeRSA(this.privateKey);
    return key.exportKey('public');
  }

  getBackupData(password) {
    const data = JSON.stringify({
      privateKey: this.privateKey,
    });

    // TODO: encrypt data with password
    console.log(password);

    return data;
  }

  async sendPublicKeyToPlatform(accounts, signedMessage) {
    const url = `${process.env.VUE_APP_PLATFORM_URL}/extension/wallet`;
    await axios.post(url, {
      accounts,
      signedMessage,
      rsaPublicKey: this.getPublicKey(),
    });
  }

  downloadFile(url) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'blob';
      request.onload = () => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(request.response);
        reader.onload = () => {
          try {
            const key = new NodeRSA(this.privateKey);
            const fileData = Buffer.from(reader.result, 'base64').toString().split(':');

            // Split asymmetric & symmetric part
            const asymmetric = fileData[0];
            const symmetric = fileData[1];

            // Decrypt asymmetric part
            const decrypted = key.decrypt(asymmetric, 'base64');
            const symPrefix = Buffer.from(decrypted, 'base64').toString().split(':');

            // Get key & iv for symmetric decryption
            const symKey = Buffer.from(symPrefix[0], 'base64');
            const iv = Buffer.from(symPrefix[1], 'base64');

            // Decrypt symmetric encrypted data
            const encryptedFileData = Buffer.from(symmetric, 'base64');
            const decipher = crypto.createDecipheriv('aes-256-cbc', symKey, iv);
            const decryptedFileData = Buffer.concat([
              decipher.update(encryptedFileData),
              decipher.final(),
            ]);

            // Download decrypted file
            const decryptedFile = new Blob([Buffer.from(decryptedFileData)], {
              type: request.response.type,
            });

            chrome.downloads.download({
              url: URL.createObjectURL(decryptedFile),
            });

            resolve({ isSuccess: true, message: 'File is downloaded.' });
          } catch (e) {
            reject(e);
          }
        };
      };
      request.send();
    });
  }
}
