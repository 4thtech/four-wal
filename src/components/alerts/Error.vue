<template>
  <div class="rounded-md bg-red-50 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <icon name="x-circle" class="h-5 w-5 text-red-400" />
      </div>
      <div class="ml-3">
        <div class="text-sm font-medium text-red-700">{{ text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue';

export default {
  name: 'Error',
  components: {
    Icon,
  },
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>
