const getters = {
  isWalletExists: (state) => !!state.wallet,
  isUnlocked: (state) => state.wallet.accounts.length,
};

export default getters;
