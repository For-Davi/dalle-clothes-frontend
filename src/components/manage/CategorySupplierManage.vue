<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive } from 'vue';
import FormCategorySupplier from '../form/FormCategorySupplier.vue';
import TableCategorySupplier from '../table/TableCategorySupplier.vue';
import { useCategorySupplierStore } from 'src/stores/category-supplier-store';
import { storeToRefs } from 'pinia';
import Empty from '../info/Empty.vue';
import Loading from '../shared/Loading.vue';

defineOptions({
  name: 'DepartmentManage',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const showFormCategorySupplier = reactive<{
  open: boolean;
  categoryEdit: ICategorySupplier | null;
}>({
  open: false,
  categoryEdit: null,
});

const { loadingCategorySupplier, listCategorySupplier } = storeToRefs(useCategorySupplierStore());

const changeShowCategorySupplierManage = (
  show: boolean,
  categoryEdit: ICategorySupplier | null = null,
): void => {
  Object.assign(showFormCategorySupplier, {
    open: show,
    categoryEdit: categoryEdit,
  });
};

const startEdit = (categoryEdit: ICategorySupplier) => {
  changeShowCategorySupplierManage(true, categoryEdit);
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
        <TitlePage title="Categorias de fornecedores" icon="group_work" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingCategorySupplier">
          <TableCategorySupplier
            v-show="listCategorySupplier.length > 0"
            @show:show-form-category="startEdit"
          />
          <Empty
            v-show="listCategorySupplier.length <= 0 && !loadingCategorySupplier"
            message="Sem categorias cadastradas"
            color="bg-red-3"
          />
        </div>
        <Loading :show="loadingCategorySupplier" />
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            flat
            no-caps
            unelevated
          />
          <q-btn
            color="primary"
            label="Adicionar"
            size="md"
            @click="changeShowCategorySupplierManage(true)"
            no-caps
            unelevated
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Modals -->
  <FormCategorySupplier
    :open="showFormCategorySupplier.open"
    :data-edit="showFormCategorySupplier.categoryEdit"
    @update:back-list="changeShowCategorySupplierManage(false)"
  />
</template>
