<template>
  <panel title="Unlock Accounts">
    <!-- Content -->
    <div class="text-base text-gray-600">
      <p class="mb-4 bg-blue-100 text-blue-900 py-4 px-6 rounded">
        Enter the password for your accounts.
      </p>

      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <div class="mt-1">
            <input
              type="password"
              class="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
              v-model="password"
              @keypress.enter="unlock"
            />
          </div>
        </div>
      </div>
    </div>

    <error v-if="error" :text="error" class="mt-5" />
    <!-- /End content -->

    <template #footer>
      <loading-button
        class="ml-2 bg-blue-500 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        :loading="processing"
        @click.native="unlock"
        >Unlock
      </loading-button>
    </template>
  </panel>
</template>

<script>
import { mapActions } from 'vuex';
import Panel from '@/components/Panel.vue';
import RouteNames from '@/popup/router/routes';
import Actions from '@/popup/constants/actions';
import LoadingButton from '@/components/buttons/LoadingButton.vue';
import Error from '@/components/alerts/Error.vue';

export default {
  name: 'UnlockAccounts',
  components: {
    Error,
    LoadingButton,
    Panel,
  },
  data() {
    return {
      processing: false,
      password: '',
      error: '',
    };
  },
  methods: {
    unlock() {
      this.processing = true;

      this[Actions.UNLOCK_WALLET](this.password)
        .then(() => {
          this.$router.push({ name: RouteNames.HOME });
        })
        .catch((e) => {
          this.error = e.message;
          this.processing = false;
        });
    },
    ...mapActions([Actions.UNLOCK_WALLET]),
  },
};
</script>
