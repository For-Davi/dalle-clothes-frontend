<script setup lang="ts">
defineOptions({
  name: 'TitlePage',
});

const props = defineProps<{
  title: string;
  icon: string;
}>();
</script>

<template>
  <q-toolbar>
    <q-toolbar-title class="row items-center q-gutter-x-sm">
      <q-icon :name="props.icon" color="deep-orange-10"/>
      <span class="text-deep-orange-10 text-weight-medium text-h5 ">{{ props.title }}</span>
    </q-toolbar-title>
  </q-toolbar>
</template>
