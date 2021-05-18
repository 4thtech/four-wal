<template>
  <div class="flex items-center py-4">
    <div class="min-w-0 flex-1 flex items-center">
      <div class="flex-shrink-0">
        <crypto-badge :type="type" />
      </div>
      <div class="min-w-0 flex-1 px-4">
        <div>
          <p class="text-sm font-medium text-gray-900 truncate">{{ name }}</p>
          <p class="mt-2 flex items-center text-sm text-gray-500">
            <span class="text-xs truncate">{{ address }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoBadge from '@/components/CryptoBadge.vue';

export default {
  name: 'AccountItem',
  components: {
    CryptoBadge,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
};
</script>
