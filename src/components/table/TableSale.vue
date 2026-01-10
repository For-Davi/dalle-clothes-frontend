<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { columnsSales } from 'src/utils/columns';
import { storeToRefs } from 'pinia';
import { useSaleStore } from 'src/stores/sale-store';
import { formatToReal } from 'src/composables/Money';
import type { PaymentType } from 'src/enums/payment-enum';
import { PaymentTypeLabels } from 'src/enums/payment-enum';
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
const emit = defineEmits<{
  'show:showFormUser': [number];
}>();

const { loadingSale, listSale } = storeToRefs(useSaleStore());

const userMonitoring = ref<number | null>(null);
const showSaleDetails = ref<boolean>(false);

const changeShowSaleDetails = () => {
  showSaleDetails.value = !showSaleDetails.value;
};
const formatToBrazilianDateTime = (value?: string | null) => {
  if (!value) return '';

  const localValue = value.replace('Z', '');

  const date = new Date(localValue);

  const pad = (n: number) => String(n).padStart(2, '0');

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}
          ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
const getPaymentTypeLabel = (type: string) => {
  return PaymentTypeLabels[type as PaymentType] ?? type;
};
const startEdit = (id: number) => {
  emit('show:showFormUser', id);
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
      :rows="loadingSale ? [] : listSale"
      :columns="columnsSales"
      :filter="props.filter"
      :loading="loadingSale"
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
          <q-td key="form_payment" :props="props" class="items-center">
            <div>
              <q-list separator>
                <q-item
                  v-for="(payment, index) in props.row.sale_payments_methods"
                  :key="index"
                  dense
                >
                  <q-item-section class="text-center">
                    <q-item-label>{{ getPaymentTypeLabel(payment.type.name) }}</q-item-label>
                  </q-item-section>
                  <q-item-section class="text-center">
                    <q-item-label v-if="payment.receipt_name === 'Cartão de Crédito'"
                      >{{ payment.installments }}X</q-item-label
                    >
                  </q-item-section>
                  <q-item-section class="text-center">
                    <q-item-label>{{ formatToReal(payment.value) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-td>
          <q-td key="total" :props="props" class="text-right text-h4">
            {{ formatToReal(props.row.total) }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              @click="changeShowSaleDetails"
              :disable="userMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="black"
              icon="visibility"
            />
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
  <SaleDetails :data="{ open: showSaleDetails }" @update:open="changeShowSaleDetails" />
</template>
