<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, watch } from 'vue';
import Loading from '../shared/Loading.vue';
import Empty from '../info/Empty.vue';
import { storeToRefs } from 'pinia';
import { useProductStore } from 'src/stores/product-store';
import TableListVariants from '../table/TableListVariants.vue';

defineOptions({
  name: 'ProductsVariantsManage',
});

const props = defineProps<{
  open: boolean;
  supplierId: number | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingProduct, listProduct } = storeToRefs(useProductStore());

const showFormLinkedProduct = reactive<{
  open: boolean;
  catalog: IDataSupplierCatalog | null;
}>({
  open: false,
  catalog: null,
});

const clear = () => {
  Object.assign(showFormLinkedProduct, {
    open: false,
    catalog: null,
  });
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 sub-page column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Produtos e variantes" icon="colorize" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingProduct">
          <TableListVariants
            v-show="listProduct.length > 0"
            :supplierId="props.supplierId"
          />
          <Empty
            v-show="listProduct.length <= 0"
            message="Sem variantes de produtos"
            color="bg-red-3"
          />
        </div>
        <Loading v-show="loadingProduct" :show="loadingProduct" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
