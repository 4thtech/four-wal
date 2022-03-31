<template>
  <panel title="Settings">
    <!-- Content -->
    <div class="space-y-6">
      <div>
        <label for="project_name" class="block text-sm font-medium text-gray-700"> Backup </label>
        <div class="mt-1">
          <default-button @click.native="exportBackupFile">Export backup JSON file</default-button>
        </div>
        <div class="mt-1">
          <default-button @click.native="exportEthereumBackup"
            >Export Ethereum private key
          </default-button>
        </div>
        <div class="mt-1">
          <default-button @click.native="exportSolanaBackup"
            >Export Solana private key
          </default-button>
        </div>
      </div>

      <div>
        <label for="project_name" class="block text-sm font-medium text-gray-700"> Logout </label>
        <div class="mt-1">
          <default-button @click.native="logout">Logout</default-button>
        </div>
      </div>
    </div>
    <!-- /End content -->

    <template #right-menu>
      <router-link :to="{ name: home }">
        <close-button />
      </router-link>
    </template>
  </panel>
</template>
<script>
import { mapActions } from 'vuex';
import Panel from '@/components/Panel.vue';
import CloseButton from '@/components/buttons/CloseButton.vue';
import DefaultButton from '@/components/buttons/DefaultButton.vue';
import RouteNames from '@/popup/router/routes';
import Actions from '@/popup/constants/actions';

export default {
  components: {
    DefaultButton,
    CloseButton,
    Panel,
  },
  data() {
    return {
      home: RouteNames.HOME,
    };
  },
  methods: {
    exportBackupFile() {
      this[Actions.EXPORT_BACKUP]();
    },
    exportEthereumBackup() {
      this[Actions.EXPORT_ETHEREUM_BACKUP]();
    },
    exportSolanaBackup() {
      this[Actions.EXPORT_SOLANA_BACKUP]();
    },
    logout() {
      this[Actions.LOCK_WALLET]().then(() => {
        this.$router.push({ name: RouteNames.UNLOCK });
      });
    },
    ...mapActions([
      Actions.LOCK_WALLET,
      Actions.EXPORT_BACKUP,
      Actions.EXPORT_ETHEREUM_BACKUP,
      Actions.EXPORT_SOLANA_BACKUP,
    ]),
  },
};
</script>
