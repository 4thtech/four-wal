import Vue from 'vue';
import VueRouter from 'vue-router';
import RouteNames from '@/popup/router/routes';
import Welcome from '../views/Welcome.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: RouteNames.WELCOME,
    component: Welcome,
  },
  {
    path: '/home',
    name: RouteNames.HOME,
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/setting-up-accounts',
    name: RouteNames.SETTING_UP_ACCOUNTS,
    component: () => import('../views/SettingUpAccounts.vue'),
  },
  {
    path: '/create-accounts',
    name: RouteNames.CREATE_ACCOUNTS,
    component: () => import('../views/CreateAccounts.vue'),
  },
  {
    path: '/restore-accounts',
    name: RouteNames.RESTORE_ACCOUNTS,
    component: () => import('../views/RestoreAccounts.vue'),
  },
  {
    path: '/unlock',
    name: RouteNames.UNLOCK,
    component: () => import('../views/Unlock.vue'),
  },
  {
    path: '/settings',
    name: RouteNames.SETTINGS,
    component: () => import('../views/Settings.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
