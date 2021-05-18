<template>
  <router-link :to="{ name: settings }">
    <button
      class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <icon class="h-6 w-6" name="cog" />
    </button>
  </router-link>
</template>
<script>
import Icon from '@/components/Icon.vue';
import RouteNames from '@/popup/router/routes';

export default {
  components: { Icon },
  data() {
    return {
      settings: RouteNames.SETTINGS,
    };
  },
};
</script>
