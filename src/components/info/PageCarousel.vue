<script setup lang="ts">
defineOptions({
  name: 'PageCarousel',
});

const props = defineProps<{
  actual: number;
  total: number;
}>();
</script>

<template>
  <q-banner dense inline-actions class="text-white bg-green-7 q-my-sm q-px-md" rounded>
    <span class="text-bold">{{ props.actual + 1 }}</span> de
    <span class="text-bold">{{ props.total }}</span>
  </q-banner>
</template>
