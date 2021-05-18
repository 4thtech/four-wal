import { Keyring } from '@polkadot/keyring';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import { TypeRegistry } from '@polkadot/types';

export default class SubstrateVault {
  constructor() {
    this.keyring = new Keyring({ type: 'sr25519' });
  }

  async create() {
    this.keyring.addFromUri(mnemonicGenerate());
  }

  restore(encryptedString, password) {
    const pairs = JSON.parse(encryptedString);
    pairs.forEach((pairJson) => {
      const pair = this.keyring.addFromJson(pairJson);
      pair.unlock(password);
    });
  }

  getAccounts() {
    return this.keyring.getPairs();
  }

  getDefaultAccount() {
    const accounts = this.getAccounts();
    return accounts.length ? accounts[0].address : null;
  }

  getBackupData(password) {
    const data = [];
    this.getAccounts().forEach((pair) => {
      data.push(pair.toJson(password));
    });

    return JSON.stringify(data);
  }

  async signPayload(payload) {
    try {
      const { address } = payload;
      const pair = this.keyring.getPair(address);
      const registry = new TypeRegistry();

      // inject the current signed extensions for encoding
      registry.setSignedExtensions(payload.signedExtensions);

      return registry
        .createType('ExtrinsicPayload', payload, { version: payload.version })
        .sign(pair);
    } catch (e) {
      return new Error(e.message);
    }
  }
}
