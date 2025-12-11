<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useClientStore } from 'src/stores/client-store';
import { storeToRefs } from 'pinia';
import FormClientPayment from '../fragments/payment/FormClientPayment.vue';
import Empty from '../info/Empty.vue';
import FormClient from '../form/FormClient.vue';
import ClientCart from '../cart/ClientCart.vue';

defineOptions({
  name: 'PaymentStepper',
});

const { listClient } = storeToRefs(useClientStore());

const step = ref<number>(1);
const dataSaleForm = reactive({
  clientId: null as number | null,
});
const showFormClient = reactive<{
  open: boolean;
  clientId: null;
}>({
  open: false,
  clientId: null,
});
const searchFilter = ref<string>('');

const changeShowFormClient = (show: boolean, clientId: null = null) => {
  Object.assign(showFormClient, {
    open: show,
    clientId: clientId,
  });
};
const fetchClients = async (): Promise<void> => {
  await useClientStore().getClients();
};

const listClientOptions = computed(() => {
  const options = listClient.value.map((client) => ({
    label: `${client.name} - ${client.cpf ? client.cpf : 'Cliente sem CPF'}`,
    value: client.id || null,
  }));

  options.unshift({
    label: 'Consumidor final',
    value: null,
  });

  if (!searchFilter.value || searchFilter.value.toLowerCase() === 'consumidor final') {
    return options;
  }

  const needle = searchFilter.value.toLowerCase();
  return options.filter((option) => option.label.toLowerCase().includes(needle));
});
const selectedClient = computed(() => {
  return listClient.value.find((c) => c.id === dataSaleForm.clientId) || null;
});

onMounted(async () => {
  await fetchClients();
});
</script>

<template>
  <section>
    <q-stepper v-model="step" color="primary" animated flat bordered>
      <q-step :name="1" title="Cliente" icon="person" :done="step > 1">
        <div class="flex row">
          <q-select
            outlined
            v-model="dataSaleForm.clientId"
            :options="listClientOptions"
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
        </div>

        <div v-if="selectedClient !== null">
          <FormClientPayment
            :show="selectedClient !== null ? true : false"
            :client="selectedClient"
          />
        </div>
        <div v-else class="q-mt-md">
          <Empty message="Nenhum cliente selecionado" color="bg-red-3" />
        </div>

        <q-stepper-navigation align="right">
          <div class="row justify-end items-center q-gutter-x-sm">
            <q-btn
              label="Adiconar cliente"
              color="primary"
              outline
              no-caps
              @click="changeShowFormClient(true)"
            />
            <q-btn label="Próximo" color="primary" no-caps unelevated @click="step = 2" />
          </div>
        </q-stepper-navigation>
      </q-step>
      <q-step :name="2" title="Produtos" icon="add_shopping_cart" :done="step > 2">
        <ClientCart />
        <q-stepper-navigation align="right">
          <div class="flex row justify-end items-center q-gutter-x-sm">
            <q-btn label="Voltar" color="primary" flat no-caps @click="step = 1" />
            <q-btn label="Próximo" color="primary" no-caps @click="step = 3" />
          </div>
        </q-stepper-navigation>
      </q-step>
      <q-step :name="3" title="Finalização" icon="point_of_sale">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Itaque commodi nihil rerum nobis
        enim laboriosam assumenda odit aspernatur veniam praesentium? Nobis aut dolore consequatur
        ipsum eius ab quae fugit consectetur.
        <q-stepper-navigation align="right">
          <q-btn label="Tetse" color="primary" @click="step = 1" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </section>
  <!-- Modals -->
  <FormClient :data="showFormClient" @update:open="changeShowFormClient(false)" />
</template>
