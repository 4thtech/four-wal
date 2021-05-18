<template>
  <panel title="Welcome">
    <!-- Content -->
    <div class="text-base text-gray-600">
      <p>Before we start, just a couple of notes regarding use:</p>

      <div class="my-4 bg-blue-100 text-blue-900 py-4 pr-6 pl-8 rounded">
        <ul class="list-disc">
          <li>We do not use any trackers or analytics</li>
          <li class="mt-2">We don't collect your private keys</li>
          <li class="mt-2">
            We only collect your RSA public key and addresses which are needed for successful
            document encryption
          </li>
        </ul>
      </div>
    </div>

    <hello-graphic class="mt-6 h-52 w-full" />
    <!-- /End content -->

    <template #footer>
      <router-link :to="{ name: settingUpAccounts }">
        <primary-button>Understood, let me continue</primary-button>
      </router-link>
    </template>
  </panel>
</template>

<script>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import Panel from '@/components/Panel.vue';
import HelloGraphic from '@/components/graphics/HelloGraphic.vue';
import RouteNames from '@/popup/router/routes';

export default {
  name: 'Welcome',
  components: {
    HelloGraphic,
    Panel,
    PrimaryButton,
  },
  data() {
    return {
      settingUpAccounts: RouteNames.SETTING_UP_ACCOUNTS,
    };
  },
};
</script>
