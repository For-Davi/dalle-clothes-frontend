<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { columnsProduct } from 'src/utils/columns';
import FormLinkedProduct from '../form/FormLinkedProduct.vue';
import { useProductStore } from 'src/stores/product-store';
import { formatToReal } from 'src/composables/Money';

defineOptions({
  name: 'TableListVariants',
});

const props = withDefaults(
  defineProps<{
    filter?: string;
    supplierId: number | null;
  }>(),
  {
    filter: '',
  },
);

const { loadingProduct, listProduct } = storeToRefs(useProductStore());


const showFormLinkedProduct = reactive<{
  open: boolean;
  catalog: IDataSupplierCatalog | null;
}>({
  open: false,
  catalog: null,
});


const changeShowFormLinkedProduct = (
  variantId?: number,
  catalog?: IDataSupplierCatalog
) => {
  showFormLinkedProduct.open = !showFormLinkedProduct.open;
  if (catalog) {
    Object.assign(showFormLinkedProduct, { catalog });
  } else if (variantId) {
    Object.assign(showFormLinkedProduct, {
      catalog: {
        supplierID: props.supplierId ?? 0,
        productVariantID: variantId,
        price: 0,
        description: null,
      },
    });
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
const isStockCritical = (stock: number | string): boolean => {
  return Number(stock) === 0;
};
const fetchProducts = async (): Promise<void> => {
  await useProductStore().getProducts();
};

onMounted(async () => {
  await fetchProducts();
});
</script>
<template>
  <section>
    <q-table
      :rows="loadingProduct ? [] : listProduct"
      :columns="columnsProduct"
      :filter="props.filter"
      :loading="loadingProduct"
      title="Lista de produtos"
      row-key="product_variant_id"
      no-data-label="Nenhum produto para mostrar"
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
              :style="getColorStyle(props.row.color?.hex_color_code)"
            >
              <q-tooltip class="bg-grey-3 text-bold text-black">{{
                props.row.color?.name
              }}</q-tooltip>
            </div>
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              size="sm"
              flat
              round
              color="green"
              @click="changeShowFormLinkedProduct(props.row.product_variant_id)"
              icon="check">
            <q-tooltip>
                Vincular
            </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Modals -->
       <FormLinkedProduct
        :data="showFormLinkedProduct"
        @update:open="changeShowFormLinkedProduct()"
      />
  </section>
</template>
