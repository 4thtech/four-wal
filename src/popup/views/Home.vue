<template>
  <panel title="Accounts">
    <!-- Content -->
    <ul class="divide-y divide-gray-200">
      <li v-for="account in wallet.accounts" :key="account.address">
        <account-item :type="account.type" :name="account.name" :address="account.address" />
      </li>
    </ul>
    <!-- /End content -->

    <template #right-menu>
      <settings-button />
    </template>
  </panel>
</template>

<script>
import { mapState } from 'vuex';
import Panel from '@/components/Panel.vue';
import AccountItem from '@/components/AccountItem.vue';
import SettingsButton from '@/components/buttons/SettingsButton.vue';

export default {
  name: 'Home',
  components: {
    SettingsButton,
    AccountItem,
    Panel,
  },
  computed: {
    ...mapState(['wallet']),
  },
};
</script>
