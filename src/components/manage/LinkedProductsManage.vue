<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, ref } from 'vue';
import Loading from '../shared/Loading.vue';
import Empty from '../info/Empty.vue';
import { storeToRefs } from 'pinia';
import { useCatalogSupplierStore } from 'src/stores/catalog-supplier-store';
import TableLinkedProducts from '../table/TableLinkedProducts.vue';
import ProductsVariantsManage from './ProductsVariantsManage.vue';

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

const showProductVariantsManage = ref<boolean>(false)


// const startEdit = (data: ISupplierCatalog) => {
//   changeShowProductVariantsManage(true, data);
// };
const changeShowProductVariantsManage = () => {
  showProductVariantsManage.value = !showProductVariantsManage.value;
}

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 sub-page column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Catálogo do fornecedor" icon="colorize" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingLinkedProducts">
          <TableLinkedProducts
            v-show="listLinkedProducts.length > 0"
            :supplierId="props.supplierId"
          />
          <Empty
            v-show="listLinkedProducts.length <= 0"
            message="Sem produtos vinculados"
            color="bg-red-3"
          />
        </div>
        <Loading v-show="loadingLinkedProducts" :show="loadingLinkedProducts" />
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

      <ProductsVariantsManage
        :open="showProductVariantsManage"
        :supplierId="props.supplierId"
        @update:open="changeShowProductVariantsManage()"
      />
    </q-card>
  </q-dialog>
</template>
