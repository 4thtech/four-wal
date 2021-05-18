<template>
  <panel title="Setting Up Accounts">
    <!-- Content -->
    <div class="text-base text-gray-600">
      <p>Before first use, we need to set up your accounts.</p>

      <p class="my-4 bg-blue-100 text-blue-900 py-4 px-6 rounded">
        You are able to create completely new accounts or you can restore them from backup JSON
        file.
      </p>
    </div>

    <security-graphic class="mt-6 h-52 w-full" />

    <div class="mt-10 text-base font-medium text-center">
      <router-link
        :to="{ name: restoreAccounts }"
        class="underline text-blue-600 hover:text-blue-500"
        >I want to restore my accounts
      </router-link>
    </div>
    <!-- /End content -->

    <template #footer>
      <router-link :to="{ name: createAccounts }">
        <primary-button>Create new accounts</primary-button>
      </router-link>
    </template>
  </panel>
</template>

<script>
import Panel from '@/components/Panel.vue';
import SecurityGraphic from '@/components/graphics/SecurityGraphic.vue';
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import RouteNames from '@/popup/router/routes';

export default {
  name: 'SettingUpAccounts',
  components: {
    PrimaryButton,
    SecurityGraphic,
    Panel,
  },
  data() {
    return {
      createAccounts: RouteNames.CREATE_ACCOUNTS,
      restoreAccounts: RouteNames.RESTORE_ACCOUNTS,
    };
  },
};
</script>
