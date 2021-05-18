import { NetworkMessageTypes } from '@/popup/constants/messages';
import NetworkMessageService from '@/models/NetworkMessageService';
import SubstrateSigner from '@/models/SubstrateSigner';

let stream = null;
let opts = null;

export default class InpageProvider {
  constructor(_stream, _opts) {
    stream = _stream;
    opts = _opts;

    if (stream) {
      NetworkMessageService.subscribe(stream);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  isConnected() {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  getAccounts() {
    return opts.accounts;
  }

  // eslint-disable-next-line class-methods-use-this
  getSubstrateSigner() {
    return new SubstrateSigner(stream);
  }

  // eslint-disable-next-line class-methods-use-this
  signEthereumMessage(message) {
    return new Promise((resolve, reject) => {
      NetworkMessageService.send(stream, NetworkMessageTypes.SIGN_ETHEREUM_MESSAGE, message)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => reject(new Error(e.message)));
    });
  }

  // eslint-disable-next-line class-methods-use-this
  signEthereumTransaction(transaction) {
    return new Promise((resolve, reject) => {
      NetworkMessageService.send(stream, NetworkMessageTypes.SIGN_ETHEREUM_TRANSACTION, transaction)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => reject(new Error(e.message)));
    });
  }

  // eslint-disable-next-line class-methods-use-this
  downloadFile(url) {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('File URL is required.'));
      }

      NetworkMessageService.send(stream, NetworkMessageTypes.REQUEST_FILE_DOWNLOAD, url)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => reject(new Error(e.message)));
    });
  }
}
