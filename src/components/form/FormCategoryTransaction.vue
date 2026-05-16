<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { checkDataCategoryTransaction } from 'src/composables/CheckData';
import { useCategoryTransactionStore } from 'src/stores/category-transaction-store';

defineOptions({
  name: 'FormCategoryTransaction',
});

const props = defineProps<{
  data: {
    open: boolean;
    category: ICategoryTransaction | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingCategoryTransaction } = storeToRefs(useCategoryTransactionStore());

const dataCategory = reactive({
  name: '' as string,
});

const clear = (): void => {
  Object.assign(dataCategory, {
    name: '',
  });
};
const save = async () => {
  const check = checkDataCategoryTransaction(dataCategory);
  if (check.status) {
    const response = await useCategoryTransactionStore().createCategoryTransaction(
      dataCategory.name,
    );
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados da categoria');
  }
};
const update = async () => {
  const check = checkDataCategoryTransaction(dataCategory);
  if (check.status) {
    const response = await useCategoryTransactionStore().updateCategoryTransaction(
      categoryID.value ?? 0,
      dataCategory.name,
    );
    if (response?.status === 200) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados da categoria');
  }
};
const checkDataEdit = () => {
  if (props.data.category) {
    Object.assign(dataCategory, {
      name: props.data.category.name,
    });
  }
};

const categoryID = computed(() => props.data.category?.id);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
    checkDataEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open" :maximized="$q.screen.lt.sm">
    <q-card
      class="bg-grey-2 column justify-between"
      style="width: 350px"
      :style="loadingCategoryTransaction ? 'min-height: 350px' : ''"
    >
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="categoryID ? 'Atualização de categoria' : 'Cadastro de categoria'"
          icon="list_alt"
        />
      </q-card-section>
      <Loading :show="loadingCategoryTransaction" />
      <q-card-section class="q-pa-sm" v-show="!loadingCategoryTransaction">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataCategory.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome da categoria"
            dense
            input-class="text-black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="category" color="black" size="20px" />
            </template>
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" v-show="!loadingCategoryTransaction">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            unelevated
            no-caps
          />
          <q-btn
            v-if="!categoryID"
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingCategoryTransaction"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingCategoryTransaction"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
