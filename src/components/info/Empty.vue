<script setup lang="ts">
defineOptions({
  name: 'Empty',
});

const props = defineProps<{
  message: string;
  color: string;
}>();
</script>

<template>
  <main class="column justify-center items-center q-my-sm">
    <p class="text-h6 text-white q-px-sm rounded-borders" :class="color">
      {{ props.message }}
    </p>
    <q-img src="/icons/empty.png" width="150px" />
  </main>
</template>
