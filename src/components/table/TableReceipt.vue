<script setup lang="ts">
import Description from 'src/components/general/Description.vue';
import { ref, reactive, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useReceiptstore } from 'src/stores/receipt-store';
import { columnsReceipts } from 'src/utils/columns';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';

const props = withDefaults(
  defineProps<{
    filter?: string;
  }>(),
  {
    filter: '',
  },
);

const emit = defineEmits<{
  'show:showFormReceipt': [number];
}>();

const { loadingReceipt, listReceipt } = storeToRefs(useReceiptstore());

const showConfirmAction = ref<boolean>(false);
const receiptMonitoring = ref<number | null>(null);
const showDescription = reactive<{
  open: boolean;
  description: string | null;
}>({
  open: false,
  description: null,
});

const changeShowDescription = (show: boolean, receipt: IReceipt | null = null): void => {
  Object.assign(showDescription, {
    open: show,
    description: receipt?.description || null,
  });
};
const openConfirmAction = (id: number): void => {
  receiptMonitoring.value = id;
  showConfirmAction.value = true;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useReceiptstore().deleteReceipt(receiptMonitoring.value ?? 0);
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
};
const startEdit = (id: number): void => {
  emit('show:showFormReceipt', id);
};
const startExclude = (id: number): void => {
  openConfirmAction(id);
};
const fetchReceipts = async (): Promise<void> => {
  await useReceiptstore().getReceipt();
};

onMounted(async () => {
  await fetchReceipts();
});
</script>

<template>
  <q-table
    :rows="loadingReceipt ? [] : listReceipt"
    :columns="columnsReceipts"
    :filter="props.filter"
    title="Lista de recebimentos"
    row-key="index"
    no-data-label="Nenhum recebimento para mostrar"
    virtual-scroll
    :rows-per-page-options="[10]"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-h5">
          <span class="text-body2 text-bold">{{ col.label }}</span>
        </q-th>
      </q-tr>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="name">{{ props.row.identifier }}</q-td>
        <q-td key="type">{{ props.row.type?.name || 'Nenhum selecionado' }}</q-td>
        <q-td key="active">
          <q-icon
            :name="props.row.active === 1 ? 'check_circle' : 'close'"
            :color="props.row.active === 1 ? 'green' : 'red'"
            size="17px"
          />
        </q-td>
        <q-td key="actions" :props="props">
          <q-btn
            v-show="props.row.description"
            @click="changeShowDescription(true, props.row)"
            size="sm"
            flat
            round
            color="blue"
            icon="description"
          />
          <q-btn @click="startEdit(props.row.id)" size="sm" flat round color="black" icon="edit" />
          <q-btn
            @click="startExclude(props.row.id)"
            size="sm"
            flat
            round
            color="red"
            icon="delete"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- Modals -->
  <Description :data="showDescription" @update:open="changeShowDescription(false)" />
  <ConfirmAction
    :open="showConfirmAction"
    label-action="Continuar"
    title="Confirmação de exclusão de recebimento"
    message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá o recebimento permanentemente."
    @update:open="closeConfirmAction"
    @update:ok="closeConfirmActionOk"
  />
</template>
