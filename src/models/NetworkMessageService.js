import randomString from 'random-string';
import NetworkMessage from '@/models/NetworkMessage';
import { PairingTags } from '@/popup/constants/messages';
import DanglingResolver from '@/models/DanglingResolver';

let resolvers = [];

export default class NetworkMessageService {
  /**
   * Method catches all incoming messages and dispenses them to open promises
   *
   * @param stream
   */
  static subscribe(stream) {
    // eslint-disable-next-line consistent-return
    stream.listenWith((msg) => {
      if (!msg || !{}.hasOwnProperty.call(msg, 'type')) {
        return false;
      }

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < resolvers.length; i++) {
        if (resolvers[i].id === msg.resolver) {
          if (msg.type === 'error') {
            resolvers[i].reject(msg.payload);
          } else {
            resolvers[i].resolve(msg.payload);
          }

          resolvers = resolvers.slice(i, 1);
        }
      }
    });
  }

  /**
   * Turns message sending between the website and the content script into async promises
   *
   * @param stream
   * @param type
   * @param payload
   * @returns {Promise<any>}
   */
  static send(stream, type, payload = {}) {
    return new Promise((resolve, reject) => {
      const id = randomString({ length: 24 });
      const message = new NetworkMessage(type, payload, id);
      resolvers.push(new DanglingResolver(id, resolve, reject));
      stream.send(message, PairingTags.FOUR_WAL);
    });
  }
}
