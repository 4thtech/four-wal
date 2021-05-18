<template>
  <panel title="Restore Accounts">
    <!-- Content -->
    <div class="text-base text-gray-600">
      <p class="mb-4 bg-blue-100 text-blue-900 py-4 px-6 rounded">
        Please select the backup file and type in a password to decrypt the backup file.
      </p>

      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">File</label>
          <div class="mt-1">
            <input
              type="file"
              class="block w-full shadow-sm px-2 py-1 border border-gray-300 rounded-md"
              @change="processFile($event)"
            />
          </div>
        </div>

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
        @click.native="restore"
        >Restore
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
  name: 'RestoreAccounts',
  components: {
    Error,
    DefaultButton,
    LoadingButton,
    Panel,
  },
  data() {
    return {
      settingUpAccounts: RouteNames.SETTING_UP_ACCOUNTS,
      processing: false,
      fileData: null,
      password: '',
      error: '',
    };
  },
  methods: {
    processFile(event) {
      const self = this;
      const reader = new FileReader();
      reader.readAsText(event.target.files[0]);
      reader.onload = (e) => {
        self.fileData = JSON.parse(e.target.result);
      };
    },
    restore() {
      this.processing = true;

      if (!this.validate()) {
        this.processing = false;
        return;
      }

      this[Actions.RESTORE_ACCOUNTS]({
        json: this.fileData,
        password: this.password,
      })
        .then(() => {
          this.$router.push({ name: RouteNames.HOME });
        })
        .catch((e) => {
          this.error = e.message;
          this.processing = false;
        });
    },
    validate() {
      // File must exist
      if (!this.fileData) {
        this.error = 'File is not selected.';
        return false;
      }

      return true;
    },
    ...mapActions([Actions.RESTORE_ACCOUNTS]),
  },
};
</script>
