import { stringToHex } from '@polkadot/util';
import { keccakAsHex } from '@polkadot/util-crypto';

function ethAddressToTolarAddress(ethAddress) {
  const prefix = 'T';
  const prefixHex = stringToHex(prefix).substr(2);

  const addressHash = keccakAsHex(ethAddress);
  const hashOfHash = keccakAsHex(addressHash);
  const tolarAddress = prefixHex + ethAddress.substr(2) + hashOfHash.substr(hashOfHash.length - 8);

  return tolarAddress.toLowerCase();
}

export default ethAddressToTolarAddress;
