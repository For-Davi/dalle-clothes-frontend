<script setup lang="ts">
import { formatToReal } from 'src/composables/Money';
import { columnsClientCart } from 'src/utils/columns';
import { ref, watch } from 'vue';

defineOptions({
  name: 'TablePaymentClients',
});

const props = defineProps<{
  rows: IClientCartProduct[];
}>();

const emit = defineEmits<{
  'remove-from-cart': [number];
  'send-total': [number];
}>();

const filter = ref<string>('');
const total = ref<number>(0);

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

const returnPrice = (row: IClientCartProduct) => {
  const unitPrice = row.offer ? Number(row.offer) : Number(row.price);
  if (row.discount > 0 && row.discount <= 100) {
    return unitPrice - unitPrice * (row.discount / 100);
  }
  return unitPrice;
};

watch(
  () => props.rows,
  (rows) => {
    total.value = 0;
    rows.forEach((p) => {
      const unitPrice = returnPrice(p);
      total.value += Number(unitPrice) * (p.newQuantity ?? 0);
    });
    emit('send-total', total.value);
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <section>
    <q-table
      :rows="props.rows"
      :columns="columnsClientCart"
      :filter="filter"
      title="Carrinho do cliente"
      row-key="index"
      no-data-label="Nenhum produto adicionado ao carrinho"
      virtual-scroll
      dense
      :rows-per-page-options="[0]"
      style="max-height: 400px"
    >
      <template v-slot:top>
        <div class="row justify-between items-center full-width">
          <span class="text-body1">Carrinho do cliente</span>
          <q-space />
          <span class="text-h6 text-green text-bold"
            >Total: {{ formatToReal(total.toString()) }}</span
          >
        </div>
      </template>
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
          <q-td key="price" :props="props" class="text-left">
            {{ formatToReal(returnPrice(props.row)) }}
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
          <q-td key="quantity" :props="props" class="text-left">
            {{ props.row.newQuantity }}
          </q-td>
          <q-td key="action" :props="props">
            <div class="flex row justify-end">
              <q-input
                v-if="hasPermission('sale-discount.create')"
                label="Porcentagem de desconto"
                outlined
                dense
                v-model.number="props.row.discount"
                input-class="text-right"
                mask="#"
                fill-mask="0"
                reverse-fill-mask
                class="q-mr-sm"
                style="width: 150px"
              />
              <q-btn
                size="md"
                flat
                round
                color="red"
                icon="remove_shopping_cart"
                @click="emit('remove-from-cart', props.row.product_variant_id)"
              >
                <q-tooltip> Remover produto do carrinho </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </q-tr>
        <q-tr :props="props" :key="props.row.index" class="q-virtual-scroll--with-prev">
          <q-td colspan="100%">
            <div class="text-left text-bold">
              Preço por linha:
              <span class="text-green text-bold">{{
                formatToReal(returnPrice(props.row) * props.row.newQuantity)
              }}</span>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>
