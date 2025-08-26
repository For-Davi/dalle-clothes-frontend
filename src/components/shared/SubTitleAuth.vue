<script setup lang="ts">
defineOptions({
  name: 'SubTitleAuth',
});

const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="row justify-between items-center">
    <div style="height: 2px; width: 30%;" class="bg-primary"></div>
    <span class="text-h6 block text-grey-9 text-bold text-center">{{ props.title }}</span>
    <div style="height: 2px; width: 30%;" class="bg-primary"></div>
  </div>
</template>
