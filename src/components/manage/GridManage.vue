<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref, watch } from 'vue';
import CarouselGrid from '../carousel/CarouselGrid.vue';
import FormGrid from '../form/FormGrid.vue';
import { useGridStore } from 'src/stores/grid-store';
import { storeToRefs } from 'pinia';
import Empty from '../info/Empty.vue';
import Loading from '../shared/Loading.vue';
import SubscriptionBanner from 'src/components/banner/SubscriptionBanner.vue';
import { checkRegisterLimit } from 'src/composables/Plans';

defineOptions({
  name: 'GridManage',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { listGrid, loadingGrid } = storeToRefs(useGridStore());

const filter = ref<string>('');
const showFormGrid = reactive<{
  open: boolean;
  grid: IGrid | null;
}>({
  open: false,
  grid: null,
});

const clear = () => {
  Object.assign(showFormGrid, {
    open: false,
    grid: null,
  });
  filter.value = '';
};

const startEdit = (data: IGrid) => {
  changeShowFormGrid(true, data);
};
const changeShowFormGrid = (show: boolean, grid: IGrid | null = null): void => {
  Object.assign(showFormGrid, {
    open: show,
    grid: grid,
  });
};
const fetchGrids = async (): Promise<void> => {
  await useGridStore().getGrids();
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const planValidation = computed(() => {
  return checkRegisterLimit('grids', listGrid.value.length);
});

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchGrids();
  }
});
</script>
<template>
  <q-dialog v-model="open" :maximized="$q.screen.lt.sm">
    <q-card class="bg-grey-2 sub-page column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de grades" icon="pin" />
      </q-card-section>
      <q-card-section class="q-pa-none">
        <div v-if="!loadingGrid">
          <SubscriptionBanner
            v-if="planValidation.showUpgradeBanner"
            resource-name="grades"
            class="q-ma-md"
          />
          <div style="padding-right: 60px; padding-left: 60px">
            <q-input
              v-show="listGrid.length > 0"
              v-model="filter"
              outlined
              dense
              label="Pesquisar"
              bg-color="white"
              label-color="black"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <CarouselGrid
            v-if="listGrid.length > 0"
            :filter="filter"
            @show:show-form-grid="startEdit"
          />
          <Empty v-else message="Sem grades de tamanhos cadastradas" color="bg-red-3" />
        </div>
        <Loading v-else :show="loadingGrid" />
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            unelevated
            no-caps
            flat
          />
          <q-btn
            v-if="hasPermission('grid.create') && planValidation.canAdd"
            @click="changeShowFormGrid(true)"
            color="primary"
            label="Adicionar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>

      <!-- Modals -->
      <FormGrid :data="showFormGrid" @update:open="changeShowFormGrid(false)" />
    </q-card>
  </q-dialog>
</template>
