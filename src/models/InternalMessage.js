import { LocalStream } from 'extension-streams';

export default class InternalMessage {
  constructor() {
    this.type = null;
    this.payload = null;
  }

  static payload(type, payload) {
    const o = new InternalMessage();
    o.type = type;
    o.payload = payload;

    return o;
  }

  send() {
    return LocalStream.send(this);
  }
}
