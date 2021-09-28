import { EncryptedStream } from 'extension-streams';
import { InternalMessageTypes, NetworkMessageTypes, PairingTags } from '@/popup/constants/messages';
import randomString from 'random-string';
import NetworkMessage from '@/models/NetworkMessage';
import InternalMessage from '@/models/InternalMessage';

let stream = null;
let isReady = false;

class ContentScript {
  constructor() {
    ContentScript.injectScript();
    ContentScript.setupEncryptedStream();
  }

  static async injectScript() {
    const script = document.createElement('script');

    script.src = chrome.extension.getURL('js/injected.js');

    script.onload = () => {
      // remove the injecting tag when loaded
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    (document.head || document.documentElement).appendChild(script);
  }

  static setupEncryptedStream() {
    stream = new EncryptedStream(PairingTags.FOUR_WAL, randomString({ length: 256 }));
    stream.listenWith((msg) => ContentScript.contentListener(msg));

    stream.onSync(async () => {
      const accounts = await ContentScript.getAccounts();

      stream.send(
        NetworkMessage.payload(NetworkMessageTypes.PUSH_FOUR_WAL, { accounts }),
        PairingTags.INJECTED,
      );

      isReady = true;

      document.dispatchEvent(new CustomEvent('fourWalExtensionLoaded'));
    });
  }

  static contentListener(msg) {
    if (!isReady || !msg) {
      return;
    }

    if (!stream.synced && (!{}.hasOwnProperty.call(msg, 'type') || msg.type !== 'sync')) {
      return;
    }

    const nonSyncMessage = new NetworkMessage(msg.type, msg.payload, msg.resolver);
    switch (msg.type) {
      case 'sync':
        ContentScript.sync(msg);
        break;

      case NetworkMessageTypes.SUBSTRATE_SIGN_PAYLOAD:
        ContentScript.substrateSignPayload(nonSyncMessage);
        break;

      case NetworkMessageTypes.SIGN_ETHEREUM_MESSAGE:
        ContentScript.signEthereumMessage(nonSyncMessage);
        break;

      case NetworkMessageTypes.SIGN_ETHEREUM_TRANSACTION:
        ContentScript.signEthereumTransaction(nonSyncMessage);
        break;

      case NetworkMessageTypes.SIGN_SOLANA_TRANSACTION:
        ContentScript.signSolanaTransaction(nonSyncMessage);
        break;

      case NetworkMessageTypes.REQUEST_FILE_DOWNLOAD:
        ContentScript.requestFileDownload(nonSyncMessage);
        break;

      case NetworkMessageTypes.DECRYPT_FILE_DATA:
        ContentScript.decryptFileData(nonSyncMessage);
        break;

      default:
        break;
    }
  }

  static respond(message, payload) {
    if (!isReady) return;

    const response =
      !payload || {}.hasOwnProperty.call(payload, 'isError')
        ? message.error(payload)
        : message.respond(payload);

    stream.send(response, PairingTags.INJECTED);
  }

  static sync(message) {
    stream.key = message.handshake.length ? message.handshake : null;
    stream.send({ type: 'sync' }, PairingTags.INJECTED);
    stream.synced = true;
  }

  static getAccounts() {
    return InternalMessage.payload(InternalMessageTypes.GET_ACCOUNTS).send();
  }

  static substrateSignPayload(message) {
    InternalMessage.payload(InternalMessageTypes.SUBSTRATE_SIGN_PAYLOAD, message.payload)
      .send()
      .then((res) => {
        this.respond(message, res);
      });
  }

  static signEthereumMessage(message) {
    InternalMessage.payload(InternalMessageTypes.SIGN_ETHEREUM_MESSAGE, message.payload)
      .send()
      .then((res) => {
        this.respond(message, res);
      });
  }

  static signEthereumTransaction(message) {
    InternalMessage.payload(InternalMessageTypes.SIGN_ETHEREUM_TRANSACTION, message.payload)
      .send()
      .then((res) => {
        this.respond(message, res);
      });
  }

  static signSolanaTransaction(message) {
    InternalMessage.payload(InternalMessageTypes.SIGN_SOLANA_TRANSACTION, message.payload)
      .send()
      .then((res) => {
        this.respond(message, res);
      });
  }

  static requestFileDownload(message) {
    InternalMessage.payload(InternalMessageTypes.REQUEST_FILE_DOWNLOAD, message.payload)
      .send()
      .then((res) => {
        this.respond(message, res);
      });
  }

  static decryptFileData(message) {
    InternalMessage.payload(InternalMessageTypes.DECRYPT_FILE_DATA, message.payload)
      .send()
      .then((res) => {
        this.respond(message, res);
      });
  }
}

/* eslint-disable-next-line no-new */
new ContentScript();
