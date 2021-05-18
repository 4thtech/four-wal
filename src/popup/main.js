import Vue from 'vue';
import router from '@/popup/router';
import store from '@/popup/store';
import RouteNames from '@/popup/router/routes';
import Actions from '@/popup/constants/actions';
import App from './App.vue';
import '@/assets/tailwind.css';

store.dispatch(Actions.LOAD_WALLET).then(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    store,
    router,
    render: (h) => h(App),
  });

  if (store.getters.isWalletExists && store.getters.isUnlocked) {
    router.push({ name: RouteNames.HOME });
  } else if (store.getters.isWalletExists) {
    router.push({ name: RouteNames.UNLOCK });
  }
});
