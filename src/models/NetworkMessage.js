import { NetworkMessageTypes } from '@/popup/constants/messages';

export default class NetworkMessage {
  constructor(type = '', payload = '', resolver = '') {
    this.type = type;
    this.payload = payload;
    this.resolver = resolver;
  }

  static payload(type, payload) {
    return new NetworkMessage(type, payload);
  }

  respond(payload) {
    return new NetworkMessage(this.type, payload, this.resolver);
  }

  error(payload) {
    return new NetworkMessage(NetworkMessageTypes.ERROR, payload, this.resolver);
  }
}
