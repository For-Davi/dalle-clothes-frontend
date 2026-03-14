<script setup lang="ts">
import { formatToReal } from 'src/composables/Money';
import { ref } from 'vue';
import { columnsSaleProduct } from 'src/utils/columns';
import { checkDataToAddReturnProducts } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';

defineOptions({
  name: 'TableForReturnSaleOrReturnProducts',
});

const props = defineProps<{
  rows: ISaleItens[] | IDataReturnItens[];
  loading: boolean;
  type: 'return' | 'linked';
  returnedQuantities: Record<number, number>;
  quantities: Record<number, number>;
  formIndex: number;
}>();

const emit = defineEmits<{
  'add-to-return': [IDataReturnItens];
  'update-quantity': [number, number, number];
}>();

const filter = ref<string>('');

const addToReturn = (product: IDataReturnItens) => {
  const quantity = getQuantity(product.product_variant_id);

  const data = {
    ...product,
    returnQuantity: quantity,
  };

  const check = checkDataToAddReturnProducts(data);

  if (check.status) {
    emit('add-to-return', data);
  } else {
    createErrorData(check.message || 'Erro ao adicionar produto para a tabela de devolução');
  }
};
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
const getAvailableQuantity = (row: IDataReturnItens | ISaleItens) => {
  return row.quantity - (props.returnedQuantities[row.product_variant_id] || 0);
};
const getQuantity = (productId: number) => {
  return props.quantities[productId] || 0;
};
</script>

<template>
  <section>
    <q-table
      :rows="props.loading ? [] : props.rows"
      :columns="columnsSaleProduct"
      :filter="filter"
      :loading="props.loading"
      row-key="index"
      no-data-label="Nenhum produto para mostrar"
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
          <span class="text-body1">{{
            props.type === 'return' ? 'Lista de produtos da venda' : 'Lista de produtos da troca'
          }}</span>
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
      <template v-slot:body="slot">
        <q-tr :props="slot">
          <q-td key="product_name" :props="slot" class="text-left">
            {{ slot.row.product_name }}
          </q-td>
          <q-td key="product_sku" :props="slot" class="text-left">
            {{ slot.row.product_sku }}
          </q-td>
          <q-td key="product_code" :props="slot" class="text-left">
            {{ slot.row.product_code }}
          </q-td>
          <q-td key="quantity" :props="slot" class="text-left">
            {{ getAvailableQuantity(slot.row) }}
          </q-td>
          <q-td key="product_price" :props="slot" class="text-left">
            {{ formatToReal(slot.row.product_price) }}
          </q-td>
          <q-td key="color_name" :props="slot" class="text-left">
            <div
              v-if="slot.row.color"
              class="cursor-pointer"
              :style="getColorStyle(slot.row.color)"
            >
              <q-tooltip class="bg-grey-3 text-bold text-black">{{
                slot.row.color_name
              }}</q-tooltip>
            </div>
          </q-td>
          <q-td key="total" :props="slot" class="text-left">
            {{ formatToReal(slot.row.total) }}
          </q-td>

          <q-td key="action" :props="slot">
            <div class="flex row justify-end">
              <q-btn
                size="md"
                flat
                round
                color="red"
                icon="remove"
                class="q-mr-sm"
                :disable="getQuantity(slot.row.product_variant_id) <= 0"
                @click="
                  emit(
                    'update-quantity',
                    formIndex,
                    slot.row.product_variant_id,
                    getQuantity(slot.row.product_variant_id) - 1,
                  )
                "
              />
              <q-input
                outlined
                dense
                :model-value="getQuantity(slot.row.product_variant_id)"
                @update:model-value="
                  (val) =>
                    emit(
                      'update-quantity',
                      formIndex,
                      slot.row.product_variant_id,
                      Number(val) || 0,
                    )
                "
                input-class="text-right"
                mask="#"
                fill-mask="0"
                reverse-fill-mask
                class="q-mr-sm"
                style="width: 65px"
              />
              <q-btn
                size="md"
                flat
                round
                color="green"
                icon="add"
                class="q-mr-sm"
                :disable="
                  getQuantity(slot.row.product_variant_id) >= getAvailableQuantity(slot.row)
                "
                @click="
                  emit(
                    'update-quantity',
                    formIndex,
                    slot.row.product_variant_id,
                    getQuantity(slot.row.product_variant_id) + 1,
                  )
                "
              />
              <q-btn
                size="md"
                flat
                round
                color="primary"
                icon="add_shopping_cart"
                :disable="
                  getQuantity(slot.row.product_variant_id) <= 0 ||
                  getQuantity(slot.row.product_variant_id) > getAvailableQuantity(slot.row)
                "
                @click="addToReturn(slot.row)"
              >
                <q-tooltip> Adicionar item a devolução</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>
