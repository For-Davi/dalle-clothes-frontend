<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { useEmployeeStore } from 'src/stores/employee-store';

defineOptions({
  name: 'FilterResult',
});

const props = defineProps<{
  open: boolean;
  filters: IFilterCommission;
}>();
const emit = defineEmits<{
  'update:open': ['close' | IFilterCommission];
}>();

const { loadingEmployee, listEmployee } = storeToRefs(useEmployeeStore());

const loading = ref<boolean>(false);
const filterCommission = reactive({
  startPeriod: '' as string,
  endPeriod: '' as string,
});
const selectedSeller = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});

const open = computed({
  get: () => props.open,
  set: (state: IFilterCommission | 'close') => emit('update:open', state),
});

const clear = (): void => {
  selectedSeller.value = {
    label: 'Todos',
    value: null,
  };
  Object.assign(filterCommission, {
    startPeriod: '',
    endPeriod: '',
  });
};
const fetchSellers = async () => {
  await useEmployeeStore().getEmployees();
};
const changeLoading = (): void => {
  loading.value = !loading.value;
};
const mountFilter = () => {
  const selectedSellerItem = listEmployee.value.find((item) => item.id === props.filters.sellerID);

  selectedSeller.value = selectedSellerItem
    ? { label: selectedSellerItem?.name, value: selectedSellerItem?.id }
    : { label: 'Todos', value: null };

  Object.assign(filterCommission, {
    startPeriod: props.filters.startPeriod ?? '',
    endPeriod: props.filters.endPeriod ?? '',
  });
};
const search = () => {
  const data = {
    startPeriod: filterCommission.startPeriod,
    endPeriod: filterCommission.endPeriod,
    sellerID: selectedSeller.value.value,
  };

  emit('update:open', data);
};

const isLoading = computed((): boolean => {
  return loading.value || loadingEmployee.value;
});
const optionsSellers = computed(() => {
  return [
    {
      label: 'Todos',
      value: null,
    },
    ...listEmployee.value.map((item) => ({
      label: item.name,
      value: item.id,
    })),
  ];
});

watch(open, async () => {
  if (open.value) {
    clear();
    changeLoading();
    await fetchSellers();
    mountFilter();
    changeLoading();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent :maximized="$q.screen.lt.sm">
    <q-card class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Filtro de resultados" icon="analytics" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading :show="isLoading" />
        <q-form v-show="!isLoading" class="q-gutter-y-sm">
          <q-input
            v-model="filterCommission.startPeriod"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre pelo período inicial"
            mask="##/####"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="date_range" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="filterCommission.endPeriod"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre pelo período final"
            mask="##/####"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="date_range" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            outlined
            v-model="selectedSeller"
            label="Filtre por vendedor"
            :options="optionsSellers"
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
