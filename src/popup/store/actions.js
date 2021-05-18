import Actions from '@/popup/constants/actions';
import Mutations from '@/popup/constants/mutations';
import InternalMessage from '@/models/InternalMessage';
import { InternalMessageTypes } from '@/popup/constants/messages';

const actions = {
  [Actions.CREATE_WALLET]: async ({ dispatch }, password) => {
    const wallet = await InternalMessage.payload(
      InternalMessageTypes.CREATE_WALLET,
      password,
    ).send();

    dispatch(Actions.SET_WALLET, wallet);
  },

  [Actions.LOAD_WALLET]: async ({ dispatch }) => {
    const wallet = await InternalMessage.payload(InternalMessageTypes.LOAD_WALLET).send();
    dispatch(Actions.SET_WALLET, wallet);
  },

  [Actions.SET_WALLET]: async ({ commit }, wallet) => {
    commit(Mutations.SET_WALLET, wallet);
  },

  [Actions.LOCK_WALLET]: async ({ dispatch }) => {
    const wallet = await InternalMessage.payload(InternalMessageTypes.LOCK_WALLET).send();
    dispatch(Actions.SET_WALLET, wallet);
  },

  [Actions.UNLOCK_WALLET]: async ({ dispatch }, password) => {
    const res = await InternalMessage.payload(InternalMessageTypes.UNLOCK_WALLET, password).send();

    if (res.error) {
      throw new Error(res.error);
    } else {
      dispatch(Actions.SET_WALLET, res);
    }
  },

  [Actions.EXPORT_BACKUP]: async () => {
    InternalMessage.payload(InternalMessageTypes.EXPORT_BACKUP).send();
  },

  [Actions.RESTORE_ACCOUNTS]: async ({ dispatch }, { json, password }) => {
    const res = await InternalMessage.payload(InternalMessageTypes.RESTORE_ACCOUNTS, {
      json,
      password,
    }).send();

    if (res.error) {
      throw new Error(res.error);
    } else {
      dispatch(Actions.LOAD_WALLET);
    }
  },
};

export default actions;
