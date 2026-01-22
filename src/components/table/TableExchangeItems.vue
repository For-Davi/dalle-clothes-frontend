<script setup lang="ts">
import { formatToReal } from 'src/composables/Money';
import { ref } from 'vue';
import { columnsShiftProduct } from 'src/utils/columns';

defineOptions({
  name: 'TableExchangeItems',
});

const props = defineProps<{
  rows: IClientCartProduct[];
}>();
const emit = defineEmits<{
  'remove-from-shift': [number];
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
      :columns="columnsShiftProduct"
      :filter="filter"
      title="Carrinho de troca do cliente"
      row-key="index"
      no-data-label="Nenhum produto adicionado para a troca"
      virtual-scroll
      dense
      :rows-per-page-options="[0]"
      style="max-height: 400px"
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
          <span class="text-body1">Carrinho de troca do cliente</span>
          <q-space />
          <q-input
            v-show="props.rows.length > 0"
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
            {{ props.row.name }}
          </q-td>
          <q-td key="sku" :props="props" class="text-left">
            {{ props.row.sku }}
          </q-td>
          <q-td key="code" :props="props" class="text-left">
            {{ props.row.code }}
          </q-td>
          <q-td key="price" :props="props" class="text-left">
            {{ formatToReal(props.row.price) }}
          </q-td>
          <q-td key="offer" :props="props" class="text-left">
            {{
              props.row.offer !== '0.00' && props.row.offer !== null
                ? formatToReal(props.row.offer)
                : '-'
            }}
          </q-td>
          <q-td key="quantity" :props="props" class="text-left">
            {{ props.row.quantity }}
          </q-td>
          <q-td key="color" :props="props" class="text-left">
            <div
              v-if="props.row.color"
              class="cursor-pointer"
              :style="getColorStyle(props.row.color.hex_color_code)"
            >
              <q-tooltip class="bg-grey-3 text-bold text-black">{{
                props.row.color.name
              }}</q-tooltip>
            </div>
          </q-td>
          <q-td key="total" :props="props" class="text-left">
            {{
              props.row.offer !== '0.00' && props.row.offer !== null
                ? formatToReal(props.row.offer * props.row.quantity)
                : formatToReal(props.row.price * props.row.quantity)
            }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              size="md"
              flat
              round
              color="red"
              icon="remove_shopping_cart"
              @click="emit('remove-from-shift', props.row.product_variant_id)"
            >
              <q-tooltip>Remover produto</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>
