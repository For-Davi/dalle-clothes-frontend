<script setup lang="ts">
import { ref } from 'vue';
import { columnsSearchProductVariant } from 'src/utils/columns';

defineOptions({
  name: 'TableSearchProductVariant',
});

const props = defineProps<{
  list: ISearchProductVariant[];
}>();
const emit = defineEmits<{
  chooseProductVariant: [number, 'in' | 'out'];
}>();

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
    :columns="columnsSearchProductVariant"
    :filter="filter"
    row-key="index"
    no-data-label="Nenhuma variante para mostrar"
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
        <span class="text-body1">Lista de variantes</span>
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
        <q-td key="name" :props="props" class="text-left">
          {{ props.row.product.name }}
        </q-td>
        <q-td key="sku" :props="props" class="text-left">
          {{ props.row.sku }}
        </q-td>
        <q-td key="code" :props="props" class="text-left">
          {{ props.row.code }}
        </q-td>
        <q-td key="color" :props="props" class="text-left">
          <div
            v-if="props.row.color"
            class="cursor-pointer"
            :style="getColorStyle(props.row.color.hex_color_code)"
          >
            <q-tooltip class="bg-grey-3 text-bold text-black">{{ props.row.color.name }}</q-tooltip>
          </div>
        </q-td>
        <q-td
          key="stock_quantity"
          :props="props"
          class="text-left"
          :class="props.row.stock_quantity <= props.row.min_stock_alert ? 'text-red text-bold' : ''"
        >
          {{ props.row.stock_quantity }}
        </q-td>
        <q-td key="action" :props="props">
          <q-btn
            @click="emit('chooseProductVariant', props.row.id, 'out')"
            size="sm"
            flat
            round
            color="red"
            icon="fa-solid fa-minus"
          >
            <q-tooltip class="bg-grey-3 text-bold text-red">Saída</q-tooltip>
          </q-btn>
          <q-btn
            @click="emit('chooseProductVariant', props.row.id, 'in')"
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
