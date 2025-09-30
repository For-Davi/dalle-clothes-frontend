<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import { useSupplierOrderStore } from '@/stores/supplier-order-store';
import { columnsSupplierOrder } from 'src/utils/columns';
import { getLabelStatusSupplierOrder } from 'src/composables/Label';
import { formatToBrazilianDate } from 'src/composables/FormatData';
import SupplierOrderDetails from '../fragments/supplier/SupplierOrderDetails.vue';

defineOptions({
  name: 'TableSupplierOrder',
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
  'show:showFormSupplierOrder': [number];
}>();

const { loadingSupplierOrder, listSupplierOrder } = storeToRefs(useSupplierOrderStore());

const showConfirmAction = ref<boolean>(false);
const orderMonitoring = ref<number | null>(null);
const showDetails = reactive<{
  open: boolean;
  orderID: number | null;
}>({
  open: false,
  orderID: null,
});

const changeShowDetails = (show: boolean, orderID: number | null = null): void => {
  Object.assign(showDetails, {
    open: show,
    orderID: orderID,
  });
};
const openConfirmAction = (id: number): void => {
  orderMonitoring.value = id;
  showConfirmAction.value = true;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useSupplierOrderStore().deleteSupplierOrder(orderMonitoring.value ?? 0);
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
};
const startEdit = (id: number): void => {
  emit('show:showFormSupplierOrder', id);
};
const startExclude = (id: number): void => {
  openConfirmAction(id);
};
const fetchOrders = async (): Promise<void> => {
  await useSupplierOrderStore().getSupplierOrders();
};

onMounted(async () => {
  await fetchOrders();
});
</script>

<template>
  <q-table
    :rows="loadingSupplierOrder ? [] : listSupplierOrder"
    :columns="columnsSupplierOrder"
    :filter="props.filter"
    title="Lista de pedidos"
    row-key="index"
    no-data-label="Nenhum pedido para mostrar"
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
        <q-td key="created_at">{{ props.row.created_at }}</q-td>
        <q-td key="order">{{ props.row.order ?? '' }}</q-td>
        <q-td key="status">{{ getLabelStatusSupplierOrder(props.row.status) }}</q-td>
        <q-td key="date_delivery_expected">{{
          props.row.date_delivery_expected
            ? formatToBrazilianDate(props.row.date_delivery_expected)
            : ''
        }}</q-td>
        <q-td key="actions" :props="props">
          <q-btn
            v-show="props.row.id"
            @click="changeShowDetails(true, props.row.id)"
            size="sm"
            flat
            round
            color="blue"
            icon="visibility"
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
  <SupplierOrderDetails :data="showDetails" @update:open="changeShowDetails(false)" />
  <ConfirmAction
    :open="showConfirmAction"
    label-action="Continuar"
    title="Confirmação de exclusão de pedido"
    message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá o recebimento permanentemente."
    @update:open="closeConfirmAction"
    @update:ok="closeConfirmActionOk"
  />
</template>
