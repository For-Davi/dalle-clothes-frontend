<script setup lang="ts">
import { formatToReal } from 'src/composables/Money';
import { columnsSupplierCart } from 'src/utils/columns';
import { ref, computed } from 'vue';

defineOptions({
  name: 'TableSupplierCart',
});

const props = defineProps<{
  rows: IClientCartProduct[]
}>()

const emit = defineEmits<{
  'remove-from-cart':[number];
}>()

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

const totalValue = computed(() => {
  return props.rows.reduce((acc, p) => {
    return acc + (p.price * (p.newQuantity || 0));
  }, 0);
});
</script>

<template>
  <section>
    props.rows {{ props.rows }}
    <q-table
      :rows="props.rows"
      :columns="columnsSupplierCart"
      :filter="filter"
      title="Itens do pedido"
      row-key="index"
      no-data-label="Nenhum produto adicionado ao carrinho"
      virtual-scroll
      dense
      :rows-per-page-options="[5]"
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
            {{ props.row.name }}
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
              <q-tooltip class="bg-grey-3 text-bold text-black">{{
                props.row.color.name
              }}</q-tooltip>
            </div>
          </q-td>
          <q-td
            key="quantity"
            :props="props"
            class="text-left"
          >
            {{ props.row.newQuantity }}
          </q-td>
          <q-td key="price" :props="props" class="text-left">
            {{ formatToReal(props.row.newPrice) }}
          </q-td>
          <q-td key="total" :props="props" class="text-left">
          {{ formatToReal(Number(Number(props.row.newPrice || 0) * Number(props.row.quantity || 0)).toFixed(2)) }}
        </q-td>
          <q-td key="action" :props="props" >
           <div class="flex row justify-end">
            <q-btn
              size="md"
              flat
              round
              color="red"
              icon="remove_shopping_cart"
              @click="emit('remove-from-cart', props.row.product_variant_id)">
            <q-tooltip>
                Remover
            </q-tooltip>
            </q-btn>
           </div>
           </q-td>
        </q-tr>
      </template>
      {{ totalValue }}
    </q-table>
  </section>
</template>
