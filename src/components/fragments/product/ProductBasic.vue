<script setup lang="ts">
import type { QuasarSelect } from 'src/types/Quasar';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed } from 'vue';
import { useCategoryProductStore } from 'src/stores/category-product-store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'ProductBasic',
});

const props = defineProps<{
  loading: boolean;
}>();
const model = defineModel<IVModelProductBasic>({ required: true });

const { listCategoryProduct } = storeToRefs(useCategoryProductStore());

const optionsType = computed((): QuasarSelect<string>[] => {
  return [
    {
      label: 'Produto',
      value: 'product',
    },
    {
      label: 'Serviço',
      value: 'service',
    },
  ];
});
const optionsCategory = computed((): QuasarSelect<number | null>[] => {
  return [
    {
      label: 'Nenhuma selecionada',
      value: null,
    },
    ...listCategoryProduct.value.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    }),
  ];
});
</script>
<template>
  <q-card class="bg-grey-2 column justify-between" bordered flat>
    <q-card-section class="q-pa-none">
      <TitlePage title="Dados básicos" icon="list_alt" />
    </q-card-section>
    <Loading :show="props.loading" />
    <q-card-section class="q-pa-sm" v-show="!props.loading">
      <q-form class="q-gutter-y-sm column">
        <q-input
          v-model="model.name"
          bg-color="white"
          label-color="black"
          outlined
          :label="model.type.value === 'product' ? 'Nome do produto' : 'Nome do serviço'"
          dense
          input-class="text-black"
          class="full-width"
        >
          <template v-slot:prepend>
            <q-icon name="colorize" color="black" size="20px" />
          </template>
        </q-input>
        <div class="row justify-between">
          <q-select
            v-model="model.type"
            :options="optionsType"
            label="Selecione o tipo"
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
            class="input-divider"
          >
            <template v-slot:prepend>
              <q-icon name="info" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-model="model.category"
            :options="optionsCategory"
            label="Selecione a categoria"
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
            class="input-divider"
          >
            <template v-slot:prepend>
              <q-icon name="info" color="black" size="20px" />
            </template>
          </q-select>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
