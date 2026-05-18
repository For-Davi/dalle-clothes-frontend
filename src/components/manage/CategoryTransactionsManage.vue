<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, watch } from 'vue';
import Loading from '../shared/Loading.vue';
import Empty from '../info/Empty.vue';
import { storeToRefs } from 'pinia';
import { useCategoryTransactionStore } from 'src/stores/category-transaction-store';
import FormCategoryTransaction from '../form/FormCategoryTransaction.vue';
import TableCategoryTransaction from '../table/TableCategoryTransaction.vue';

defineOptions({
  name: 'CategoryTransactionsManage',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingCategoryTransaction, listCategoryTransaction } = storeToRefs(
  useCategoryTransactionStore(),
);

const showFormCategoryTransaction = reactive<{
  open: boolean;
  category: ICategoryTransaction | null;
}>({
  open: false,
  category: null,
});

const clear = () => {
  Object.assign(showFormCategoryTransaction, {
    open: false,
    category: null,
  });
};
const startEdit = (data: ICategoryTransaction) => {
  changeShowFormCategoryTransaction(true, data);
};
const changeShowFormCategoryTransaction = (
  show: boolean,
  category: ICategoryTransaction | null = null,
): void => {
  Object.assign(showFormCategoryTransaction, {
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
        <TitlePage title="Categorias de transações" icon="category" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingCategoryTransaction">
          <TableCategoryTransaction
            v-show="listCategoryTransaction.length > 0"
            @show:show-form-category-transaction="startEdit"
          />
          <Empty
            v-show="listCategoryTransaction.length <= 0 && !loadingCategoryTransaction"
            message="Sem categorias cadastradas"
            color="bg-red-3"
          />
        </div>
        <Loading :show="loadingCategoryTransaction" />
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
            @click="changeShowFormCategoryTransaction(true)"
            color="primary"
            label="Adicionar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>

      <!-- Modals -->
      <FormCategoryTransaction
        :data="showFormCategoryTransaction"
        @update:open="changeShowFormCategoryTransaction(false)"
      />
    </q-card>
  </q-dialog>
</template>
