<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import { columnsProduct } from 'src/utils/columns';
import { useProductStore } from 'src/stores/product-store';
import { formatToReal } from 'src/composables/Money';

defineOptions({
  name: 'TableProduct',
});

const props = withDefaults(
  defineProps<{
    filter?: string;
  }>(),
  {
    filter: '',
  },
);
const emit = defineEmits<{
  'show:showFormVariant': [number];
  'show:showModalSupplier': [number, number];
  clearFilter: [void];
}>();

const { loadingProduct, listProduct } = storeToRefs(useProductStore());

const showConfirmAction = ref<boolean>(false);
const productMonitoring = ref<number | null>(null);

const clear = (): void => {
  productMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useProductStore().deleteVariant(productMonitoring.value ?? 0);
  clear();
  emit('clearFilter');
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  productMonitoring.value = id;
  showConfirmAction.value = true;
};
const startEdit = (id: number) => {
  emit('show:showFormVariant', id);
};
const startOpenModalSupplier = (variantID: number, supplierID: number) => {
  emit('show:showModalSupplier', variantID, supplierID);
};
const startExclude = (id: number) => {
  openConfirmAction(id);
};
const fetchProducts = async (): Promise<void> => {
  await useProductStore().getProducts();
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
      :rows="loadingProduct ? [] : listProduct"
      :columns="columnsProduct"
      :filter="props.filter"
      :loading="loadingProduct"
      title="Lista de produtos"
      row-key="index"
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
            <q-btn
              v-if="props.row.catalog"
              @click="
                startOpenModalSupplier(props.row.product_variant_id, props.row.catalog.supplier_id)
              "
              size="sm"
              flat
              round
              color="primary"
              icon="local_shipping"
            >
              <q-tooltip> Fornecedores </q-tooltip>
            </q-btn>
            <q-btn
              @click="startEdit(props.row.product_variant_id)"
              :disable="productMonitoring === props.row.product_variant_id"
              size="sm"
              flat
              round
              color="black"
              icon="edit"
            />
            <q-btn
              @click="startExclude(props.row.product_variant_id)"
              :disable="productMonitoring === props.row.product_variant_id"
              size="sm"
              flat
              round
              color="red"
              icon="delete"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão de variante"
      message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá a variante do produto permanentemente."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
