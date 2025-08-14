<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { useMovementStore } from 'src/stores/movement-store';
import { useCategoryTransactionStore } from 'src/stores/category-transaction-store';

defineOptions({
  name: 'FilterMovement',
});

const props = defineProps<{
  open: boolean;
  filters: IFilterMovement;
}>();
const emit = defineEmits<{
  'update:open': ['close' | IFilterMovement];
}>();

const { loadingMovement } = storeToRefs(useMovementStore());
const { loadingCategoryTransaction, listCategoryTransaction } = storeToRefs(
  useCategoryTransactionStore(),
);

const loading = ref<boolean>(false);
const dataMovement = reactive({
  startDate: '' as string,
  endDate: '' as string,
});
const selectedCategory = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const selectedType = ref<IQuasarSelect<'all' | 'entry' | 'out'>>({
  label: 'Todos',
  value: 'all',
});

const open = computed({
  get: () => props.open,
  set: (state: IFilterMovement | 'close') => emit('update:open', state),
});

const clear = (): void => {
  Object.assign(dataMovement, {
    startDate: '',
    endDate: '',
  });

  selectedCategory.value = {
    label: 'Todos',
    value: null,
  };
  selectedType.value = {
    label: 'Todos',
    value: 'all',
  };
};
const fetchCategories = async () => {
  await useCategoryTransactionStore().getCategoriesTransaction();
};
const changeLoading = (): void => {
  loading.value = !loading.value;
};
const mountFilter = () => {
  Object.assign(dataMovement, {
    startDate: props.filters.startDate ?? '',
    endDate: props.filters.endDate ?? '',
  });

  const selectedCategoryItem = listCategoryTransaction.value.find(
    (item) => item.id === props.filters.category,
  );
  selectedCategory.value = selectedCategoryItem
    ? { label: selectedCategoryItem?.name, value: selectedCategoryItem?.id }
    : { label: 'Todos', value: null };
};
const search = () => {
  const data = {
    startDate: dataMovement.startDate,
    endDate: dataMovement.endDate,
    type: selectedType.value.value,
    category: selectedCategory.value.value,
  };

  emit('update:open', data);
};

const optionsCategories = computed(() => {
  return [
    {
      label: 'Todos',
      value: null,
    },
    ...listCategoryTransaction.value.map((item) => ({
      label: item.name,
      value: item.id,
    })),
  ];
});
const optionsType = computed(() => {
  return [
    {
      label: 'Todos',
      value: 'all',
    },
    {
      label: 'Entrada',
      value: 'entry',
    },
    {
      label: 'Saída',
      value: 'out',
    },
  ];
});
const isLoading = computed((): boolean => {
  return loading.value || loadingCategoryTransaction.value || loadingMovement.value;
});

watch(open, async () => {
  if (open.value) {
    clear();
    changeLoading();
    await fetchCategories();
    mountFilter();
    changeLoading();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Filtro de movimentações" icon="sync_alt" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading :show="isLoading" />
        <q-form v-show="!isLoading" class="q-gutter-y-sm">
          <q-input
            v-model="dataMovement.startDate"
            bg-color="white"
            label-color="black"
            outlined
            label="Data de início (mm/yyyy)"
            dense
            input-class="text-black no-spinners"
            mask="##/####"
          >
            <template v-slot:prepend>
              <q-icon name="calendar_today" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataMovement.endDate"
            bg-color="white"
            label-color="black"
            outlined
            label="Data de fim (mm/yyyy)"
            dense
            input-class="text-black no-spinners"
            mask="##/####"
          >
            <template v-slot:prepend>
              <q-icon name="calendar_today" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            outlined
            v-model="selectedCategory"
            label="Filtre por categoria"
            :options="optionsCategories"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="category" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            outlined
            v-model="selectedType"
            label="Filtre por tipo"
            :options="optionsType"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="check" color="black" size="20px" />
            </template>
          </q-select>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="emit('update:open', 'close')"
            unelevated
            no-caps
          />
          <q-btn
            v-show="!isLoading"
            @click="clear"
            color="secondary"
            label="Limpar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-show="!isLoading"
            @click="search"
            color="primary"
            label="Filtrar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
