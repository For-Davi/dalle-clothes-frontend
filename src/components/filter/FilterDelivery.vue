<script setup lang="ts">
import { watch, computed, ref, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useDeliveryGuyStore } from 'src/stores/delivery-guy-store';
import Loading from 'src/components/shared/Loading.vue';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'FilterDelivery',
});

const props = defineProps<{
  open: boolean;
  filters: IFilterDelivery;
}>();
const emit = defineEmits<{
  'update:open': ['close' | IFilterDelivery];
}>();

const { listDeliveryGuy, loadingDeliveryGuy } = storeToRefs(useDeliveryGuyStore());

const searchDeliveryGuy = ref<string>('');
const dataDelivery = reactive({
  startDate: '' as string,
  endDate: '' as string,
  startScheduledDate: '' as string,
  endScheduledDate: '' as string,
});

const selectedDeliveryGuy = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});

const fetchDeliveryGuys = async () => {
  await useDeliveryGuyStore().getDeliveryGuys();
};
const clear = () => {
  Object.assign(dataDelivery, {
    startDate: '',
    endDate: '',
    startScheduledDate: '',
    endScheduledDate: '',
    deliveryGuy: null,
    product: null,
  });

  selectedDeliveryGuy.value = {
    label: 'Todos',
    value: null,
  };
};
const search = () => {
  const data = {
    startDate: dataDelivery.startDate,
    endDate: dataDelivery.endDate,
    startScheduledDate: dataDelivery.startScheduledDate,
    endScheduledDate: dataDelivery.endScheduledDate,
    deliveryGuy: selectedDeliveryGuy.value.value,
  };

  emit('update:open', data);
};
const mountFilter = () => {
  Object.assign(dataDelivery, {
    startDate: props.filters.startDate,
    endDate: props.filters.endDate,
    startScheduledDate: props.filters.startScheduledDate,
    endScheduledDate: props.filters.endScheduledDate,
  });

  const deliveryGuy = listDeliveryGuy.value.find((item) => item.id === props.filters.deliveryGuy);

  selectedDeliveryGuy.value = deliveryGuy
    ? { label: deliveryGuy.name, value: deliveryGuy.id ?? null }
    : { label: 'Todos', value: null };
};

const open = computed({
  get: () => props.open,
  set: (state: IFilterDelivery | 'close') => emit('update:open', state),
});
const optionsDeliveryGuy = computed(() => {
  const options = [
    {
      label: 'Todos',
      value: null,
    },
    ...listDeliveryGuy.value.map((item) => ({
      label: item.name,
      value: item.id,
    })),
  ];

  if (!searchDeliveryGuy.value || searchDeliveryGuy.value.toLowerCase() === 'todos') {
    return options;
  }

  const needle = searchDeliveryGuy.value.toLowerCase();
  return options.filter((option) => option.label.toLowerCase().includes(needle));
});
const isLoading = computed(() => {
  return loadingDeliveryGuy.value;
});

watch(
  () => props.open,
  async () => {
    if (props.open) {
      clear();
      await fetchDeliveryGuys();
      mountFilter();
    }
  },
);
</script>

<template>
  <q-dialog v-model="open" persistent :maximized="$q.screen.lt.sm">
    <q-card class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Filtro de entregas" icon="local_shipping" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading :show="isLoading" />
        <q-form v-show="!isLoading" class="q-gutter-y-sm">
          <q-input
            v-model="dataDelivery.startDate"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre pela data inicial de criação"
            mask="##/##/####"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="date_range" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataDelivery.endDate"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre pela data final de criação"
            mask="##/##/####"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="date_range" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataDelivery.startScheduledDate"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre pela data de agendamento inicial"
            mask="##/##/####"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="date_range" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataDelivery.endScheduledDate"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre pela data de agendamento final"
            mask="##/##/####"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="date_range" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="selectedDeliveryGuy"
            :options="optionsDeliveryGuy"
            label="Selecione o entregador"
            outlined
            dense
            options-dense
            hide-selected
            fill-input
            use-input
            input-debounce="1"
            @input-value="(val: string) => (searchDeliveryGuy = val)"
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="local_shipping" color="black" size="20px" />
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
            color="primary"
            label="Filtrar"
            @click="search"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
