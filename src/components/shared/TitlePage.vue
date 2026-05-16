<script setup lang="ts">
import { useSettingsStore } from 'src/stores/setting-store';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useQuasar } from 'quasar';

defineOptions({
  name: 'TitlePage',
});

const props = withDefaults(
  defineProps<{
    title: string;
    titleSize?: string;
    icon: string;
  }>(),
  {
    titleSize: 'text-h5',
  },
);

const $q = useQuasar();

const { appearanceSetting } = storeToRefs(useSettingsStore());

const getTitleColor = computed(() => {
  return appearanceSetting.value.title_page_color_default === 0 &&
    appearanceSetting.value.title_page_color_code
    ? appearanceSetting.value.title_page_color_code
    : '#0D47A1';
});

const responsiveTitleSize = computed(() => {
  if (props.titleSize !== 'text-h5') return props.titleSize;
  return $q.screen.lt.sm ? 'text-h6' : 'text-h5';
});
</script>

<template>
  <q-toolbar>
    <q-toolbar-title class="row items-center q-gutter-x-sm">
      <q-icon :name="props.icon" :style="getTitleColor ? { color: getTitleColor } : '#0D47A1'" />
      <span
        :style="getTitleColor ? { color: getTitleColor } : '#0D47A1'"
        :class="`text-weight-medium ${responsiveTitleSize}`"
        >{{ props.title }}</span
      >
    </q-toolbar-title>
  </q-toolbar>
</template>
