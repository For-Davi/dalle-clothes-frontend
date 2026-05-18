<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref } from 'vue';
import ColorManage from 'src/components/manage/ColorManage.vue';
import GridManage from 'src/components/manage/GridManage.vue';
import TagManage from 'src/components/manage/TagManage.vue';
import CategoryProductManage from 'src/components/manage/CategoryProductManage.vue';
import { actionsStock } from 'src/utils/actions';
import FormProduct from 'src/components/form/FormProduct.vue';
import { useProductStore } from 'src/stores/product-store';
import FilterProduct from 'src/components/filter/FilterProduct.vue';
import TableProduct from 'src/components/table/TableProduct.vue';
import FormVariant from 'src/components/form/FormVariant.vue';
import SupplierLinkedProductsManage from 'src/components/manage/SupplierLinkedProductsManage.vue';
import FormMovementProduct from 'src/components/form/FormMovementProduct.vue';
import Exports from 'src/components/export/Exports.vue';
import { exportProductsService } from 'src/services/product-service';
import ProductMovementManage from 'src/components/manage/ProductMovementManage.vue';

defineOptions({
  name: 'Stock',
});

const showExport = ref<boolean>(false);
const filterStock = ref<string>('');
const showFilterProduct = ref<boolean>(false);
const showFormMovementProduct = ref<boolean>(false);
const showColorManage = ref<boolean>(false);
const showGridManage = ref<boolean>(false);
const showTagManage = ref<boolean>(false);
const showCategoryProductManage = ref<boolean>(false);
const showSupplierLinkedProductManage = reactive<{
  open: boolean;
  variantID: number | null;
  supplierID: number | null;
}>({
  open: false,
  variantID: null,
  supplierID: null,
});
const showFormProduct = reactive<{
  open: boolean;
  productID: number | null;
}>({
  open: false,
  productID: null,
});
const showFormVariant = reactive<{
  open: boolean;
  variantID: number | null;
}>({
  open: false,
  variantID: null,
});
const showProductMovementManage = reactive<{
  open: boolean;
  variantID: number | null;
}>({
  open: false,
  variantID: null,
});
const filter = reactive<IFilterProduct>({
  name: '',
  sku: '',
  active: null,
  category: null,
  stockCritical: null,
});

const changeShowExport = () => {
  showExport.value = !showExport.value;
};
const changeShowSupplierLinkedProductManage = (
  show: boolean,
  variantID: number | null = null,
  supplierID: number | null = null,
) => {
  showSupplierLinkedProductManage.open = show;
  showSupplierLinkedProductManage.variantID = variantID;
  showSupplierLinkedProductManage.supplierID = supplierID;
};
const changeModalSupplierLinkedProductManage = (variantID: number, supplierID: number) => {
  changeShowSupplierLinkedProductManage(true, variantID, supplierID);
};
const changeShowFormProduct = (show: boolean, productID: number | null = null): void => {
  showFormProduct.open = show;
  showFormProduct.productID = productID;
};
const makeProductEdit = (productID: number) => {
  changeShowFormProduct(true, productID);
};
const changeShowFormVariant = (show: boolean, variantID: number | null = null): void => {
  showFormVariant.variantID = variantID;
  showFormVariant.open = show;
};
const changeShowProductMovementManage = (show: boolean, variantID: number | null = null): void => {
  showProductMovementManage.variantID = variantID;
  showProductMovementManage.open = show;
};
const startOpenProductMovementManage = (variantID: number) => {
  changeShowProductMovementManage(true, variantID);
};
const changeColorManage = (): void => {
  showColorManage.value = !showColorManage.value;
};
const changeFormMovementProduct = (): void => {
  showFormMovementProduct.value = !showFormMovementProduct.value;
};
const changeGridManage = (): void => {
  showGridManage.value = !showGridManage.value;
};
const changeTagManage = (): void => {
  showTagManage.value = !showTagManage.value;
};
const startExport = async () => {
  await exportProductsService({
    name: filter.name,
    sku: filter.sku,
    category: filter.category,
    active: filter.active,
    stockCritical: filter.stockCritical,
  });
};
const changeCategoryProductManage = (): void => {
  showCategoryProductManage.value = !showCategoryProductManage.value;
};
const openAction = (type: IActionStock): void => {
  switch (type) {
    case 'export':
      changeShowExport();
      break;
    case 'history':
      console.log('Exibindo histórico...');
      break;
    case 'grid':
      changeGridManage();
      break;
    case 'color':
      changeColorManage();
      break;
    case 'transaction':
      changeFormMovementProduct();
      break;
    case 'tag':
      changeTagManage();
      break;
    case 'category':
      changeCategoryProductManage();
      break;
  }
};
const changeShowFilterProduct = (): void => {
  showFilterProduct.value = !showFilterProduct.value;
};
const actionFilter = async (data: 'close' | IFilterProduct): Promise<void> => {
  changeShowFilterProduct();

  if (data !== 'close') {
    Object.assign(filter, {
      name: data.name,
      sku: data.sku,
      category: data.category,
      stockCritical: data.stockCritical,
      active: data.active,
    });
    await useProductStore().getProducts(filter);
  }
};
const makeEdit = (id: number): void => {
  changeShowFormVariant(true, id);
};
const clearFilter = (): void => {
  Object.assign(filter, {
    name: '',
    sku: '',
    active: null,
    category: null,
    stockCritical: null,
  });

  filterStock.value = '';
};
const makeShowFormVariant = (id: number): void => {
  changeShowFormProduct(false);
  changeShowFormVariant(true, id);
};
const fetchProducts = async (): Promise<void> => {
  await useProductStore().getProducts();
};

