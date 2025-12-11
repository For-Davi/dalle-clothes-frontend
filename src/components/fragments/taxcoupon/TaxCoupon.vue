<script setup lang="ts">
import { columnsTaxCoupon } from 'src/utils/columns';
import { formatToReal } from 'src/composables/Money';

defineOptions({
  name: 'TaxCoupon',
});

const props = defineProps<{
  couponData: ICouponData | null;
}>();

const formatToBrazilianDate = (dateStr: string) => {
  if (!dateStr) return '';

  const isoStr = dateStr.split(' ')[0].split('-').reverse().join('-') + 'T' + dateStr.split(' ')[1];

  const date = new Date(isoStr);

  const brTime = new Date(date.getTime() - 3 * 60 * 60 * 1000);

  const day = String(brTime.getDate()).padStart(2, '0');
  const month = String(brTime.getMonth() + 1).padStart(2, '0');
  const year = brTime.getFullYear();
  const hours = String(brTime.getHours()).padStart(2, '0');
  const minutes = String(brTime.getMinutes()).padStart(2, '0');
  const seconds = String(brTime.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};
</script>

<template>
  <q-card bordered flat class="q-ma-sm">
    <q-card-section>
      <div class="flex column">
        <div class="flex justify-between">
          <span class="text-bold text-h6">{{
            props.couponData?.enterprise.name.toUpperCase()
          }}</span>
          <span class="text-bold text-h6">{{
            formatToBrazilianDate(props.couponData?.sale.date ?? '')
          }}</span>
        </div>
        <span
          class="text-bold text-h6"
          v-if="props.couponData?.enterprise.cnpj || props.couponData?.enterprise.cpf"
          >{{
            props.couponData?.enterprise.cnpj
              ? `CNPJ:${props.couponData.enterprise.cnpj}`
              : `CPF:${props.couponData?.enterprise.cpf}`
          }}</span
        >
        <span
          >- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - -</span
        >
      </div>
      <span class="text-bold text-h6 flex justify-center">Cupom Fiscal</span>
      <q-table
        class="q-mt-sm"
        :rows="props.couponData?.products ?? []"
        :columns="columnsTaxCoupon"
        row-key="index"
        no-data-label="Nenhum produto para mostrar"
        flat
        dense
        hide-bottom
        :rows-per-page-options="[0]"
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
            <q-td
              key="item"
              :props="props"
              class="text-left"
              style="max-width: 150px; white-space: normal; word-wrap: break-word"
            >
              {{ String(props.rowIndex + 1).padStart(3, '0') }}
            </q-td>
            <q-td
              key="code"
              :props="props"
              class="text-left"
              style="max-width: 150px; white-space: normal; word-wrap: break-word"
            >
              {{ props.row.product_sku }}
            </q-td>
            <q-td
              key="name"
              :props="props"
              class="text-left"
              style="max-width: 150px; white-space: normal; word-wrap: break-word"
            >
              {{ props.row.product_name }}
            </q-td>
            <q-td key="quantity" :props="props" class="text-left">
              {{ props.row.quantity }}
            </q-td>
            <q-td key="value" :props="props" class="text-right">
              {{ props.row.product_price }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <span
        >- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - -</span
      >
      <div>
        <div class="flex justify-between">
          <span class="text-bold text-body1"
            >TROCO: {{ formatToReal(props.couponData?.sale.change ?? '0') }}</span
          >
          <span class="text-bold text-h6"
            >TOTAL: {{ formatToReal(props.couponData?.sale.total ?? '0') }}</span
          >
        </div>
        <span class="text-bold text-body1"
          >TARIFAS: {{ formatToReal(props.couponData?.sale.fees ?? '0') }}</span
        >
      </div>
    </q-card-section>
  </q-card>
</template>
