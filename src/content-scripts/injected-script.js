import { EncryptedStream } from 'extension-streams';
import { NetworkMessageTypes, PairingTags } from '@/popup/constants/messages';
import randomString from 'random-string';
import InpageProvider from '@/models/InpageProvider';

class Inject {
  constructor() {
    const stream = new EncryptedStream(PairingTags.INJECTED, randomString({ length: 64 }));

    stream.listenWith((msg) => {
      if (
        msg &&
        {}.hasOwnProperty.call(msg, 'type') &&
        msg.type === NetworkMessageTypes.PUSH_FOUR_WAL
      ) {
        // Inject to window
        window.fourWal = {
          name: 'four-wal',
          version: process.env.VUE_APP_VERSION,
          injector: new InpageProvider(stream, msg.payload),
        };
      }
    });

    stream.sync(PairingTags.FOUR_WAL, stream.key);
  }
}

// eslint-disable-next-line no-new
new Inject();
