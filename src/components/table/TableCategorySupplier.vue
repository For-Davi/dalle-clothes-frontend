<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { columnsCategorySupplier } from 'src/utils/columns';
import { storeToRefs } from 'pinia';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import { useCategorySupplierStore } from 'src/stores/category-supplier-store';
import Loading from '../shared/Loading.vue';

defineOptions({
  name: 'TableCategorySupplier',
});

const emit = defineEmits<{
  'show:showFormCategory': [ICategorySupplier];
}>();

const { loadingCategorySupplier, listCategorySupplier } = storeToRefs(useCategorySupplierStore());

const showConfirmAction = ref<boolean>(false);
const categoryMonitoring = ref<number | null>(null);
const filter = ref<string>('');

const clear = (): void => {
  categoryMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useCategorySupplierStore().deleteCategorySupplier(categoryMonitoring.value ?? 0);
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  categoryMonitoring.value = id;
  showConfirmAction.value = true;
};
const startEdit = (data: ICategorySupplier) => {
  emit('show:showFormCategory', data);
};
const startExclude = (id: number) => {
  openConfirmAction(id);
};
const fetchCategories = async (): Promise<void> => {
  await useCategorySupplierStore().getCategoriesSupplier();
};

onMounted(async () => {
  await fetchCategories();
});
</script>
<template>
  <section style="min-height: 300px">
    <q-table
      v-show="!loadingCategorySupplier"
      :rows="loadingCategorySupplier ? [] : listCategorySupplier"
      :columns="columnsCategorySupplier"
      :filter="filter"
      :loading="loadingCategorySupplier"
      title="Lista de categorias"
      row-key="index"
      no-data-label="Nenhuma categoria para mostrar"
      virtual-scroll
      :rows-per-page-options="[10]"
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
          <span class="text-body1">Lista de categorias</span>
          <q-space />
          <q-input
            v-show="listCategorySupplier.length > 0"
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
          <q-td key="action" :props="props">
            <q-btn
              @click="startEdit(props.row)"
              :disable="categoryMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="black"
              icon="edit"
            />
            <q-btn
              @click="startExclude(props.row.id)"
              :disable="categoryMonitoring === props.row.id"
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
    <Loading :show="loadingCategorySupplier" />

    <!-- Modals -->
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
