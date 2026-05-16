<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, watch } from 'vue';
import Loading from '../shared/Loading.vue';
import Empty from '../info/Empty.vue';
import { storeToRefs } from 'pinia';
import { useCategoryProductStore } from 'src/stores/category-product-store';
import FormCategoryProduct from '../form/FormCategoryProduct.vue';
import TableCategoryProduct from '../table/TableCategoryProduct.vue';

defineOptions({
  name: 'CategoryProductManage',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingCategoryProduct, listCategoryProduct } = storeToRefs(useCategoryProductStore());

const showFormCategoryProduct = reactive<{
  open: boolean;
  category: ICategoryProduct | null;
}>({
  open: false,
  category: null,
});

const clear = () => {
  Object.assign(showFormCategoryProduct, {
    open: false,
    category: null,
  });
};
const startEdit = (data: ICategoryProduct) => {
  changeShowFormCategoryProduct(true, data);
};
const changeShowFormCategoryProduct = (
  show: boolean,
  category: ICategoryProduct | null = null,
): void => {
  Object.assign(showFormCategoryProduct, {
    open: show,
    category: category,
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
  <q-dialog v-model="open" :maximized="$q.screen.lt.sm">
    <q-card class="bg-grey-2 sub-page column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Categorias de produtos" icon="colorize" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingCategoryProduct">
          <TableCategoryProduct
            v-show="listCategoryProduct.length > 0"
            @show:show-form-category-product="startEdit"
          />
          <Empty
            v-show="listCategoryProduct.length <= 0"
            message="Sem categorias cadastradas"
            color="bg-red-3"
          />
        </div>
        <Loading v-show="loadingCategoryProduct" :show="loadingCategoryProduct" />
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
            @click="changeShowFormCategoryProduct(true)"
            color="primary"
            label="Adicionar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>

      <!-- Modals -->
      <FormCategoryProduct
        :data="showFormCategoryProduct"
        @update:open="changeShowFormCategoryProduct(false)"
      />
    </q-card>
  </q-dialog>
</template>
