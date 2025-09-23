<script setup lang="ts">
defineOptions({
  name: 'Empty',
});

const props = withDefaults(
  defineProps<{
    message: string;
    color: string;
    typeImg?: 'box' | 'file' | 'list';
  }>(),
  {
    typeImg: 'box',
  },
);

const getUrlImg = (): string => {
  switch (props.typeImg) {
    case 'box':
      return '/icons/empty.png';
    case 'file':
      return '/icons/file-empty.png';
    case 'list':
      return '/icons/list-empty.png';
    default:
      return '';
  }
};
</script>

<template>
  <main class="column justify-center items-center q-my-sm">
    <p class="text-h6 text-white q-px-sm rounded-borders" :class="color">
      {{ props.message }}
    </p>
    <q-img :src="getUrlImg()" width="150px" />
  </main>
</template>