const hasFilter = computed(() => {
  return (
    (filter.name !== '' && filter.name !== null) ||
    (filter.sku !== '' && filter.sku !== null) ||
    filter.category != null ||
    filter.active != null ||
    filter.stockCritical != null
  );
});
</script>
<template>
  <main class="q-pa-lg">
    <section class="page-header q-mb-xs">
      <TitlePage title="Estoque" icon="inventory" />
      <div class="page-header-actions">
        <q-btn
          @click="changeShowFormProduct(true)"
          color="white"
          text-color="black"
          label="Novo produto"
          icon-right="add"
          no-caps
        />
        <q-btn-dropdown class="q-pa-none q-px-md" label="Ações" no-caps auto-close>
          <q-list dense>
            <q-item
              clickable
              v-ripple
              v-for="(item, index) in actionsStock"
              :key="index"
              @click="openAction(item.type)"
            >
              <q-item-section avatar>
                <q-avatar>
                  <q-icon :name="item.icon" />
                </q-avatar>
              </q-item-section>
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </section>
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm justify-end items-center">
          <q-input
            label="Pesquise"
            outlined
            v-model="filterStock"
            dense
            class="search-input bg-white rounded-borders"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="20px" color="black" />
            </template>
          </q-input>
          <q-btn
            @click="changeShowFilterProduct"
            round
            color="primary"
            icon="filter_alt"
            unelevated
            size="13px"
          >
            <q-badge v-show="hasFilter" floating color="red" rounded />
          </q-btn>
        </div>
      </q-banner>
      <TableProduct
        :filter="filterStock"
        @show:show-form-variant="makeEdit"
        @clear-filter="clearFilter"
        @show:show-modal-supplier="changeModalSupplierLinkedProductManage"
        @show:product-movement="startOpenProductMovementManage"
      />
    </section>

    <!-- Modals -->
    <ProductMovementManage
      :data="showProductMovementManage"
      @update:open="changeShowProductMovementManage(false)"
    />
    <Exports
      :open="showExport"
      title="Exportação de produtos"
      message="Deseja exportar os produtos que estão sendo visualizados agora?"
      :allowExcel="true"
      :allowPdf="false"
      @update:open="changeShowExport"
      @choose-format="startExport"
    />
    <SupplierLinkedProductsManage
      :data="showSupplierLinkedProductManage"
      @update:open="changeShowSupplierLinkedProductManage(false)"
    />
    <ColorManage :open="showColorManage" @update:open="changeColorManage" />
    <GridManage :open="showGridManage" @update:open="changeGridManage" />
    <TagManage :open="showTagManage" @update:open="changeTagManage" />
    <CategoryProductManage
      :open="showCategoryProductManage"
      @update:open="changeCategoryProductManage"
    />
    <FormProduct
      :data="showFormProduct"
      @update:open="changeShowFormProduct(false)"
      @show:show-form-variant="makeShowFormVariant"
    />
    <FilterProduct :open="showFilterProduct" :filters="filter" @update:open="actionFilter" />
    <FormVariant
      :data="showFormVariant"
      @update:open="changeShowFormVariant(false)"
      @update:open-form-product="makeProductEdit"
    />
    <FormMovementProduct
      :open="showFormMovementProduct"
      @update:open="changeFormMovementProduct()"
      @new-request="fetchProducts"
    />
  </main>
</template>
