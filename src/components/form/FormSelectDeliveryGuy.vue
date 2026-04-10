<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useDeliveryGuyStore } from 'src/stores/delivery-guy-store';
import Loading from '../shared/Loading.vue';

defineOptions({
  name: 'FormSelectDeliveryGuy',
});

const props = defineProps<{
  data: {
    open: boolean;
    deliveryID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
  'send:ids': [number, number | null];
}>();

const { loadingDeliveryGuy, listDeliveryGuy } = storeToRefs(useDeliveryGuyStore());

const searchFilter = ref<string>('');
const deliveryGuyID = ref<number | null>(null);

const clear = () => {
  deliveryGuyID.value = null;
};
const fetchDeliveryGuys = async () => {
  await useDeliveryGuyStore().getDeliveryGuys();
};
const sendID = () => {
  if (deliveryID.value) {
    emit('send:ids', deliveryID.value, deliveryGuyID.value);
    open.value = false;
  }
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
const deliveryID = computed(() => props.data.deliveryID);
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
        loadingDeliveryGuy
          ? 'bg-grey-2 form-basic column justify-between'
          : 'bg-grey-2 column justify-between'
      "
      style="width: 350px"
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Seleção de entregador" icon="local_shipping" />
      </q-card-section>
      <Loading :show="loadingDeliveryGuy" v-show="loadingDeliveryGuy" />
      <q-card-section v-if="!loadingDeliveryGuy">
        <q-select
          class="q-mb-lg bg-white"
          outlined
          v-model="deliveryGuyID"
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
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            flat
            label="Fechar"
            @click="open = false"
            no-caps
            color="red"
            :loading="loadingDeliveryGuy"
            unelevated
          />
          <q-btn
            label="Salvar"
            no-caps
            color="primary"
            @click="sendID"
            :loading="loadingDeliveryGuy"
            unelevated
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
