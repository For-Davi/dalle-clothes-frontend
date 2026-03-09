<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { columnsSales } from 'src/utils/columns';
import { storeToRefs } from 'pinia';
import { useSaleStore } from 'src/stores/sale-store';
import { formatToReal } from 'src/composables/Money';
import SaleDetails from '../fragments/sale/SaleDetails.vue';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import { formatToBrazilianDate } from 'src/composables/FormatData';

defineOptions({
  name: 'TableSale',
});
const props = withDefaults(
  defineProps<{
    filter?: string;
  }>(),
  {
    filter: '',
  },
);

const { loadingListSale, listSale } = storeToRefs(useSaleStore());

const showSaleDetails = reactive({
  open: false as boolean,
  saleID: null as number | null,
});
const showConfirmAction = ref<boolean>(false);
const saleMonitoring = ref<number | null>(null);

const changeShowSaleDetails = (open: boolean, saleID: number | null = null): void => {
  Object.assign(showSaleDetails, {
    open,
    saleID,
  });
};
const fetchSales = async (): Promise<void> => {
  await useSaleStore().getSales();
};
const clear = (): void => {
  saleMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useSaleStore().deleteSale(saleMonitoring.value ?? 0);
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  saleMonitoring.value = id;
  showConfirmAction.value = true;
};
const startExclude = (id: number) => {
  openConfirmAction(id);
};

onMounted(async () => {
  await fetchSales();
});
</script>
<template>
  <section>
    <q-table
      :rows="loadingListSale ? [] : listSale"
      :columns="columnsSales"
      :filter="props.filter"
      :loading="loadingListSale"
      title="Lista de vendas"
      row-key="index"
      no-data-label="Nenhuma venda para mostrar"
      virtual-scroll
      :rows-per-page-options="[10]"
      :pagination="{ sortBy: 'date', descending: true }"
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
          <q-td key="date" :props="props" class="text-left">
            {{ formatToBrazilianDate(props.row.date) }}
          </q-td>
          <q-td key="status" :props="props" class="text-left">
            <q-icon
              :name="props.row.status === 'active' ? 'check_circle' : 'close'"
              :color="props.row.status === 'active' ? 'green' : 'red'"
              class="cursor-pointer q-px-xs"
              size="17px"
            >
              <q-tooltip class="bg-grey-3 text-bold text-black">{{
                props.row.status === 'active' ? 'Ativa' : 'Cancelada'
              }}</q-tooltip>
            </q-icon>
          </q-td>
          <q-td key="seller_name" :props="props" class="text-left">
            {{ props.row.seller_name ? props.row.seller_name : '-' }}
          </q-td>
          <q-td key="client_name" :props="props" class="text-left">
            {{ props.row.client_name ? props.row.client_name : 'Consumidor final' }}
          </q-td>
          <q-td key="total" :props="props" class="text-left">
            {{ formatToReal(props.row.starting_total) }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              @click="changeShowSaleDetails(true, props.row.id)"
              :disable="saleMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="primary"
              icon="visibility"
            >
              <q-tooltip> Detalhes </q-tooltip>
            </q-btn>
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
  </section>
  <!-- Modals -->
  <SaleDetails
    :data="showSaleDetails"
    @update:open="changeShowSaleDetails(false)"
    @new-request="fetchSales"
  />
  <ConfirmAction
    :open="showConfirmAction"
    label-action="Continuar"
    title="Confirmação de exclusão da venda"
    message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá a venda e registros como, devoluções, comissões, entregas e movimentações de estoque permanentemente."
    @update:open="closeConfirmAction"
    @update:ok="closeConfirmActionOk"
  />
</template>
