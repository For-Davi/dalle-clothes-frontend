<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useClientStore } from 'src/stores/client-store';
import { storeToRefs } from 'pinia';
import FormClientPayment from '../fragments/payment/FormClientPayment.vue';
import Empty from '../info/Empty.vue';
import FormClient from '../form/FormClient.vue';
import ClientCart from '../cart/ClientCart.vue';
import FormPayment from '../form/FormPayment.vue';
import { checkPaymentData, checkSaleProductsData } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';

defineOptions({
  name: 'PaymentStepper',
});

const { listClient } = storeToRefs(useClientStore());

const step = ref<number>(1);
const checkPaymentsReset = ref<boolean>(false);
const missingAmount = ref<number>(0);
const dataSale = reactive({
  totalPrice: '0.00' as string,
  products: [] as IClientCartProduct[],
});
const dataPayment = reactive({
  sellerID: null as number | null,
  change: '' as string,
  freight: '' as string,
  freightValue: '' as string,
  cep: '' as string,
  state: '' as string,
  city: '' as string,
  neighborhood: '' as string,
  address: '' as string,
  numberAddress: '' as string,
  complement: '' as string,
  recipientName: '' as string,
  recipientPhone: '' as string,
  fees: '' as string,
  couponID: null as number | null,
  payment: [] as Array<{
    paymentType: string | null;
    value: string;
    receiptID: number | null;
    installment: {
      value: number;
      amount: string;
    } | null;
  }>,
});
const dataClient = reactive({
  id: null as number | null,
  name: '' as string,
  email: '' as string,
  cpf: '' as string,
  cnpj: '' as string,
  stateRegistration: '' as string,
  municipalRegistration: '' as string,
  phone: '' as string,
  country: '' as string,
  state: '' as string,
  city: '' as string,
  cep: '' as string,
  neighborhood: '' as string,
  address: '' as string,
  number: '' as string,
  complement: '' as string,
  description: '' as string,
  dateBirthday: '' as string,
  sex: '' as string,
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
const checkDataEdit = (clientSelected: IClient) => {
  if (clientSelected) {
    const client = clientSelected;

    Object.assign(dataClient, {
      id: client.id ?? null,
      name: client.name ?? '',
      email: client.email ?? '',
      phone: client.phone ?? '',
      cpf: client.cpf ? String(client.cpf) : '',
      cnpj: client.cnpj ? String(client.cnpj) : '',
      stateRegistration: client.state_registration ?? '',
      municipalRegistration: client.municipal_registration ?? '',
      country: client.country ?? '',
      state: client.state ?? '',
      city: client.city ?? '',
      cep: client.cep ? String(client.cep) : '',
      neighborhood: client.neighborhood ?? '',
      address: client.address ?? '',
      number: client.number ? String(client.number) : '',
      complement: client.complement ?? '',
      description: client.description ?? '',
      dateBirthday: client.date_birthday ?? '',
      sex: client.sex === 'M' ? 'Masculino' : 'Feminino',
    });
  }
};
const resetProducts = () => {
  Object.assign(dataSale, {
    totalPrice: '0.00',
    products: [],
  });
};
const resetPayment = () => {
  Object.assign(dataPayment, {
    sellerID: null,
    change: '',
    freightValue: '',
    cep: '',
    state: '',
    city: '',
    neighborhood: '',
    address: '',
    numberAddress: '',
    complement: '',
    recipientName: '',
    recipientPhone: '',
    fees: '',
    couponID: null,
    payment: [],
  });

  checkPaymentsReset.value = !checkPaymentsReset.value;
};
const addTotal = (total: number) => {
  dataSale.totalPrice = total.toString();
};
const checkProducts = () => {
  const check = checkSaleProductsData(dataSale.products);
  if (check.status) {
    step.value = 3;
  } else {
    createErrorData(check.message || 'Erro ao vincular os produtos ao cliente');
  }
};
const sendData = () => {
  const check = checkPaymentData(dataPayment, missingAmount.value);
  if (check.status) {
    console.log('Dados do cliente', dataClient);
    console.log('Dados dos produtos', dataSale);
    console.log('Dados da venda', dataPayment);
  } else {
    createErrorData(check.message || 'Erro ao finalizar venda');
  }
};
const setMissingAmount = (missAmount: number) => {
  missingAmount.value = missAmount;
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
  return listClient.value.find((c) => c.id === dataClient.id) || null;
});

const setClientID = (id: number) => {
  dataClient.id = id;
};

watch(selectedClient, (newClient) => {
  if (newClient) {
    checkDataEdit(newClient);
  }
});

onMounted(async () => {
  await fetchClients();
});
</script>

<template>
  <section>
    <q-stepper v-model="step" color="primary" animated flat bordered>
      <q-step :name="1" title="Selecione um cliente" icon="person" :done="step > 1">
        <div class="flex row">
          <q-select
            outlined
            v-model="dataClient.id"
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
        <div v-if="selectedClient">
          <FormClientPayment v-model="dataClient" :show="selectedClient ? true : false" />
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
      <q-step
        :name="2"
        title="Vincule os produtos ao cliente"
        icon="add_shopping_cart"
        :done="step > 2"
      >
        <ClientCart v-model="dataSale.products" @add-total="addTotal" />
        <q-stepper-navigation align="right">
          <div class="flex row justify-end items-center q-gutter-x-sm">
            <q-btn label="Resetar" color="red" no-caps unelevated outline @click="resetProducts" />
            <q-btn label="Voltar" color="primary" flat no-caps @click="step = 1" />
            <q-btn label="Próximo" color="primary" no-caps @click="checkProducts" />
          </div>
        </q-stepper-navigation>
      </q-step>
      <q-step :name="3" title="Preencha o formulário de venda" icon="point_of_sale">
        <FormPayment
          :totalPrice="dataSale.totalPrice"
          :checkPaymentsReset="checkPaymentsReset"
          v-model="dataPayment"
          @send-missing-amount="setMissingAmount"
        />
        <q-stepper-navigation align="right">
          <div class="flex row justify-end items-center q-gutter-x-sm">
            <q-btn label="Resetar" color="red" no-caps unelevated outline @click="resetPayment" />
            <q-btn label="Voltar" flat color="primary" no-caps unelevated @click="step = 2" />
            <q-btn label="Finalizar venda" color="primary" no-caps unelevated @click="sendData" />
          </div>
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </section>
  <!-- Modals -->
  <FormClient
    :data="showFormClient"
    @update:open="changeShowFormClient(false)"
    @send-id="setClientID"
  />
</template>
