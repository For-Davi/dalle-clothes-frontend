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
import { useSaleStore } from 'src/stores/sale-store';
import SaleMade from '../fragments/sale/SaleMade.vue';

defineOptions({
  name: 'PaymentStepper',
});

const { listClient } = storeToRefs(useClientStore());
const { loadingSale } = storeToRefs(useSaleStore());

const showSaleMade = reactive<{
  open: boolean;
  saleID: number | null;
}>({
  open: false,
  saleID: null,
});
const step = ref<number>(1);
const checkPaymentsReset = ref<boolean>(false);
const missingAmount = ref<number>(0);
const dataSale = reactive({
  totalPrice: '0.00' as string,
  products: [] as IClientCartProduct[],
});
const dataPayment = reactive({
  sellerID: null as number | null,
  change: '0.00' as string,
  freight: false as boolean,
  freightValue: '0.00' as string,
  cep: '' as string,
  state: '' as string,
  city: '' as string,
  neighborhood: '' as string,
  address: '' as string,
  numberAddress: '' as string,
  complement: '' as string,
  observation: '' as string,
  recipientName: '' as string,
  recipientPhone: '' as string,
  fees: '0.00' as string,
  couponID: null as number | null,
  payment: [] as Array<{
    paymentType: string;
    value: string;
    receiptID: number;
    installment: {
      value: number | null;
      amount: string | null;
    };
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
const showFormClientPayment = reactive<{
  show: boolean;
  clientId: null;
}>({
  show: false,
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
const resetProducts = () => {
  Object.assign(dataSale, {
    totalPrice: '0.00',
    products: [],
  });
};
const resetPayment = () => {
  Object.assign(dataPayment, {
    sellerID: null,
    change: '0.00',
    freight: false,
    freightValue: '0.00',
    cep: '',
    state: '',
    city: '',
    neighborhood: '',
    address: '',
    numberAddress: '',
    complement: '',
    recipientName: '',
    recipientPhone: '',
    observation: '',
    fees: '0.00',
    couponID: null,
    payment: [],
  });

  checkPaymentsReset.value = !checkPaymentsReset.value;
};
const resetClient = () => {
  Object.assign(dataClient, {
    id: null,
  });
};
const addTotal = (total: number) => {
  dataSale.totalPrice = total.toFixed(2).toString();
};
const checkProducts = () => {
  const check = checkSaleProductsData(dataSale.products);
  if (check.status) {
    step.value = 3;
  } else {
    createErrorData(check.message || 'Erro ao vincular os produtos ao cliente');
  }
};
const sendData = async () => {
  const check = checkPaymentData(dataPayment, missingAmount.value);
  if (check.status) {
    const formattedProducts: IDataProductSale[] = dataSale.products.map((p) => ({
      productVariantID: p.product_variant_id,
      price: p.price,
      offer: p.offer ?? '',
      newQuantity: p.newQuantity ?? 0,
      variantActive: p.variant_active,
    }));
    const cleanedPayments = dataPayment.payment.map((p) => ({
      ...p,
      installment: { value: p.installment?.value ?? null, amount: p.installment?.amount ?? null },
    }));

    const response = await useSaleStore().createSale({
      clientData: dataClient.id
        ? {
            id: dataClient.id,
            name: dataClient.name,
            email: dataClient.email,
            dateBirthday: dataClient.dateBirthday,
            cpf: dataClient.cpf,
            cnpj: dataClient.cnpj,
            stateRegistration: dataClient.stateRegistration,
            municipalRegistration: dataClient.municipalRegistration,
            phone: dataClient.phone,
            country: dataClient.country,
            state: dataClient.state,
            city: dataClient.city,
            cep: dataClient.cep,
            neighborhood: dataClient.neighborhood,
            address: dataClient.address,
            number: dataClient.number,
            complement: dataClient.complement,
            description: dataClient.description,
            sex: dataClient.sex === 'Masculino' ? 'M' : 'F',
          }
        : null,
      saleData: {
        totalPrice: dataSale.totalPrice,
        products: formattedProducts,
      },
      deliveryData: {
        freight: dataPayment.freight,
        freightValue: dataPayment.freightValue,
        cep: dataPayment.cep,
        state: dataPayment.state,
        city: dataPayment.city,
        neighborhood: dataPayment.neighborhood,
        address: dataPayment.address,
        numberAddress: dataPayment.numberAddress,
        complement: dataPayment.complement,
        recipientName: dataPayment.recipientName,
        recipientPhone: dataPayment.recipientPhone,
        observation: dataPayment.observation,
      },
      sellerID: dataPayment.sellerID,
      paymentData: {
        change: dataPayment.change,
        fees: dataPayment.fees,
        couponID: dataPayment.couponID,
        payment: cleanedPayments,
      },
    });

    if (response?.status === 201) {
      changeModalOpen(true, response.data.sale.id);
    }
  } else {
    createErrorData(check.message || 'Erro ao finalizar venda');
  }
};
const setMissingAmount = (missAmount: number) => {
  missingAmount.value = missAmount;
};
const newSale = () => {
  resetClient();
  resetProducts();
  resetPayment();
  searchFilter.value = 'Consumidor final';
  changeModalOpen(false);
  step.value = 1;
};
const changeModalOpen = (show: boolean, id: number | null = null) => {
  Object.assign(showSaleMade, {
    open: show,
    saleID: id,
  });
};
const setClientID = (id: number) => {
  dataClient.id = id;
  showFormClient.open = false;
  searchFilter.value = '';
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

watch(selectedClient, (newClient) => {
  if (newClient) {
    Object.assign(showFormClientPayment, {
      show: true,
      clientId: newClient.id,
    });
  } else {
    Object.assign(showFormClientPayment, {
      show: false,
      clientId: null,
    });
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
          <FormClientPayment v-model="dataClient" :data="showFormClientPayment" />
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
          :loadingSale="loadingSale"
          v-model="dataPayment"
          @send-missing-amount="setMissingAmount"
        />
        <q-stepper-navigation align="right" class="q-mt-xl">
          <div class="flex row justify-end items-center q-gutter-x-sm">
            <q-btn
              label="Resetar"
              color="red"
              no-caps
              unelevated
              outline
              :loading="loadingSale"
              @click="resetPayment"
            />
            <q-btn
              label="Voltar"
              flat
              color="primary"
              no-caps
              unelevated
              :loading="loadingSale"
              @click="step = 2"
            />
            <q-btn
              label="Finalizar venda"
              color="primary"
              no-caps
              unelevated
              :loading="loadingSale"
              @click="sendData"
            />
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
  <SaleMade :data="showSaleMade" @new-sale="newSale" />
</template>
