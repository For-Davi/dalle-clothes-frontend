<script setup lang="ts">
defineOptions({
  name: 'SubTitleAuth',
});

const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <span class="text-h6 block text-accent text-bold text-center">{{ props.title }}</span>
</template>
