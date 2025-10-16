<script setup lang="ts">
import TitlePage from '../shared/TitlePage.vue';
import { ref, computed, reactive, watch } from 'vue';

defineOptions({
  name: 'FormPayment',
});

const paymentTotal = ref(true);
const paymentDivider = ref(false);
const showAddress = ref(false);

const saleData = reactive({
  sellerId: null as number | null,
  freight: '' as string,
  freightValue: 0 as number,
  streetName: '' as string,
  numberAddress: '' as string,
  complement: '' as string,
  recipientName: '' as string,
  recipientPhone: '' as string,
  couponId: null as number | null,
  payment: [] as Array<{
    paymentType: string,
    value: number,
    receiptId: number | null,
    installment: number | null,
    installmentValue: number,
  }>
});

const optionsPaymentType = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'PIX'];
const optionsInstallment = [
  { label: '1X', value: 1 },
  { label: '2X', value: 2 },
  { label: '3X', value: 3 },
  { label: '4X', value: 4 },
  { label: '5X', value: 5 },
  { label: '6X', value: 6 },
  { label: '7X', value: 7 },
  { label: '8X', value: 8 },
  { label: '9X', value: 9 },
  { label: '10X', value: 10 },
  { label: '11X', value: 11 },
  { label: '12X', value: 12 },
];

if (paymentTotal.value) {
  saleData.payment = []
  saleData.payment.push({
    paymentType: '',
    value: 0,
    receiptId: null,
    installment: null,
    installmentValue: 0,
  });
}

const addPayment = () => {
  saleData.payment.push({
    paymentType: '',
    value: 0,
    receiptId: null,
    installment: null,
    installmentValue: 0,
  });
}
const removePayment = () => {
    saleData.payment.splice(0, 1);
}

const formattedPhone = computed({
  get() {
    const phone = (saleData.recipientPhone || '').replace(/\D/g, '');

    if (phone.length === 10) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
    }
    if (phone.length === 11) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
    }
    return phone;
  },
  set(value) {
    const digits = (value || '').replace(/\D/g, '');

    if (digits.length > 11) {
      return;
    }

    saleData.recipientPhone = digits;
  },
});

watch([paymentTotal, paymentDivider], ([newTotal, newDivider], [oldTotal, oldDivider]) => { 
  if (newTotal && !oldTotal) {
    paymentDivider.value = false; 
    saleData.payment = [
      {
        paymentType: '',
        value: 0,
        receiptId: null,
        installment: null,
        installmentValue: 0,
      }
    ];
  }
  else if (newDivider && !oldDivider) {
    paymentTotal.value = false; 
    saleData.payment = [
      {
        paymentType: '',
        value: 0,
        receiptId: null,
        installment: null,
        installmentValue: 0,
      },
      {
        paymentType: '',
        value: 0,
        receiptId: null,
        installment: null,
        installmentValue: 0,
      }
    ];
  }
  else if (!newTotal && !newDivider) {
    paymentTotal.value = true;
    saleData.payment = [
      {
        paymentType: '',
        value: 0,
        receiptId: null,
        installment: null,
        installmentValue: 0,
      }
    ];
  }
});

</script>

<template>
  <q-card class="column form-basic-no-modal justify-between" flat bordered>
    <q-card-section class="q-pa-none">
      <TitlePage title="Formulário de venda" icon="shopping_cart" />
    </q-card-section>
    <q-card-section>
      <div class="q-gutter-y-lg">
        <section class="border-grey-light q-pa-md">
          <p class="text-bold text-h6">Vendedor</p>
          <q-select v-model="saleData.sellerId" label="Selecione um vendedor" outlined dense />
        </section>

        <section class="border-grey-light q-pa-md q-gutter-y-sm">
          <p class="text-bold text-h6">Entrega</p>
          <q-toggle v-model="showAddress" label="Frete" size="lg" />
          <q-input
            label="R$ Valor do frete"
            v-model="saleData.freightValue"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black no-spinners"
            type="text"
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
            class="full-width"
            :disable="showAddress === false ? true : false"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" color="black" />
            </template>
          </q-input>
          <div class="flex justfiy-between q-gutter-x-md">
            <q-input
              label="Nome da rua"
              v-model="saleData.streetName"
              bg-color="white"
              label-color="black"
              outlined
              dense
              input-class="text-black no-spinners"
              class="input-divider"
              :disable="showAddress === false ? true : false"
            >
              <template v-slot:prepend>
                <q-icon name="home_work" color="black" />
              </template>
            </q-input>
            <q-input
              v-model="saleData.numberAddress"
              bg-color="white"
              label-color="black"
              outlined
              label="Número"
              dense
              input-class="text-black"
              maxlength="15"
              mask="###############"
              class="input-divider"
              :disable="showAddress === false ? true : false"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="saleData.complement"
            bg-color="white"
            label-color="black"
            outlined
            label="Complemento"
            dense
            input-class="text-black"
            :disable="showAddress === false ? true : false"
          >
            <template v-slot:prepend>
              <q-icon name="numbers" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="saleData.recipientName"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome do recebedor"
            dense
            input-class="text-black"
            :disable="showAddress === false ? true : false"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="formattedPhone"
            bg-color="white"
            label-color="black"
            outlined
            label="Telefone do recebedor"
            dense
            input-class="text-black"
            :disable="showAddress === false ? true : false"
          >
            <template v-slot:prepend>
              <q-icon name="phone" color="black" size="20px" />
            </template>
          </q-input>
        </section>
        <section class="border-grey-light q-pa-md q-gutter-y-sm">
          <p class="text-bold text-h6">Pagamentos</p>
          <q-select
            v-model="saleData.couponId"
            label="Selecione um cupom de desconto"
            outlined
            dense
          >
            <template v-slot:prepend>
              <q-icon name="sell" color="black" />
            </template>
          </q-select>
          <div class="flex row q-gutter-x-md">
            <q-checkbox v-model="paymentTotal" label="Pagar total" />
            <q-checkbox v-model="paymentDivider" label="Pagar dividido"/>
          </div>
         <div class="q-gutter-y-xl">
          <div class="q-gutter-y-sm" v-for="(payments, index) in saleData.payment" :key="index">
             <q-select
            v-model="payments.paymentType"
            :options="optionsPaymentType"
            label="Selecione a forma de pagamento"
            outlined
            dense
            options-dense
          >
            <template v-slot:prepend>
              <q-icon name="wallet" color="black" />
            </template>
          </q-select>
          <q-input
            label="R$ Valor"
            v-model="payments.value"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black no-spinners"
            type="text"
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" color="black" />
            </template>
          </q-input>
          <q-select v-model="payments.receiptId" label="Selecione o recebimento" outlined dense>
            <template v-slot:prepend>
              <q-icon name="payments" color="black" />
            </template>
          </q-select>
          <div v-if="payments.paymentType === 'Cartão de crédito'" class="q-gutter-y-sm">
            <q-select
              v-model="payments.installment"
              label="Parcelamento"
              outlined
              dense
              :options="optionsInstallment"
            />
            </div>
          </div>
           <div v-if="paymentDivider" align="right" class="row justify-end items-center q-gutter-x-sm">
            <q-btn
              label="Excluir forma de pagamento"
              color="red"
              no-caps
              unelevated
              @click="removePayment"
              />
              <q-btn
              label="Adicionar nova forma de pagamento"
              color="primary"
              no-caps
              unelevated
              @click="addPayment"
              />
            </div>
         </div>
        </section>
      </div>
    </q-card-section>
  </q-card>
</template>
