<template>
  <panel title="Create Accounts">
    <!-- Content -->
    <div class="text-base text-gray-600">
      <p class="mb-4 bg-blue-100 text-blue-900 py-4 px-6 rounded">
        Please set up a password for your accounts.
      </p>

      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <div class="mt-1">
            <input
              type="password"
              class="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
              v-model="password"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Repeat Password</label>
          <div class="mt-1">
            <input
              type="password"
              class="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
              v-model="repeatPassword"
              @keypress.enter="create"
            />
          </div>
        </div>
      </div>
    </div>

    <error v-if="error" :text="error" class="mt-5" />
    <!-- /End content -->

    <template #footer>
      <router-link :to="{ name: settingUpAccounts }">
        <default-button>Back</default-button>
      </router-link>
      <loading-button
        class="ml-2 bg-blue-500 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        :loading="processing"
        @click.native="create"
        >Create
      </loading-button>
    </template>
  </panel>
</template>

<script>
import { mapActions } from 'vuex';
import Panel from '@/components/Panel.vue';
import DefaultButton from '@/components/buttons/DefaultButton.vue';
import LoadingButton from '@/components/buttons/LoadingButton.vue';
import Error from '@/components/alerts/Error.vue';
import RouteNames from '@/popup/router/routes';
import Actions from '@/popup/constants/actions';

export default {
  name: 'CreateAccounts',
  components: {
    Error,
    LoadingButton,
    DefaultButton,
    Panel,
  },
  data() {
    return {
      settingUpAccounts: RouteNames.SETTING_UP_ACCOUNTS,
      processing: false,
      password: '',
      repeatPassword: '',
      error: '',
    };
  },
  methods: {
    create() {
      this.processing = true;

      if (!this.validate()) {
        this.processing = false;
        return;
      }

      // Create new wallet
      this[Actions.CREATE_WALLET](this.password).then(() => {
        this.$router.push({ name: RouteNames.HOME });
      });
    },
    validate() {
      // Password should be at least 8 characters long
      if (this.password.length < 8) {
        this.error = 'Passwords must be at least 8 characters long.';
        return false;
      }

      // Password and confirmation should be the same
      if (this.password !== this.repeatPassword) {
        this.error = 'Your password and confirmation password do not match.';
        return false;
      }

      return true;
    },
    ...mapActions([Actions.CREATE_WALLET]),
  },
};
</script>
