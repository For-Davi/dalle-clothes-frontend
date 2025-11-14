<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { columnsProduct } from 'src/utils/columns';
import { useProductStore } from 'src/stores/product-store';
import { formatToReal } from 'src/composables/Money';
import { checkProductClientData } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';

defineOptions({
  name: 'TableListProducts',
});

const emit = defineEmits<{
  'add-to-cart': [IClientCartProduct];
}>();

const { loadingProduct, listProduct } = storeToRefs(useProductStore());

const filter = ref<string>('');
const localProducts = ref<IClientCartProduct[]>([]);

const startAddCart = (product: IClientCartProduct) => {
  const check = checkProductClientData(product);

  if (check.status) {
    emit('add-to-cart', product);

    product.quantity = 0;
  } else {
    createErrorData(check.message || 'Erro ao adicionar produto ao carrinho');
  }
};
const fetchProducts = async (): Promise<void> => {
  await useProductStore().getProducts();
  localProducts.value = listProduct.value.map((p: IProduct) => ({ ...p, quantity: 0 }));
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
const isStockCritical = (stock: number | string): boolean => {
  return Number(stock) === 0;
};

onMounted(async () => {
  await fetchProducts();
});
</script>

<template>
  <section>
    <q-table
      :rows="loadingProduct ? [] : localProducts"
      :columns="columnsProduct"
      :filter="filter"
      :loading="loadingProduct"
      title="Lista de produtos"
      row-key="index"
      no-data-label="Nenhum produto para mostrar"
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
      <template v-slot:top>
        <div class="row justify-between items-center full-width">
          <span class="text-body1">Lista de produtos</span>
          <q-space />
          <q-input
            v-show="listProduct.length > 0"
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
            <q-icon
              :name="props.row.variant_active === 1 ? 'check_circle' : 'close'"
              :color="props.row.variant_active === 1 ? 'green' : 'red'"
              size="17px"
            >
              <q-tooltip class="bg-grey-3 text-bold text-black">{{
                props.row.variant_active === 1 ? 'Ativo' : 'Inativo'
              }}</q-tooltip>
            </q-icon>
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
          <q-td
            key="stock_quantity"
            :props="props"
            class="text-left"
            :class="isStockCritical(props.row.stock_quantity) ? 'text-red' : ''"
          >
            {{ props.row.stock_quantity }}
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

          <q-td key="action" :props="props">
            <div class="flex row justify-end">
              <q-btn
                size="md"
                flat
                round
                color="red"
                icon="remove"
                class="q-mr-sm"
                :disable="props.row.stock_quantity <= 0"
                @click="props.row.quantity--"
              />
              <q-input
                outlined
                dense
                v-model.number="props.row.quantity"
                input-class="text-right"
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
                :disable="props.row.stock_quantity <= 0"
                @click="props.row.quantity++"
              />
              <q-btn
                size="md"
                flat
                round
                color="primary"
                icon="add_shopping_cart"
                :disable="props.row.stock_quantity <= 0 || props.row.quantity <= 0"
                @click="startAddCart(props.row)"
              >
                <q-tooltip> Adicionar ao carrinho do cliente </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>
