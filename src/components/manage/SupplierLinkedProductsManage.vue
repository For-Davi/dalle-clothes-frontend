<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive } from 'vue';
import Loading from '../shared/Loading.vue';
import Empty from '../info/Empty.vue';
import { storeToRefs } from 'pinia';
import { useCatalogSupplierStore } from 'src/stores/catalog-supplier-store';
import SupplierDetails from '../details/SupplierDetails.vue';
import TableSupplierLinkedProducts from '../table/TableSupplierLinkedProducts.vue';

defineOptions({
  name: 'SupplierLinkedProductsManage',
});

const props = defineProps<{
  data: {
    open: boolean;
    supplierID: number | null;
    variantID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingLinkedProducts, listLinkedProducts } = storeToRefs(useCatalogSupplierStore());

const showSuppplierDetails = reactive<{
  open: boolean;
  supplierID: number | null;
}>({
  open: false,
  supplierID: null,
});

const startOpenDetails = (id: number) => {
  changeShowSuppplierDetails(true, id);
};
const changeShowSuppplierDetails = (show: boolean, supplierID: number | null = null): void => {
  Object.assign(showSuppplierDetails, {
    open: show,
    supplierID: supplierID,
  });
};

const variantID = computed(() => props.data.variantID);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
</script>
<template>
  <q-dialog v-model="open" :maximized="$q.screen.lt.sm">
    <q-card class="bg-grey-2 sub-page column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Fornecedores vinculados" icon="category" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingLinkedProducts">
          <TableSupplierLinkedProducts
            v-show="listLinkedProducts.length > 0"
            :variantID="variantID!"
            @show:show-details-supplier="startOpenDetails"
          />
          <Empty
            v-show="listLinkedProducts.length <= 0 && !loadingLinkedProducts"
            message="Sem fornecedores vinculados"
            color="bg-red-3"
          />
        </div>
        <Loading :show="loadingLinkedProducts" />
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn color="red" label="Fechar" size="md" @click="open = false" unelevated no-caps />
        </div>
      </q-card-actions>

      <!-- Modals -->
      <SupplierDetails
        :data="showSuppplierDetails"
        @update:open="changeShowSuppplierDetails(false)"
      />
    </q-card>
  </q-dialog>
</template>
