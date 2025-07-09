<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, watch } from 'vue';
import CarouselGrid from '../carousel/CarouselGrid.vue';
import FormGrid from '../form/FormGrid.vue';

defineOptions({
  name: 'GridManage',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

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

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 sub-page">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de grades" icon="pin" />
      </q-card-section>
      <q-card-section>
        <CarouselGrid @show:show-form-grid="startEdit" />
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
