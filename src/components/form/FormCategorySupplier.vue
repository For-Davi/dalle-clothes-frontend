<script setup lang="ts">
import { reactive, watch } from 'vue';
import { checkDataCategorySupplier } from 'src/composables/CheckData';
import { storeToRefs } from 'pinia';
import { createErrorData } from 'src/composables/CreateNotify';
import TitleAuth from '../shared/TitleAuth.vue';
import { useCategorySupplierStore } from 'src/stores/category-supplier-store';

defineOptions({
  name: 'FormCategorySupplier',
});

const props = defineProps<{
  mode: 'form' | 'list';
  dataEdit: ICategorySupplier | null;
}>();
const emit = defineEmits<{
  'update:back-list': [void];
}>();

const { loadingCategorySupplier } = storeToRefs(useCategorySupplierStore());

const dataCategory = reactive({
  name: '' as string,
});

const clear = (): void => {
  Object.assign(dataCategory, {
    name: '',
  });
};
const save = async () => {
  const check = checkDataCategorySupplier(dataCategory);
  if (check.status) {
    const response = await useCategorySupplierStore().createCategorySupplier(dataCategory.name);

    if (response?.status === 201) {
      emit('update:back-list');
      clear();
    }
  } else {
    createErrorData(check.message!);
  }
};
const update = async (): Promise<void> => {
  const response = await useCategorySupplierStore().updateCategorySupplier(
    props.dataEdit?.id ?? 0,
    dataCategory.name,
  );

  if (response?.status === 200) {
    emit('update:back-list');
    clear();
  }
};
const checkEditCategory = () => {
  if (props.dataEdit != null) {
    Object.assign(dataCategory, {
      name: props.dataEdit.name,
    });
  }
};

watch(
  () => props.mode,
  (mode) => {
    if (mode === 'form') {
      clear();
      checkEditCategory();
    }
  },
  { immediate: true },
);
</script>
<template>
  <q-card class="bg-grey-2" flat bordered>
    <q-card-section class="q-pa-none">
      <TitleAuth
        :title="props.dataEdit === null ? 'Cadastre uma categoria' : 'Atualize a categoria'"
      />
    </q-card-section>
    <q-card-section class="q-pa-sm">
      <q-form class="q-gutter-y-sm">
        <q-input
          v-model="dataCategory.name"
          bg-color="white"
          label-color="black"
          outlined
          label="Nome da categoria"
          dense
          input-class="text-black"
        >
          <template v-slot:prepend>
            <q-icon name="category" color="black" size="20px" />
          </template>
        </q-input>
      </q-form>
    </q-card-section>
    <q-card-actions align="right">
      <div class="row justify-end items-center q-gutter-x-sm">
        <q-btn
          v-if="props.dataEdit === null"
          @click="save"
          :loading="loadingCategorySupplier"
          color="primary"
          label="Salvar"
          size="md"
          unelevated
          no-caps
        />
        <q-btn
          v-else
          @click="update"
          :loading="loadingCategorySupplier"
          color="primary"
          label="Atualizar"
          size="md"
          unelevated
          no-caps
        />
      </div>
    </q-card-actions>
  </q-card>
</template>
