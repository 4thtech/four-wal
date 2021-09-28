export const InternalMessageTypes = {
  CREATE_WALLET: 'createWallet',
  LOAD_WALLET: 'loadWallet',
  LOCK_WALLET: 'lockWallet',
  UNLOCK_WALLET: 'unlockWallet',
  EXPORT_BACKUP: 'exportBackup',
  RESTORE_ACCOUNTS: 'restoreAccounts',
  GET_ACCOUNTS: 'getAccounts',
  SUBSTRATE_SIGN_PAYLOAD: 'substrateSignPayload',
  SIGN_ETHEREUM_MESSAGE: 'signEthereumMessage',
  SIGN_ETHEREUM_TRANSACTION: 'signEthereumTransaction',
  SIGN_SOLANA_TRANSACTION: 'signSolanaTransaction',
  REQUEST_FILE_DOWNLOAD: 'requestFileDownload',
  DECRYPT_FILE_DATA: 'decryptFileData',
};

export const NetworkMessageTypes = {
  PUSH_FOUR_WAL: 'pushFourWal',
  ERROR: 'error',
  SUBSTRATE_SIGN_PAYLOAD: 'substrateSignPayload',
  SIGN_ETHEREUM_MESSAGE: 'signEthereumMessage',
  SIGN_ETHEREUM_TRANSACTION: 'signEthereumTransaction',
  SIGN_SOLANA_TRANSACTION: 'signSolanaTransaction',
  REQUEST_FILE_DOWNLOAD: 'requestFileDownload',
  DECRYPT_FILE_DATA: 'decryptFileData',
};

export const PairingTags = {
  FOUR_WAL: 'fourWal',
  INJECTED: 'fourWalInjected',
};
