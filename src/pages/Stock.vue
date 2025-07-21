<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { reactive, ref } from 'vue';
import ColorManage from 'src/components/manage/ColorManage.vue';
import GridManage from 'src/components/manage/GridManage.vue';
import TagManage from 'src/components/manage/TagManage.vue';
import CategoryProductManage from 'src/components/manage/CategoryProductManage.vue';
import { actionsStock } from 'src/utils/actions';
import FormProduct from 'src/components/form/FormProduct.vue';

defineOptions({
  name: 'Stock',
});

const filterStock = ref<string>('');
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
const columnsStock = reactive<IQuasarTable[]>([
  {
    name: 'code',
    label: 'Código',
    field: 'code',
    align: 'left',
  },
  {
    name: 'sku',
    label: 'SKU',
    field: 'sku',
    align: 'left',
  },
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'measure',
    label: 'Medida',
    field: 'measure',
    align: 'left',
  },
  {
    name: 'quantity',
    label: 'Quantidade',
    field: 'quantity',
    align: 'left',
  },
  {
    name: 'price_average_cost',
    label: 'Custo médio',
    field: 'price_average_cost',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);
const rows = [
  {
    code: '100',
    sku: 'CAM-P-BLCK-01',
    name: 'Camisa Dragon Black P',
    measure: 'UND',
    quantity: 150,
    price_average_cost: 11.66,
  },

  {
    code: '101',
    sku: 'CAM-M-BLCK-01',
    name: 'Camisa Dragon Black M',
    measure: 'UND',
    quantity: 140,
    price_average_cost: 15.6,
  },

  {
    code: '102',
    sku: 'CAM-G-BLCK-01',
    name: 'Camisa Dragon Black G',
    measure: 'UND',
    quantity: 105,
    price_average_cost: 22.6,
  },
];

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
          <q-btn round color="primary" icon="filter_alt" unelevated size="13px">
            <q-badge floating color="red" rounded />
          </q-btn>
        </div>
      </q-banner>
      <q-table
        :rows="rows"
        :columns="columnsStock"
        :filter="filterStock"
        :loading="false"
        title="Gerenciamento de estoque"
        row-key="index"
        no-data-label="Nenhum dado para mostrar"
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
          <!-- Cor vermelha para item com estoque baixo -->
          <q-tr :props="props" :class="props.row.code == 100 ? 'text-red' : ''">
            <q-td key="code" :props="props" class="text-left">
              {{ props.row.code }}
            </q-td>
            <q-td key="sku" :props="props" class="text-left">
              {{ props.row.sku }}
            </q-td>
            <q-td key="name" :props="props" class="text-left">
              {{ props.row.name }}
            </q-td>
            <q-td key="measure" :props="props" class="text-left">
              {{ props.row.measure }}
            </q-td>
            <q-td key="quantity" :props="props" class="text-left">
              {{ props.row.quantity }}
              <q-btn
                outline
                flat
                round
                color="primary"
                icon="search"
                dense
                size="sm"
                class="q-ml-sm"
              />
            </q-td>
            <q-td key="price_average_cost" :props="props" class="text-left">
              R$ {{ props.row.price_average_cost }}
            </q-td>
            <q-td key="active" :props="props" class="text-left">
              <q-icon
                :name="props.row.active === 1 ? 'check_circle' : 'close'"
                :color="props.row.active === 1 ? 'green' : 'red'"
                size="17px"
              />
            </q-td>
            <q-td key="action" :props="props">
              <q-btn :disable="false" size="sm" flat round color="green" icon="local_shipping">
                <q-tooltip>Fornecedores</q-tooltip>
              </q-btn>
              <q-btn :disable="false" size="sm" flat round color="blue" icon="history">
                <q-tooltip>Histórico</q-tooltip>
              </q-btn>
              <q-btn :disable="false" size="sm" flat round color="black" icon="edit">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn :disable="false" size="sm" flat round color="red" icon="delete">
                <q-tooltip>Excluir</q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </section>

    <!-- Modals -->
    <ColorManage :open="showColorManage" @update:open="changeColorManage" />
    <GridManage :open="showGridManage" @update:open="changeGridManage" />
    <TagManage :open="showTagManage" @update:open="changeTagManage" />
    <CategoryProductManage
      :open="showCategoryProductManage"
      @update:open="changeCategoryProductManage"
    />
    <FormProduct :data="showFormProduct" @update:open="changeShowFormProduct(false)" />
  </main>
</template>
