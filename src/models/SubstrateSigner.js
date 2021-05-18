import NetworkMessageService from '@/models/NetworkMessageService';
import { NetworkMessageTypes } from '@/popup/constants/messages';

const nextId = 0;
let stream = null;

export default class SubstrateSigner {
  constructor(_stream) {
    stream = _stream;
  }

  // eslint-disable-next-line class-methods-use-this
  async signPayload(payload) {
    const id = nextId + 1;

    const signed = await NetworkMessageService.send(
      stream,
      NetworkMessageTypes.SUBSTRATE_SIGN_PAYLOAD,
      payload,
    );

    return {
      ...signed,
      id,
    };
  }
}
