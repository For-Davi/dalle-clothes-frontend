<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useGridStore } from 'src/stores/grid-store';
import { columnsCarouselGrid } from 'src/utils/columns';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import PageCarousel from '../info/PageCarousel.vue';
import Empty from '../info/Empty.vue';

defineOptions({
  name: 'CarouselGrid',
});

const props = withDefaults(
  defineProps<{
    filter?: string;
  }>(),
  {
    filter: '',
  },
);
const emit = defineEmits<{
  'show:showFormGrid': [IGrid];
}>();

const { loadingGrid, listGrid } = storeToRefs(useGridStore());

const gridMonitoring = ref<number | null>(null);
const showConfirmAction = ref<boolean>(false);
const slide = ref<number>(0);

const clear = (): void => {
  gridMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useGridStore().deleteGrid(gridMonitoring.value ?? 0);
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  gridMonitoring.value = id;
  showConfirmAction.value = true;
};
const startExclude = (id: number) => {
  openConfirmAction(id);
};
const startEdit = (data: IGrid) => {
  emit('show:showFormGrid', data);
};
const resetSlide = (): void => {
  slide.value = 0;
};
const isActive = (active: number): boolean => {
  return active === 1;
};

const list = computed(() => {
  if (props.filter.length > 0) {
    resetSlide();
    return listGrid.value.filter((item) =>
      item.name.toLowerCase().includes(props.filter.toLowerCase()),
    );
  } else {
    return listGrid.value;
  }
});
</script>
<template>
  <main>
    <q-carousel
      v-if="list.length > 0"
      v-model="slide"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      control-color="green"
      control-type="unelevated"
      padding
      infinite
      arrows
      height="500px"
      class="bg-grey-2 rounded-borders"
    >
      <q-carousel-slide
        v-for="(grid, index) in list"
        :name="index"
        :key="index"
        class="column items-center"
      >
        <q-table
          :rows="grid.items"
          :loading="loadingGrid"
          :columns="columnsCarouselGrid"
          :title="grid.name"
          row-key="index"
          no-data-label="Nenhuma grade para mostrar"
          virtual-scroll
          :rows-per-page-options="[5]"
          class="full-width"
          style="min-height: 400px"
          flat
          bordered
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-h5">
                <span class="text-body2 text-bold">{{ col.label }}</span>
              </q-th>
            </q-tr>
          </template>
          <template v-slot:top>
            <div class="row justify-between items-center full-width">
              <span class="text-body1 q-mr-sm">{{ grid.name }}</span>
              <q-icon
                :name="isActive(grid.active) ? 'check_circle' : 'close'"
                :color="isActive(grid.active) ? 'green' : 'red'"
                size="17px"
              >
                <q-tooltip
                  class="bg-grey-2 text-bold"
                  :class="isActive(grid.active) ? 'text-green' : 'text-red'"
                  >{{ isActive(grid.active) ? 'Grade ativa' : 'Grade inativa' }}</q-tooltip
                >
              </q-icon>
              <q-space />
              <div class="q-gutter-x-sm">
                <q-btn
                  v-if="hasPermission('grid.update')"
                  @click="startEdit(grid)"
                  size="sm"
                  round
                  color="black"
                  icon="edit"
                  unelevated
                />
                <q-btn
                  v-if="hasPermission('grid.delete')"
                  @click="startExclude(grid.id)"
                  size="sm"
                  round
                  color="red"
                  icon="delete"
                  unelevated
                />
              </div>
            </div>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="order" :props="props" class="text-left">
                {{ props.row.order }}
              </q-td>
              <q-td key="size" :props="props" class="text-left">
                {{ props.row.size }}
              </q-td>
              <q-td key="active" :props="props" class="text-left">
                <q-icon
                  :name="isActive(grid.active) ? 'check_circle' : 'close'"
                  :color="isActive(grid.active) ? 'green' : 'red'"
                  size="17px"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <PageCarousel :actual="slide" :total="list.length" />

        <Empty
          v-if="list.length === 0"
          message="Sem grades de tamanhos cadastradas"
          color="bg-red-3"
        />
      </q-carousel-slide>
    </q-carousel>
    <Empty v-else message="Sem resultados" color="bg-red-3" />
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão de grade"
      message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá a grade permanentemente, desvinculando-a de produtos que a utilizem."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </main>
</template>
