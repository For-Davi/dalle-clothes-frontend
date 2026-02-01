<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { columnsSales } from 'src/utils/columns';
import { storeToRefs } from 'pinia';
import { useSaleStore } from 'src/stores/sale-store';
import { formatToReal } from 'src/composables/Money';
import SaleDetails from '../fragments/sale/SaleDetails.vue';

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

const saleMonitoring = ref<number | null>(null);
const showSaleDetails = reactive({
  open: false as boolean,
  saleID: null as number | null,
});

const changeShowSaleDetails = (open: boolean, saleID: number | null = null): void => {
  Object.assign(showSaleDetails, {
    open,
    saleID,
  });
};
const formatToBrazilianDateTime = (value?: string | null) => {
  if (!value) return '';

  const localValue = value.replace('Z', '');

  const date = new Date(localValue);

  const pad = (n: number) => String(n).padStart(2, '0');

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}
          ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
const fetchSales = async (): Promise<void> => {
  await useSaleStore().getSales();
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
            {{ formatToBrazilianDateTime(props.row.date) }}
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
              @click="console.log('ajksahd', props.row.id)"
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
  <SaleDetails :data="showSaleDetails" @update:open="changeShowSaleDetails(false)" />
</template>
