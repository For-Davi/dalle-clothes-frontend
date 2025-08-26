<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, ref, reactive } from 'vue';
import Loading from '../shared/Loading.vue';
import Empty from '../info/Empty.vue';
import { storeToRefs } from 'pinia';
import { useCatalogSupplierStore } from 'src/stores/catalog-supplier-store';
import TableLinkedProducts from '../table/TableLinkedProducts.vue';
import ProductsVariantsManage from './ProductsVariantsManage.vue';
import FormLinkedProduct from '../form/FormLinkedProduct.vue';

defineOptions({
  name: 'LinkedProductsManage',
});

const props = defineProps<{
  open: boolean;
  supplierId: number | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingLinkedProducts, listLinkedProducts } = storeToRefs(useCatalogSupplierStore());

const showProductVariantsManage = ref<boolean>(false);
const showFormLinkedProduct = reactive<{
  open: boolean;
  catalog: IDataSupplierCatalog | null;
  variantID: null;
  supplierID: null;
}>({
  open: false,
  catalog: null,
  variantID: null,
  supplierID: null,
});
const showDescription = reactive({
  open: false as boolean,
  description: null as string | null,
});

const changeShowDescription = (open: boolean, description: string | null = null): void => {
  Object.assign(showDescription, {
    open,
    description,
  });
};
const startShowDescription = (description: string): void => {
  changeShowDescription(true, description);
};
const startEdit = (data: IDataSupplierCatalog) => {
  console.log('data', data);
  changeShowFormLinkedProduct(true, data);
};
const changeShowFormLinkedProduct = (
  show: boolean,
  catalog: IDataSupplierCatalog | null = null,
): void => {
  Object.assign(showFormLinkedProduct, {
    open: show,
    catalog: catalog,
  });
};
const changeShowProductVariantsManage = () => {
  showProductVariantsManage.value = !showProductVariantsManage.value;
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 sub-page column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Catálogo do fornecedor" icon="fa-solid fa-box" />
      </q-card-section>
      <q-card-section>
        <Loading :show="loadingLinkedProducts" />
        <div v-show="!loadingLinkedProducts">
          <TableLinkedProducts
            v-show="listLinkedProducts.length > 0"
            :supplierId="props.supplierId"
            @show:show-form-linked-products="startEdit"
            @show:show-description="startShowDescription"
          />
          <Empty
            v-show="listLinkedProducts.length <= 0"
            message="Sem produtos vinculados"
            color="bg-red-3"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            unelevated
            no-caps
            flat
          />
          <q-btn
            @click="changeShowProductVariantsManage()"
            color="primary"
            label="Adicionar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>

      <!-- Modals -->
      <Description :data="showDescription" @update:open="changeShowDescription(false)" />
      <FormLinkedProduct
        :data="showFormLinkedProduct"
        @update:open="changeShowFormLinkedProduct(false)"
      />
      <ProductsVariantsManage
        :open="showProductVariantsManage"
        :supplierId="props.supplierId"
        @update:open="changeShowProductVariantsManage"
      />
    </q-card>
  </q-dialog>
</template>
