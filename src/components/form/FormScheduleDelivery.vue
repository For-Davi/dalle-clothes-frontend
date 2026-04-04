<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useDeliveryGuyStore } from 'src/stores/delivery-guy-store';
import Loading from '../shared/Loading.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { checkDataScheduleDelivery } from 'src/composables/CheckData';
import { useDeliveryStore } from 'src/stores/delivery-store';

defineOptions({
  name: 'FormScheduleDelivery',
});

const props = defineProps<{
  data: {
    open: boolean;
    deliveryID: number | null;
    status: string;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingDeliveryGuy, listDeliveryGuy } = storeToRefs(useDeliveryGuyStore());
const { loadingDelivery } = storeToRefs(useDeliveryStore());

const scheduleDeliveryData = reactive({
  schedule: '',
  deliveryGuyID: null,
});
const searchFilter = ref<string>('');

const fetchDeliveryGuys = async () => {
  await useDeliveryGuyStore().getDeliveryGuys();
};
const schedule = async () => {
  const check = checkDataScheduleDelivery(scheduleDeliveryData);

  if (check.status) {
    const response = await useDeliveryStore().scheduleDelivery(
      props.data.deliveryID ?? 0,
      scheduleDeliveryData.schedule,
      scheduleDeliveryData.deliveryGuyID,
      props.data.status,
    );
    if (response?.status === 200) {
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao enviar dados para o agendamento');
  }
};
const clear = () => {
  Object.assign(scheduleDeliveryData, {
    schedule: '',
    deliveryGuyid: null,
  });
};

const listDeliveryGuyOptions = computed(() => {
  const options = listDeliveryGuy.value.map((deliveryGuy) => ({
    label: deliveryGuy.name,
    value: deliveryGuy.id || null,
  }));

  options.unshift({
    label: 'Nenhum entregador selecionado',
    value: null,
  });

  if (!searchFilter.value || searchFilter.value.toLowerCase() === 'nenhum entregador selecionado') {
    return options;
  }

  const needle = searchFilter.value.toLowerCase();
  return options.filter((option) => option.label.toLowerCase().includes(needle));
});
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(
  () => open.value,
  async () => {
    if (open.value) {
      clear();
      await fetchDeliveryGuys();
    }
  },
);
</script>

<template>
  <q-dialog v-model="open">
    <q-card
      :class="
        loadingDeliveryGuy || loadingDelivery ? 'bg-grey-2 sub-page column' : 'bg-grey-2 sub-page'
      "
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Agendamento da entrega" icon="date_range" />
      </q-card-section>
      <Loading
        :show="loadingDeliveryGuy || loadingDelivery"
        v-show="loadingDeliveryGuy || loadingDelivery"
      />
      <q-card-section v-if="!loadingDeliveryGuy || !loadingDelivery">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="scheduleDeliveryData.schedule"
            label="Data prevista para a entrega"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
            mask="##/##/####"
          >
            <template v-slot:prepend>
              <q-icon name="date_range" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            class="q-mb-lg bg-white"
            outlined
            v-model="scheduleDeliveryData.deliveryGuyID"
            label="Selecione o(a) entregador(a)"
            :options="listDeliveryGuyOptions"
            emit-value
            map-options
            hide-selected
            dense
            options-dense
            use-input
            fill-input
            clearable
            input-debounce="1"
            @input-value="(val: string) => (searchFilter = val)"
            style="width: 100%"
          />
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            :loading="loadingDeliveryGuy || loadingDelivery"
            unelevated
            no-caps
          />
          <q-btn
            color="primary"
            label="Agendar"
            size="md"
            @click="schedule"
            :loading="loadingDeliveryGuy || loadingDelivery"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
