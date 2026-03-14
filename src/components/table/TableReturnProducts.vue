<script setup lang="ts">
import { formatToReal } from 'src/composables/Money';
import { ref } from 'vue';
import { columnsSaleProduct } from 'src/utils/columns';

defineOptions({
  name: 'TableReturnProducts',
});

const props = defineProps<{
  rows: IReturnItens[];
}>();
const emit = defineEmits<{
  'remove-from-return': [number];
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
  <section>
    <q-table
      :rows="props.rows"
      :columns="columnsSaleProduct"
      :filter="filter"
      title="Lista de produtos de devolvidos"
      row-key="index"
      no-data-label="Nenhum produto adicionado para devolução"
      dense
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
      <template v-slot:top>
        <div class="row justify-between items-center full-width">
          <span class="text-body1">Lista de produtos de devolvidos</span>
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
            {{ props.row.product_sku }}
          </q-td>
          <q-td key="product_code" :props="props" class="text-left">
            {{ props.row.product_code }}
          </q-td>
          <q-td key="quantity" :props="props" class="text-left">
            {{ props.row.returnQuantity }}
          </q-td>
          <q-td key="product_price" :props="props" class="text-left">
            {{ formatToReal(props.row.product_price) }}
          </q-td>
          <q-td key="color_name" :props="props" class="text-left">
            <div
              v-if="props.row.color"
              class="cursor-pointer"
              :style="getColorStyle(props.row.color)"
            >
              <q-tooltip class="bg-grey-3 text-bold text-black">{{
                props.row.color_name
              }}</q-tooltip>
            </div>
          </q-td>
          <q-td key="total" :props="props" class="text-left">
            {{ formatToReal(props.row.product_price * props.row.returnQuantity) }}
          </q-td>

          <q-td key="action" :props="props">
            <div class="flex row justify-end">
              <q-btn
                size="md"
                flat
                round
                color="red"
                icon="remove_shopping_cart"
                @click="emit('remove-from-return', props.row.product_variant_id)"
              >
                <q-tooltip> Remover produto </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>
