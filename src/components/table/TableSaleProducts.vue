<script setup lang="ts">
import { formatToReal } from 'src/composables/Money';
import { ref } from 'vue';
import { columnsSaleProduct } from 'src/utils/columns';
import { checkDataToAddReturnProducts } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';

defineOptions({
  name: 'TableSaleProducts',
});

const props = defineProps<{
  rows: ISaleItens[];
  loading: boolean;
}>();

const emit = defineEmits<{
  'add-to-return': [IReturnItens];
}>();

const filter = ref<string>('');

const addToReturn = (product: IReturnItens) => {
  const check = checkDataToAddReturnProducts(product);
  if (check.status) {
    emit('add-to-return', {
      product_variant_id: product.product_variant_id,
      product_name: product.product_name,
      product_sku: product.product_sku,
      product_price: product.product_price,
      quantity: product.quantity,
      returnQuantity: product.returnQuantity,
      color: product.color,
      color_name: product.color_name,
      total: product.total,
    });
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
</script>

<template>
  <section>
    <q-table
      :rows="props.loading ? [] : props.rows"
      :columns="columnsSaleProduct"
      :filter="filter"
      :loading="props.loading"
      title="Lista de produtos da venda"
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
          <span class="text-body1">Lista de produtos da venda</span>
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
            {{ props.row.product_name }}
          </q-td>
          <q-td key="sku" :props="props" class="text-left">
            {{ props.row.product_sku }}
          </q-td>
          <q-td key="code" :props="props" class="text-left">
            {{ props.row.code }}
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
              <q-tooltip class="bg-grey-3 text-bold text-black">{{
                props.row.color_name
              }}</q-tooltip>
            </div>
          </q-td>
          <q-td key="total" :props="props" class="text-left">
            {{ formatToReal(props.row.total) }}
          </q-td>

          <q-td key="action" :props="props">
            <div class="flex row justify-end">
              <q-btn
                size="md"
                flat
                round
                color="red"
                icon="remove"
                class="q-mr-sm"
                :disable="props.row.returnQuantity <= 0 || !props.row.returnQuantity"
                @click="props.row.returnQuantity--"
              />
              <q-input
                outlined
                dense
                v-model.number="props.row.returnQuantity"
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
                  props.row.quantity === props.row.returnQuantity ||
                  props.row.returnQuantity > props.row.quantity
                "
                @click="props.row.returnQuantity++"
              />
              <q-btn
                size="md"
                flat
                round
                color="primary"
                icon="add_shopping_cart"
                :disable="
                  props.row.returnQuantity <= 0 ||
                  props.row.returnQuantity > props.row.quantity ||
                  !props.row.returnQuantity
                "
                @click="addToReturn(props.row)"
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
