<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { computed, reactive, watch } from 'vue';
import TableMountGrid from '../table/TableMountGrid.vue';
import { checkDataGrid } from 'src/composables/CheckData';
import { useGridStore } from 'src/stores/grid-store';

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

const { loadingGrid } = storeToRefs(useGridStore());

const dataGrid = reactive({
  gridName: '' as string,
  active: 1 as number,
  size: '' as string,
  itemsCreate: [] as IGridItemCreate[],
  itemsUpdate: [] as IGridItemUpdate[],
});

const clear = (): void => {
  Object.assign(dataGrid, {
    gridName: '',
    size: '',
    itemsCreate: [],
    itemsUpdate: [],
    active: 1,
  });
};
const addSize = (): void => {
  if (props.data.grid) {
    dataGrid.itemsUpdate.push({
      size: dataGrid.size,
      order: dataGrid.itemsUpdate.length + 1,
      active: 1,
    });
  } else {
    dataGrid.itemsCreate.push({
      size: dataGrid.size,
      order: dataGrid.itemsCreate.length + 1,
    });
  }

  Object.assign(dataGrid, {
    size: '',
  });
};
const setNewOrder = (order: number, action: 'up' | 'bellow'): void => {
  if (props.data.grid) {
    const currentIndex = dataGrid.itemsUpdate.findIndex(
      (item: IGridItemUpdate) => item.order === order,
    );

    if (currentIndex === -1) return;

    const newIndex = action === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= dataGrid.itemsUpdate.length) return;

    const tempOrder = dataGrid.itemsUpdate[currentIndex].order;
    dataGrid.itemsUpdate[currentIndex].order = dataGrid.itemsUpdate[newIndex].order;
    dataGrid.itemsUpdate[newIndex].order = tempOrder;

    dataGrid.itemsUpdate.sort((a: IGridItemUpdate, b: IGridItemUpdate) => a.order - b.order);
  } else {
    const currentIndex = dataGrid.itemsCreate.findIndex((item) => item.order === order);

    if (currentIndex === -1) return;

    const newIndex = action === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= dataGrid.itemsCreate.length) return;

    const tempOrder = dataGrid.itemsCreate[currentIndex].order;
    dataGrid.itemsCreate[currentIndex].order = dataGrid.itemsCreate[newIndex].order;
    dataGrid.itemsCreate[newIndex].order = tempOrder;

    dataGrid.itemsCreate.sort((a, b) => a.order - b.order);
  }
};
const deleteItem = (order: number): void => {
  if (props.data.grid) {
    const index = dataGrid.itemsUpdate.findIndex((item: IGridItemUpdate) => item.order === order);
    if (index !== -1) {
      dataGrid.itemsUpdate.splice(index, 1);
    }

    dataGrid.itemsUpdate.forEach((item: IGridItemUpdate, i: number) => {
      item.order = i + 1;
    });
  } else {
    const index = dataGrid.itemsCreate.findIndex((item) => item.order === order);
    if (index !== -1) {
      dataGrid.itemsCreate.splice(index, 1);
    }

    dataGrid.itemsCreate.forEach((item, i) => {
      item.order = i + 1;
    });
  }
};
const save = async () => {
  const check = checkDataGrid(dataGrid, 'create');
  if (check.status) {
    const response = await useGridStore().createGrid({
      gridName: dataGrid.gridName,
      items: dataGrid.itemsCreate,
    });
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados da grade');
  }
};
const update = async () => {
  const check = checkDataGrid(dataGrid, 'update');
  if (check.status) {
    const response = await useGridStore().updateGrid({
      id: gridID.value ?? 0,
      gridName: dataGrid.gridName,
      active: dataGrid.active,
      items: dataGrid.itemsUpdate,
    });
    if (response?.status === 200) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados da cor');
  }
};
const checkDataEdit = () => {
  if (props.data.grid) {
    Object.assign(dataGrid, {
      gridName: props.data.grid.name,
      active: props.data.grid.active,
      itemsUpdate: props.data.grid.items,
    });
  }
};

const gridID = computed(() => props.data.grid?.id);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
    checkDataEdit();
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
        <Loading :show="loadingGrid" />
        <q-card-section class="q-pa-sm column q-gutter-y-sm" v-show="!loadingGrid">
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
          <q-toggle
            v-model="dataGrid.active"
            :label="
              dataGrid.active === 1
                ? 'Sua grade de tamanhos está ativa'
                : 'Sua grade de tamanhos está inativa'
            "
            class="text-body1"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            :true-value="1"
            :false-value="0"
          />
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
            :mode="props.data.grid ? 'update' : 'create'"
            :items="props.data.grid ? dataGrid.itemsUpdate : dataGrid.itemsCreate"
            @set-new-order="setNewOrder"
            @delete-item="deleteItem"
          />
        </q-card-section>
      </div>
      <q-card-actions align="right" v-show="!loadingGrid">
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
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingGrid"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingGrid"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
