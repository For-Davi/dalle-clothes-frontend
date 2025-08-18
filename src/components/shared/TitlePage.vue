<script setup lang="ts">
import { useSettingsStore } from 'src/stores/setting-store';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

defineOptions({
  name: 'TitlePage',
});

const props = defineProps<{
  title: string;
  icon: string;
}>();

const { appearanceSetting } = storeToRefs(useSettingsStore());

const getTitleColor = computed(() => {
  return appearanceSetting.value.title_page_color_default === 0 &&
    appearanceSetting.value.title_page_color_code
    ? appearanceSetting.value.title_page_color_code
    : '#0D47A1';
});
</script>

<template>
  <q-toolbar>
    <q-toolbar-title class="row items-center q-gutter-x-sm">
      <q-icon :name="props.icon" :style="getTitleColor ? { color: getTitleColor } : '#0D47A1'" />
      <span
        :style="getTitleColor ? { color: getTitleColor } : '#0D47A1'"
        class="text-weight-medium text-h5"
        >{{ props.title }}</span
      >
    </q-toolbar-title>
  </q-toolbar>
</template>
