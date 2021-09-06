<template>
  <span
    class="inline-flex items-center justify-center h-12 w-12 rounded-full"
    :style="'background-color:' + getBackgroundColor()"
  >
    <span class="text-lg font-medium leading-none text-white">
      <icon :name="type" class="h-8 w-8" />
    </span>
  </span>
</template>

<script>
import Icon from '@/components/Icon.vue';

export default {
  components: {
    Icon,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  methods: {
    getBackgroundColor() {
      const colors = {
        ETH: '#627eea',
        DOT: '#e6007a',
        TOL: '#13ceef',
        SOL: '#14F195FF',
      };

      return colors[this.type];
    },
  },
};
</script>
