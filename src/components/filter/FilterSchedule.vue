<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { useScheduleStore } from 'src/stores/schedule-store';
import { useCategoryTransactionStore } from 'src/stores/category-transaction-store';

defineOptions({
  name: 'FilterSchedule',
});

const props = defineProps<{
  open: boolean;
  filters: IFilterSchedule;
}>();
const emit = defineEmits<{
  'update:open': ['close' | IFilterSchedule];
}>();

const { loadingSchedule, listSchedulePeriod } = storeToRefs(useScheduleStore());
const { loadingCategoryTransaction, listCategoryTransaction } = storeToRefs(
  useCategoryTransactionStore(),
);

const loading = ref<boolean>(false);
const selectedCategory = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const selectedPeriod = ref<IQuasarSelect<string | null>>({
  label: 'Mês atual',
  value: null,
});
const selectedType = ref<IQuasarSelect<'all' | 'entry' | 'out'>>({
  label: 'Todos',
  value: 'all',
});

const open = computed({
  get: () => props.open,
  set: (state: IFilterSchedule | 'close') => emit('update:open', state),
});

const clear = (): void => {
  selectedCategory.value = {
    label: 'Todos',
    value: null,
  };
  selectedPeriod.value = {
    label: 'Mês atual',
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
const fetchPeriods = async () => {
  await useScheduleStore().getSchedulePeriod();
};
const changeLoading = (): void => {
  loading.value = !loading.value;
};
const mountFilter = () => {
  const selectedCategoryItem = listCategoryTransaction.value.find(
    (item) => item.id === props.filters.category,
  );

  selectedCategory.value = selectedCategoryItem
    ? { label: selectedCategoryItem?.name, value: selectedCategoryItem?.id }
    : { label: 'Todos', value: null };

  selectedType.value = {
    label:
      props.filters.type === 'all' ? 'Todos' : props.filters.type === 'entry' ? 'Entrada' : 'Saída',
    value: props.filters.type,
  };

  selectedPeriod.value = {
    label: props.filters.period ?? 'Mês atual',
    value: props.filters.period,
  };
};
const search = () => {
  const data = {
    period: selectedPeriod.value.value,
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
const optionsPeriods = computed(() => {
  const currentPeriod = new Date()
    .toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })
    .replace('/', '-');

  return [
    {
      label: 'Mês atual',
      value: null,
    },
    ...listSchedulePeriod.value
      .filter((item) => item !== currentPeriod)
      .map((item) => ({
        label: item.replace(/-/g, '/'),
        value: item.replace(/-/g, '/'),
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
  return loading.value || loadingCategoryTransaction.value || loadingSchedule.value;
});

watch(open, async () => {
  if (open.value) {
    clear();
    changeLoading();
    await fetchPeriods();
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
        <TitlePage title="Filtro de agendamentos" icon="sync_alt" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading :show="isLoading" />
        <q-form v-show="!isLoading" class="q-gutter-y-sm">
          <q-select
            outlined
            v-model="selectedPeriod"
            label="Filtre por período"
            :options="optionsPeriods"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="date_range" color="black" size="20px" />
            </template>
          </q-select>
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
