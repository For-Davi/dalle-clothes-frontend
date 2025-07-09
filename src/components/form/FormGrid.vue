<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { useColorStore } from 'src/stores/color-store';
import { computed, reactive, watch } from 'vue';
import TableMountGrid from '../table/TableMountGrid.vue';

defineOptions({
  name: 'FormGrid',
});

const props = defineProps<{
  data: {
    open: boolean;
    grid: IGrid | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingColor } = storeToRefs(useColorStore());

const dataGrid = reactive({
  gridName: '' as string,
  size: '' as string,
  items: [] as IGridItemCreate[],
});

const clear = (): void => {
  Object.assign(dataGrid, {
    gridName: '',
    size: '',
    items: [],
  });
};
const addSize = (): void => {
  dataGrid.items.push({
    size: dataGrid.size,
    order: dataGrid.items.length + 1,
  });

  Object.assign(dataGrid, {
    size: '',
  });
};
const setNewOrder = (order: number, action: 'up' | 'bellow'): void => {
  const currentIndex = dataGrid.items.findIndex((item) => item.order === order);

  if (currentIndex === -1) return;

  const newIndex = action === 'up' ? currentIndex - 1 : currentIndex + 1;

  if (newIndex < 0 || newIndex >= dataGrid.items.length) return;

  const tempOrder = dataGrid.items[currentIndex].order;
  dataGrid.items[currentIndex].order = dataGrid.items[newIndex].order;
  dataGrid.items[newIndex].order = tempOrder;

  dataGrid.items.sort((a, b) => a.order - b.order);
};
const deleteItem = (order: number): void => {
  const index = dataGrid.items.findIndex((item) => item.order === order);
  if (index !== -1) {
    dataGrid.items.splice(index, 1);
  }

  dataGrid.items.forEach((item, i) => {
    item.order = i + 1;
  });
};
// const save = async () => {
//   const check = checkDataColor(dataColor);
//   if (check.status) {
//     const response = await useColorStore().createColor(
//       dataColor.name,
//       dataColor.hexColorCode.trim() === '' ? null : dataColor.hexColorCode,
//     );
//     if (response?.status === 201) {
//       clear();
//       emit('update:open');
//     }
//   } else {
//     createErrorData(check.message || 'Erro ao processar dados da cor');
//   }
// };
// const update = async () => {
//   const check = checkDataColor(dataColor);
//   if (check.status) {
//     const response = await useColorStore().updateColor(
//       colorID.value ?? 0,
//       dataColor.name,
//       dataColor.active === true ? 1 : 0,
//       dataColor.hexColorCode.trim() === '' ? null : dataColor.hexColorCode,
//     );
//     if (response?.status === 200) {
//       clear();
//       emit('update:open');
//     }
//   } else {
//     createErrorData(check.message || 'Erro ao processar dados da cor');
//   }
// };
// const checkDataEdit = () => {
//   if (props.data.color) {
//     Object.assign(dataColor, {
//       name: props.data.color.name,
//       hexColorCode: props.data.color.hex_color_code,
//       active: props.data.color.active === 1 ? true : false,
//     });
//   }
// };

const gridID = computed(() => props.data.grid?.id);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
    // checkDataEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2" style="width: 800px; max-width: 98vw; min-height: 350px">
      <div>
        <q-card-section class="q-pa-none">
          <TitlePage :title="gridID ? 'Atualização de grade' : 'Cadastro de grade'" icon="pin" />
        </q-card-section>
        <Loading :show="loadingColor" />
        <q-card-section class="q-pa-sm column q-gutter-y-sm" v-show="!loadingColor">
          <q-input
            v-model="dataGrid.gridName"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome da grade"
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="assignment" color="black" size="20px" />
            </template>
          </q-input>
          <q-separator class="q-mt-sm" />
          <div class="row justify-center q-mb-sm">
            <span
              class="text-body1 text-bold bg-secondary q-px-md q-py-sm rounded-borders text-white"
              >Organize os tamanhos</span
            >
          </div>
          <q-input
            v-model="dataGrid.size"
            bg-color="white"
            label-color="black"
            outlined
            label="Tamanho"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="square_foot" color="black" size="20px" />
            </template>
          </q-input>
          <q-btn
            @click="addSize"
            :disable="dataGrid.size.trim().length <= 0"
            color="green-9"
            label="Adicionar tamanho"
            class="full-width"
            size="md"
            unelevated
            no-caps
          />
          <TableMountGrid
            :items="dataGrid.items"
            @set-new-order="setNewOrder"
            @delete-item="deleteItem"
          />
        </q-card-section>
      </div>
      <q-card-actions align="right" v-show="!loadingColor">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            unelevated
            no-caps
          />
          <q-btn
            v-if="!gridID"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingColor"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingColor"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
