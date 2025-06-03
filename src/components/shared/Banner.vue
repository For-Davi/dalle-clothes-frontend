<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'Banner',
});

const props = withDefaults(
  defineProps<{
    text: string;
    type?: 'danger' | 'success';
  }>(),
  {
    type: 'danger',
  },
);

const styleType = computed(() => {
  if (props.type === 'danger') return 'bg-red';
  return 'bg-green';
});
</script>

<template>
  <q-banner dense inline-actions class="text-white" :class="styleType" rounded>
    {{ props.text }}
  </q-banner>
</template>
