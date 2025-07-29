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

defineOptions({
  name: 'Stock',
});

const filterStock = ref<string>('');
const showFilterProduct = ref<boolean>(false);
const showColorManage = ref<boolean>(false);
const showGridManage = ref<boolean>(false);
const showTagManage = ref<boolean>(false);
const showCategoryProductManage = ref<boolean>(false);
const showFormProduct = reactive<{
  open: boolean;
  productID: number | null;
}>({
  open: false,
  productID: null,
});
const filter = reactive<IFilterProduct>({
  name: '',
  sku: '',
  active: null,
  category: null,
  stockCritical: null,
});

const changeShowFormProduct = (show: boolean, productID: number | null = null): void => {
  showFormProduct.productID = productID;
  showFormProduct.open = show;
};
const changeColorManage = (): void => {
  showColorManage.value = !showColorManage.value;
};
const changeGridManage = (): void => {
  showGridManage.value = !showGridManage.value;
};
const changeTagManage = (): void => {
  showTagManage.value = !showTagManage.value;
};
const changeCategoryProductManage = (): void => {
  showCategoryProductManage.value = !showCategoryProductManage.value;
};
const openAction = (type: IActionStock): void => {
  switch (type) {
    case 'export':
      console.log('Exportando...');
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
      console.log('Mostrando transações...');
      break;
    case 'tag':
      changeTagManage();
      break;
    case 'category':
      changeCategoryProductManage();
      break;
    default:
      console.warn(`Ação desconhecida: ${type}`);
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
  changeShowFormProduct(true, id);
};
const clearFilter = (): void => {
  Object.assign(filter, {
    name: '',
    sku: '',
    active: null,
    category: null,
    stockCritical: null,
  });
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
    <section class="row items-center justify-between">
      <TitlePage class="col" title="Estoque" icon="inventory" />
      <div>
        <q-btn
          @click="changeShowFormProduct(true)"
          color="white"
          text-color="black"
          label="Novo produto"
          icon-right="add"
          no-caps
          class="q-mr-sm"
        />
        <q-btn-dropdown class="q-pa-none q-px-md q-mr-sm" label="Ações" no-caps auto-close>
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
            style="width: 200px"
            class="bg-white rounded-borders"
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
        @show:show-form-supplier="makeEdit"
        @clear-filter="clearFilter"
      />
    </section>

    <!-- Modals -->
    <CategoryProductManage
      :open="showCategoryProductManage"
      @update:open="changeCategoryProductManage"
    />
    <ColorManage :open="showColorManage" @update:open="changeColorManage" />
    <GridManage :open="showGridManage" @update:open="changeGridManage" />
    <TagManage :open="showTagManage" @update:open="changeTagManage" />
    <FormProduct :data="showFormProduct" @update:open="changeShowFormProduct(false)" />
    <FilterProduct :open="showFilterProduct" :filters="filter" @update:open="actionFilter" />
  </main>
</template>
