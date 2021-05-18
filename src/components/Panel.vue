<template>
  <div class="flex h-full w-full">
    <div class="h-full w-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl">
      <div class="min-h-0 flex-1 flex flex-col py-6 overflow-y-scroll">
        <div class="px-4">
          <div class="flex items-start justify-between">
            <div class="flex items-center">
              <logo-icon class="h-8 w-auto text-blue-600" />
              <h2 class="ml-2 text-lg font-medium text-gray-900">
                {{ title }}
              </h2>
            </div>
            <div class="ml-3 h-7 flex items-center">
              <slot name="right-menu" />
            </div>
          </div>
        </div>
        <div class="mt-6 relative flex-1 px-4 sm:px-6">
          <!-- Content -->
          <slot />
          <!-- /End content -->
        </div>
      </div>
      <div v-if="hasFooterSlot()" class="flex-shrink-0 px-4 py-4 flex justify-end">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
import LogoIcon from '@/components/LogoIcon.vue';

export default {
  name: 'Panel',
  components: {
    LogoIcon,
  },
  props: {
    title: String,
  },
  methods: {
    hasFooterSlot() {
      return !!this.$slots.footer;
    },
  },
};
</script>
