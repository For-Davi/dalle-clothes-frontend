<script setup lang="ts">
import { columnsReturnDetails } from 'src/utils/columns';
import { formatToReal } from 'src/composables/Money';

defineOptions({
  name: 'TableReturnProductsDetails',
});

const props = defineProps<{
  rows: IReturnExchangeItem[];
  loading: boolean;
}>();

const getColorStyle = (hexColor: string) => {
  return {
    backgroundColor: hexColor || 'transparent',
    width: '24px',
    height: '24px',
    border: '1px solid #ddd',
    borderRadius: '50%',
    display: 'inline-block',
    verticalAlign: 'middle',
  };
};
</script>

<template>
  <section style="min-height: 300px">
    <q-table
      :rows="props.loading ? [] : props.rows"
      :columns="columnsReturnDetails"
      :loading="props.loading"
      row-key="index"
      no-data-label="Nenhuma item devolvido para mostrar"
      virtual-scroll
      :rows-per-page-options="[10]"
      style="height: 300px"
      bordered
      flat
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
          <q-td key="name" :props="props" class="text-left">
            {{ props.row.product_name }}
          </q-td>
          <q-td key="sku" :props="props" class="text-left">
            {{ props.row.product_sku ?? '-' }}
          </q-td>
          <q-td key="code" :props="props" class="text-left">
            {{ props.row.product_code ?? '-' }}
          </q-td>
          <q-td key="quantity" :props="props" class="text-left">
            {{ props.row.quantity }}
          </q-td>
          <q-td key="price" :props="props" class="text-left">
            {{ formatToReal(props.row.product_price) }}
          </q-td>
          <q-td key="color" :props="props" class="text-left">
            <div
              v-if="props.row.color"
              class="cursor-pointer"
              :style="getColorStyle(props.row.color)"
            >
              <q-tooltip v-if="props.row.color_name" class="bg-grey-3 text-bold text-black">{{
                props.row.color_name
              }}</q-tooltip>
            </div>
          </q-td>
          <q-td key="total" :props="props" class="text-left">
            {{ formatToReal(props.row.total) }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>
