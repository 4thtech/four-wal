import Mutations from '@/popup/constants/mutations';

const mutations = {
  [Mutations.SET_WALLET]: (state, wallet) => {
    state.wallet = wallet;
  },
};

export default mutations;
