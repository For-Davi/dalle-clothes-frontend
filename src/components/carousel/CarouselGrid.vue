<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useGridStore } from 'src/stores/grid-store';

defineOptions({
  name: 'CarouselGrid',
});

const emit = defineEmits<{
  'show:showFormGrid': [IGrid];
}>();

const { loadingGrid, listGrid } = storeToRefs(useGridStore());

const slide = ref<number>(0);
const showFormGrid = reactive<{
  open: boolean;
  grid: IGrid | null;
}>({
  open: false,
  grid: null,
});

const startEdit = (data: IGrid) => {
  changeShowFormGrid(true, data);
};
const changeShowFormGrid = (show: boolean, grid: IGrid | null = null): void => {
  Object.assign(showFormGrid, {
    open: show,
    grid: grid,
  });
};
</script>
<template>
  <main class="q-gutter-md">
    <q-carousel
      v-model="slide"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      control-color="white"
      navigation
      padding
      arrows
      height="300px"
      class="bg-primary text-white shadow-1 rounded-borders"
    >
      <q-carousel-slide
        v-for="(item, index) in listGrid"
        :name="index"
        class="column no-wrap flex-center"
      >
        <q-icon name="style" size="56px" />
        <div class="q-mt-md text-center">
          {{ item.name }}
        </div>
      </q-carousel-slide>
    </q-carousel>
  </main>
</template>
