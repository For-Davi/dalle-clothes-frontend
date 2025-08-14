<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMovementStore } from 'src/stores/movement-store';
import { useCategoryTransactionStore } from 'src/stores/category-transaction-store';
import Loading from '../shared/Loading.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { checkDataMovement } from 'src/composables/CheckData';

defineOptions({
  name: 'FormMovementProduct',
});

const props = defineProps<{
    open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingMovement } = storeToRefs(useMovementStore());
const { loadingCategoryTransaction, listCategoryTransaction } = storeToRefs(
  useCategoryTransactionStore(),
);

const dataMovement = reactive({
  value: '' as string,
  date: '' as string,
  description: '' as string,
});
const selectedCategory = ref<IQuasarSelect<number | null> | null>({
  label: 'Sem categoria',
  value: null,
});
const selectedType = ref<IQuasarSelect<'entry' | 'out'>>({
  label: 'Entrada 🟩',
  value: 'entry',
});

const clear = (): void => {
  Object.assign(dataMovement, {
    value: '',
    date: '',
    description: '',
  });

  selectedType.value = {
    label: 'Entrada 🟩',
    value: 'entry',
  };
};


const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const isLoading = computed(() => {
  return loadingMovement.value || loadingCategoryTransaction.value;
});
const optionsType = computed(() => {
  return [
    {
      label: 'Entrada 🟩',
      value: 'entry',
    },
    {
      label: 'Saída 🟥',
      value: 'out',
    },
  ];
});

watch(open, async () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      class="bg-grey-2 form-basic column justify-between"
      style="width: 800px; max-width: 98vw"
    >
      <q-card-section class="q-pa-none">
        <TitlePage
          title="Atualização de estoque"
          icon="sync_alt"
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading :show="isLoading" />
        <q-form class="q-gutter-y-sm column full-width" v-show="!isLoading">
          <q-select
            v-model="selectedType"
            outlined
            bg-color="white"
            label-color="black"
            :options="optionsType"
            label="Selecitone o tipo"
            map-options
            dense
            options-dense
          >
            <template v-slot:prepend>
              <q-icon name="checklist" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataMovement.value"
            bg-color="white"
            label-color="black"
            outlined
            label="R$ Valor"
            dense
            input-class="text-black no-spinners"
            type="text"
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataMovement.date"
            bg-color="white"
            label-color="black"
            outlined
            label="Data de movimentação"
            dense
            input-class="text-black no-spinners"
            mask="##/##/####"
          >
            <template v-slot:prepend>
              <q-icon name="calendar_today" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-if="!movementID"
            v-model="selectedQuantity"
            outlined
            bg-color="white"
            label-color="black"
            :options="optionsQuantity"
            map-options
            label="Quantidade de lançamentos"
            options-dense
            dense
          >
            <template v-slot:prepend>
              <q-icon name="checklist" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-model="selectedCategory"
            outlined
            bg-color="white"
            label-color="black"
            :options="getOptionsCategories"
            map-options
            :label="getlabelCategory"
            dense
            options-dense
          >
            <template v-slot:prepend>
              <q-icon name="checklist" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataMovement.description"
            bg-color="white"
            label-color="black"
            outlined
            label="Descrição"
            dense
            input-class="text-black no-resize"
            type="textarea"
            counter
            :maxlength="500"
          >
            <template v-slot:prepend>
              <q-icon name="description" color="black" size="20px" />
            </template>
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center full-width">
          <q-btn
            @click="open = false"
            flat
            color="red"
            label="Fechar"
            size="md"
            unelevated
            no-caps
            class="q-mr-sm"
          />
          <q-btn
            v-if="!movementID"
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="isLoading"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="isLoading"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
