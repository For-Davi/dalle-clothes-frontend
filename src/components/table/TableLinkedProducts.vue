<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import Loading from '../shared/Loading.vue';
import { columnsLinkedProducts } from 'src/utils/columns';
import { useCatalogSupplierStore } from 'src/stores/catalog-supplier-store';

defineOptions({
  name: 'TableLinkedProducts',
});

const props = defineProps<{
    supplierId: number | null
}>()
// const emit = defineEmits<{
//   'show:showFormCategoryTransaction': [ICategoryTransaction];
// }>();


const { loadingLinkedProducts, listLinkedProducts } = storeToRefs(
  useCatalogSupplierStore(),
);

const showConfirmAction = ref<boolean>(false);
const linkedProductMonitoring = ref<number | null>(null);
const filter = ref<string>('');

const clear = (): void => {
  linkedProductMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  // await useCatalogSupplierStore().deleteLinkedProductSupplier(linkedProductMonitoring.value, props.supplierId);
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
   linkedProductMonitoring.value = id;
  showConfirmAction.value = true;
};
// const startEdit = (data: ICategoryTransaction) => {
//   emit('show:showFormCategoryTransaction', data);
// };
const startExclude = (id: number) => {
  openConfirmAction(id);
};
const fetchLinkedProducts = async (): Promise<void> => {
  await useCatalogSupplierStore().getLinkedProducts(props.supplierId);
};

onMounted(async () => {
  await fetchLinkedProducts();
});
</script>
<template>
  <section style="min-height: 300px">
    <q-table
      v-show="!loadingLinkedProducts"
      :rows="loadingLinkedProducts ? [] : listLinkedProducts"
      :columns="columnsLinkedProducts"
      :filter="filter"
      :loading="loadingLinkedProducts"
      title="Lista de produtos vinculados"
      row-key="index"
      no-data-label="Nenhum produto vinculado para mostrar"
      virtual-scroll
      :rows-per-page-options="[6]"
      style="height: 460px"
      bordered
      flat
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
          <span class="text-body1">Lista de produtos vinculados</span>
          <q-space />
          <q-input
            v-show="listLinkedProducts.length > 0"
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
            {{ props.row.name }}
          </q-td>
           <q-td key="price" :props="props" class="text-left">
            {{ props.row.price }}
          </q-td>
           <q-td key="sku" :props="props" class="text-left">
            {{ props.row.sku }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              @click="startEdit(props.row)"
              :disable="linkedProductMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="black"
              icon="edit"
            />
            <q-btn
              @click="startExclude(props.row.product_variant_id)"
              :disable="linkedProductMonitoring === props.row.id"
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

    <!-- Modals -->
    <Loading :show="loadingLinkedProducts" />
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão de categoria"
      message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá a categoria permanentemente."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
