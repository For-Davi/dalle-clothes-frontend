<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { columnsSupplierCart } from 'src/utils/columns';
import { useProductStore } from 'src/stores/product-store';
import { formatToReal } from 'src/composables/Money';

defineOptions({
  name: 'TableSupplierListProducts',
});

const items = defineModel<ISupplierCartProduct[]>('items', { required: true });

const { loadingProduct, listProduct } = storeToRefs(useProductStore());

const filter = ref<string>('');
const localProducts = ref<ISupplierCartProduct[]>([]);

const addCart = (product: ISupplierCartProduct) => {
  items.value.push({
    ...product,
    newQuantity: product.quantity,
  });

  product.quantity = 0;
  product.newPrice = 0;
};
const fetchProducts = async (): Promise<void> => {
  await useProductStore().getProducts();
  localProducts.value = listProduct.value.map((p: IProduct) => ({
    ...p,
    quantity: 0,
    newPrice: 0,
  }));
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

onMounted(async () => {
  await fetchProducts();
});
</script>

<template>
  <section>
    <q-table
      :rows="loadingProduct ? [] : localProducts"
      :columns="columnsSupplierCart"
      :filter="filter"
      :loading="loadingProduct"
      title="Lista de produtos"
      row-key="index"
      no-data-label="Nenhum produto para mostrar"
      dense
      virtual-scroll
      :rows-per-page-options="[0]"
      style="height: 400px"
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
            <q-input
              outlined
              dense
              v-model.number="props.row.quantity"
              input-class="text-right"
              class="q-mr-sm"
              mask="#"
              fill-mask="0"
              reverse-fill-mask
              style="max-width: 100px"
            />
          </q-td>
          <q-td key="price" :props="props" class="text-left">
            <q-input
              outlined
              dense
              v-model.number="props.row.newPrice"
              input-class="text-right"
              class="q-mr-sm"
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              style="max-width: 100px"
            />
          </q-td>
          <q-td key="total" :props="props" class="text-left">
            {{
              formatToReal(
                Number(Number(props.row.newPrice || 0) * Number(props.row.quantity || 0)).toFixed(
                  2,
                ),
              )
            }}
          </q-td>
          <q-td key="action" :props="props" class="text-left">
            <q-btn
              :disable="props.row.quantity === 0 || props.row.newPrice === 0"
              size="md"
              flat
              round
              color="primary"
              icon="add_shopping_cart"
              @click="addCart(props.row)"
            >
              <q-tooltip> Adicionar </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>
