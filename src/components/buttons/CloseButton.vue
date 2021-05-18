<template>
  <button
    class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <icon class="h-6 w-6" name="x" />
  </button>
</template>
<script>
import Icon from '@/components/Icon.vue';

export default {
  components: { Icon },
};
</script>
