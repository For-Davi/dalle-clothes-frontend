<script setup lang="ts">
import { ref } from 'vue';
import { columnsSearchReturnItemVariant } from 'src/utils/columns';
import { useReturnStore } from 'src/stores/return-store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'TableSearchReturnItem',
});

const props = defineProps<{
  list: IStockReentryReturnItem[];
}>();
const emit = defineEmits<{
  chooseProductVariant: [number, 'in' | 'out', 'return'];
}>();

const { loadingReturn } = storeToRefs(useReturnStore());

const filter = ref<string>('');

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
  <q-table
    :rows="props.list"
    :columns="columnsSearchReturnItemVariant"
    :filter="filter"
    :loading="loadingReturn"
    row-key="index"
    no-data-label="Nenhum produto devolvido para mostrar"
    virtual-scroll
    :rows-per-page-options="[6]"
    bordered
    dense
    flat
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-h5">
          <span class="text-body2 text-bold">{{ col.label }}</span>
        </q-th>
      </q-tr>
    </template>
    <template v-slot:top>
      <div class="row justify-between items-center full-width">
        <span class="text-body1">Lista de produtos devolvidos</span>
        <q-space />
        <q-input
          v-model="filter"
          outlined
          dense
          label="Pesquisar"
          :class="!$q.screen.lt.md ? '' : 'q-mt-sm'"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="product_name" :props="props" class="text-left">
          {{ props.row.product_name }}
        </q-td>
        <q-td key="product_sku" :props="props" class="text-left">
          {{ props.row.product_sku ?? '-' }}
        </q-td>
        <q-td key="product_code" :props="props" class="text-left">
          {{ props.row.product_code ?? '-' }}
        </q-td>
        <q-td key="product_color_name" :props="props" class="text-left">
          <div
            v-if="props.row.product_color"
            class="cursor-pointer"
            :style="getColorStyle(props.row.product_color)"
          >
            <q-tooltip class="bg-grey-3 text-bold text-black">{{
              props.row.product_color_name
            }}</q-tooltip>
          </div>
        </q-td>
        <q-td key="quantity" :props="props" class="text-left">
          {{ props.row.quantity }}
        </q-td>
        <q-td key="action" :props="props">
          <q-btn
            @click="emit('chooseProductVariant', props.row.product_variant_id, 'out', 'return')"
            size="sm"
            flat
            round
            color="red"
            icon="fa-solid fa-minus"
          >
            <q-tooltip class="bg-grey-3 text-bold text-red">Saída</q-tooltip>
          </q-btn>
          <q-btn
            @click="emit('chooseProductVariant', props.row.product_variant_id, 'in', 'return')"
            size="sm"
            flat
            round
            color="green"
            icon="add"
          >
            <q-tooltip class="bg-grey-3 text-bold text-green">Entrada</q-tooltip>
          </q-btn>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>
