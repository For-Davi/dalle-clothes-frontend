<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { PaymentTypeLabels } from 'src/enums/payment-enum';
import { useTypesReceiptStore } from 'src/stores/types-receipt-store';
import { useReceiptstore } from 'src/stores/receipt-store';
import { searchCep } from 'src/services/cep-service';
import { formatToReal } from 'src/composables/Money';
import { useClientStore } from 'src/stores/client-store';
import { useReturnStore } from 'src/stores/return-store';
import FormPaymentFreight from './FormPaymentFreight.vue';

defineOptions({
  name: 'FormExchangePayment',
});

const props = defineProps<{
  data: {
    open: boolean;
    exchange: IExchange | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
  'send:missingsAmounts': [number, number];
  'new-request': [void];
}>();

const { loadingClient } = storeToRefs(useClientStore());
const { listTypesReceipt } = storeToRefs(useTypesReceiptStore());
const { listReceipt } = storeToRefs(useReceiptstore());
const { loadingReturn } = storeToRefs(useReturnStore());

const missingAmountFreightPayment = ref<number>(0);
const clientCredit = ref<number | null>(null);
const paymentTotal = ref(true);
const paymentDivider = ref(false);
const numPayments = ref<number>(2);
const disableValue = ref<boolean>(false);
const timer = ref<number | null>(null);
const allowSearchCep = ref<boolean>(false);
const loading = ref<boolean>(false);
const model = defineModel<IVModelReturnPayment>({
  default: () => ({
    deliveryData: {
      freight: false,
      freightValue: '0.00',
      cep: '',
      state: '',
      city: '',
      neighborhood: '',
      address: '',
      numberAddress: '',
      complement: '',
      observation: '',
      recipientName: '',
      recipientPhone: '',
    },
    paymentExchangeOrDifferenceData: {
      change: '0.00',
      fees: '0.00',
      payment: [],
    },
    freightPaymentData: {
      change: '0.00',
      fees: '0.00',
      payment: [],
    },
  }),
});

const getReceiptOptions = (paymentType: string | null) => {
  if (paymentType) {
    const options = listReceipt.value
      .filter((r) => r.type?.name === paymentType)
      .map((r) => ({
        label: r.identifier,
        value: r.id,
      }));

    return options;
  } else {
    return [];
  }
};
const createPayments = (count: number) => {
  if (paymentTotal.value) {
    model.value.paymentExchangeOrDifferenceData.payment = [];
    for (let i = 0; i < count; i++) {
      model.value.paymentExchangeOrDifferenceData.payment.push({
        paymentType: null,
        value: Number(totalPricePayment.value).toFixed(2).toString(),
        receiptID: null,
        installment: {
          value: null,
          amount: null,
        },
      });
    }
  } else {
    model.value.paymentExchangeOrDifferenceData.payment = [];
    for (let i = 0; i < count; i++) {
      model.value.paymentExchangeOrDifferenceData.payment.push({
        paymentType: null,
        value: '',
        receiptID: null,
        installment: {
          value: null,
          amount: null,
        },
      });
    }
  }
};
const fetchReceiptsAndTypes = async () => {
  await useReceiptstore().getReceipt({ active: 1 });
  await useTypesReceiptStore().getTypesReceipt({ active: 1 });
};
const fetchClientCredit = async () => {
  clientCredit.value = await useClientStore().getClientCredit(props.data.exchange?.saleID ?? 0);
};
const clearDelivery = () => {
  model.value.deliveryData.freightValue = '0.00';
  model.value.deliveryData.cep = '';
  model.value.deliveryData.state = '';
  model.value.deliveryData.city = '';
  model.value.deliveryData.neighborhood = '';
  model.value.deliveryData.address = '';
  model.value.deliveryData.numberAddress = '';
  model.value.deliveryData.complement = '';
  model.value.deliveryData.recipientName = '';
  model.value.deliveryData.recipientPhone = '';
};
const clear = () => {
  model.value.deliveryData.freight = false;
  paymentTotal.value = true;
  clearDelivery();
};
const isRestrictedTypeAndAlreadySelected = (type: string) => {
  const restrictedTypes = ['MONEY', 'CREDIT'];

  if (!restrictedTypes.includes(type) || paymentTotal.value) return false;

  return model.value.paymentExchangeOrDifferenceData.payment.some((p) => p.paymentType === type);
};
const assignMissingAmountFreight = (missingAmountFreight: number) => {
  missingAmountFreightPayment.value = missingAmountFreight;
};

const getInstallmentOptions = computed(() => {
  const total = Number(totalPricePayment.value);
  const options = [];

  if ((exchange.value?.differenceValue ?? 0) > 0 && paymentTotal.value) {
    for (let i = 2; i <= 12; i++) {
      const installmentValue = total / i;

      options.push({
        label: `${i}X - R$ ${installmentValue.toFixed(2)}`,
        value: i,
        amount: installmentValue.toFixed(2),
      });
    }

    options.unshift({
      label: `1X - R$ ${total.toFixed(2)}`,
      value: 1,
      amount: null,
    });
  }

  return options;
});
const formattedPhone = computed({
  get() {
    const phone = (model.value.deliveryData.recipientPhone || '').replace(/\D/g, '');

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

    model.value.deliveryData.recipientPhone = digits;
  },
});
const totalPricePayment = computed(() => {
  const base = Number(totalExchange.value ?? 0);
  const freight =
    props.data.exchange?.exchangeValue && props.data.exchange?.exchangeValue > 0
      ? 0
      : Number(model.value.deliveryData.freightValue);
  const fees = Number(model.value.paymentExchangeOrDifferenceData.fees ?? 0);

  return (base + freight + fees).toFixed(2);
});
const totalExchange = computed(() => {
  const exchangeValue = exchange.value?.exchangeValue ?? 0;
  const differenceValue = exchange.value?.differenceValue ?? 0;

  return exchangeValue > 0 ? exchangeValue : differenceValue;
});
const exchange = computed(() => props.data.exchange);
const hasExchange = computed(() => (props.data.exchange?.exchangeValue ?? 0) > 0);
const totalPaid = computed(() =>
  model.value.paymentExchangeOrDifferenceData.payment.reduce(
    (sum, p) =>
      sum +
      (p.installment.value !== null &&
      p.installment.value > 0 &&
      p.installment.amount !== null &&
      Number(p.installment.amount) > 0
        ? Number(p.installment.value) * Number(p.installment.amount)
        : Number(p.value)),
    0,
  ),
);
const getTypes = computed(() => {
  if (hasExchange.value || clientCredit.value === 0) {
    return listTypesReceipt.value
      .filter((type: ITypesReceipt) => type.name !== 'CREDIT')
      .map((type: ITypesReceipt) => ({
        label: PaymentTypeLabels[type.name as keyof typeof PaymentTypeLabels],
        value: type.name,
      }));
  }

  return listTypesReceipt.value.map((type: ITypesReceipt) => ({
    label: PaymentTypeLabels[type.name as keyof typeof PaymentTypeLabels],
    value: type.name,
  }));
});
const missingAmount = computed(() => {
  const payments = model.value.paymentExchangeOrDifferenceData.payment;

  const hasInstallment = payments.some(
    (p) =>
      p.installment.value !== null && p.installment.value >= 1 && Number(p.installment.amount) > 0,
  );

  if (hasInstallment && paymentTotal.value) return 0;

  const diff = Number(totalPricePayment.value) - totalPaid.value;

  if (diff <= 0.09) {
    return 0;
  }

  return diff;
});
const hasValue = computed(() => {
  return (
    (props.data.exchange?.exchangeValue && props.data.exchange.exchangeValue > 0) ||
    (props.data.exchange?.differenceValue && props.data.exchange.differenceValue > 0)
  );
});
const titlePage = computed(() => {
  if (props.data.exchange?.exchangeValue && props.data.exchange.exchangeValue > 0) {
    return { title: 'Pagamento do estorno e cadastro da entrega', icon: 'attach_money' };
  }
  if (props.data.exchange?.differenceValue && props.data.exchange.differenceValue > 0) {
    return { title: 'Pagamento da diferença e cadastro da entrega', icon: 'attach_money' };
  }
  return { title: 'Cadastro da entrega', icon: 'local_shipping' };
});
const hasLoading = computed(() => {
  return loadingClient.value || loadingReturn.value;
});
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(
  () => open.value,
  (isOpen) => {
    if (isOpen) {
      createPayments(1);
      clear();
    }
  },
  { immediate: true },
);
watch(
  () => model.value.deliveryData.cep,
  async (cep) => {
    if (cep !== null) {
      model.value.deliveryData.cep = model.value.deliveryData.cep?.replace(/\D/g, '') ?? null;
      if (allowSearchCep.value) {
        if (cep.trim().length === 8) {
          loading.value = true;
          const response = await searchCep(cep);
          if (response.status === 200) {
            model.value.deliveryData.neighborhood = response.data.bairro;
            model.value.deliveryData.state = response.data.estado;
            model.value.deliveryData.city = response.data.localidade;
            model.value.deliveryData.address = response.data.logradouro;
          }
        } else {
          model.value.deliveryData.neighborhood = '';
          model.value.deliveryData.state = '';
          model.value.deliveryData.city = '';
          model.value.deliveryData.address = '';
        }
      } else {
        allowSearchCep.value = true;
      }
    }
    loading.value = false;
  },
);
watch(
  () => model.value.paymentExchangeOrDifferenceData.payment.map((p) => p.installment.value),
  (installments) => {
    if (paymentDivider.value) {
      installments.forEach((val, index) => {
        if ((val ?? 0) > 12) {
          model.value.paymentExchangeOrDifferenceData.payment[index].installment.value = 12;
        }
      });
    }
  },
  { deep: true },
);
watch(
  () => model.value.paymentExchangeOrDifferenceData.payment,
  (newPayments) => {
    newPayments.forEach((payment, index) => {
      if (Number(payment.value) > 0 && payment.installment.value !== null) {
        const payment = model.value.paymentExchangeOrDifferenceData.payment[index];
        const amount = (Number(payment.value) / (payment.installment.value ?? 1)).toFixed(2);
        payment.installment.amount = amount.toString();
      }
    });
  },
  { deep: true },
);
watch(
  [paymentTotal, paymentDivider, numPayments],
  ([isTotal, isDivider, count]) => {
    if (timer.value) clearTimeout(timer.value);

    timer.value = window.setTimeout(() => {
      if (isTotal) {
        createPayments(1);
      } else if (isDivider) {
        if (count <= 1) {
          numPayments.value = 2;
          createPayments(2);
        }
        if (count > 10) {
          numPayments.value = 10;
          createPayments(10);
        } else {
          createPayments(count);
        }
      }
    }, 450);
  },
  { immediate: true, deep: true },
);
watch(
  () => model.value.paymentExchangeOrDifferenceData.payment.map((p) => p.paymentType),
  (newTypes, oldTypes) => {
    newTypes.forEach((type, index) => {
      if (type !== oldTypes[index]) {
        const payment = model.value.paymentExchangeOrDifferenceData.payment[index];
        const receiptOptions = getReceiptOptions(type);
        if (receiptOptions.length > 0) {
          payment.receiptID = receiptOptions[0].value;
        } else {
          payment.receiptID = null;
        }
      }
    });
  },
);
watch(
  () => totalPaid.value,
  () => {
    let creditValue = 0;

    model.value.paymentExchangeOrDifferenceData.payment.forEach((p) => {
      if (p.paymentType === 'CREDIT') {
        creditValue += Number(p.value);
      }
    });

    const total = Number(totalPricePayment.value);
    const nonCreditPayments = totalPaid.value - creditValue;
    const remainingAfterCredit = Math.max(0, total - creditValue);
    const change = nonCreditPayments - remainingAfterCredit;

    model.value.paymentExchangeOrDifferenceData.change =
      change > 0 ? change.toFixed(2).toString() : '0.00';
  },
);
//Caso o preço total mude com tarifas ou frete e caso seja pagar total ele ja coloca esse valor no payment.value
watch([() => totalPricePayment.value, paymentTotal], () => {
  if (paymentTotal.value) {
    model.value.paymentExchangeOrDifferenceData.payment.forEach((payment) => {
      if (payment.paymentType !== 'MONEY') {
        disableValue.value = true;
        payment.value = Number(totalPricePayment.value).toFixed(2).toString();
      }
    });
  }
});
watch(
  () => model.value.paymentExchangeOrDifferenceData.payment.map((p) => p.paymentType),
  (newPaymentTypes) => {
    if (paymentDivider.value) {
      newPaymentTypes.forEach((type, index) => {
        const payment = model.value.paymentExchangeOrDifferenceData.payment[index];

        if (type === 'CREDIT' && clientCredit.value && clientCredit.value > 0) {
          payment.value = clientCredit.value.toString();
          payment.installment = { value: null, amount: null };
          disableValue.value = true;
        }
      });
    }
  },
);
watch(
  () => model.value.paymentExchangeOrDifferenceData.payment.map((p) => p.paymentType),
  (newPaymentTypes) => {
    if (paymentTotal.value) {
      newPaymentTypes.forEach((type, index) => {
        const payment = model.value.paymentExchangeOrDifferenceData.payment[index];

        // Tratamento para DINHEIRO
        if (type === 'MONEY') {
          disableValue.value = false;
          payment.value = '';
          payment.installment = { value: null, amount: null };
        }
        // Tratamento para CRÉDITO
        else if (type === 'CREDIT') {
          disableValue.value = clientCredit.value && clientCredit.value > 0 ? true : false;
          payment.value =
            clientCredit.value && clientCredit.value > 0
              ? Number(clientCredit.value).toFixed(2).toString()
              : '';
          payment.installment = { value: null, amount: null };
        }
        // Demais tipos (ex: CREDIT_CARD, outros)
        else {
          disableValue.value = true;
          payment.value = Number(totalPricePayment.value).toFixed(2).toString();
          payment.installment = { value: null, amount: null };
        }

        // Para cartão de crédito, define parcelamento padrão (1x)
        if (type === 'CREDIT_CARD' && !hasExchange.value) {
          const defaultInstallment = getInstallmentOptions.value[0];
          payment.installment = defaultInstallment;
        }
      });
    } else {
      disableValue.value = false;
    }
  },
  { deep: true },
);
//Validação para a criação da quantidade de pagamentos caso seja pagamento dividido ou pagamento total
watch(
  [paymentTotal, paymentDivider, numPayments],
  ([isTotal, isDivider, count]) => {
    if (timer.value) clearTimeout(timer.value);

    timer.value = window.setTimeout(() => {
      if (isTotal) {
        createPayments(1);
      } else if (isDivider) {
        if (count <= 1) {
          numPayments.value = 2;
          createPayments(2);
        }
        if (count > 10) {
          numPayments.value = 10;
          createPayments(10);
        } else {
          createPayments(count);
        }
      }
    }, 450);
  },
  { immediate: true, deep: true },
);
//Caso o método de pagamento mude ele ja seleciona o primeiro recebimento daquele método de pagamento e caso o método
//seja diferente de cartão de crédito ele zera o parcelamento
watch(
  () => model.value.paymentExchangeOrDifferenceData.payment.map((p) => p.paymentType),
  (newTypes, oldTypes) => {
    newTypes.forEach((type, index) => {
      if (type !== oldTypes[index]) {
        const payment = model.value.paymentExchangeOrDifferenceData.payment[index];
        const receiptOptions = getReceiptOptions(type);
        if (receiptOptions.length > 0) {
          payment.receiptID = receiptOptions[0].value;
        } else {
          payment.receiptID = null;
        }
      }
    });
  },
);
//Validação para que o usuário nao consiga deselecionar um dos dois checkbox ou os dois
watch(
  [paymentTotal, paymentDivider],
  ([newTotal, newDivider], [oldTotal, oldDivider]) => {
    if (!newTotal && !newDivider) {
      if (oldTotal) {
        paymentTotal.value = true;
        numPayments.value = 2;
      }
    }
    if (!newTotal && !newDivider) {
      if (oldDivider) {
        paymentDivider.value = true;
        numPayments.value = 2;
      }
    }
    if (newTotal && !oldTotal) {
      paymentDivider.value = false;
      numPayments.value = 2;
    } else if (newDivider && !oldDivider) {
      paymentTotal.value = false;
      model.value.paymentExchangeOrDifferenceData.payment = [];
      createPayments(numPayments.value);
    }
  },
  { immediate: true },
);
watch(
  () => props.data.open,
  async () => {
    if (props.data.open) {
      await fetchClientCredit();
      await fetchReceiptsAndTypes();
    }
  },
);
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      style="min-width: 80vw"
      :class="hasLoading ? 'bg-grey-2 form-basic column justify-between' : 'bg-grey-2 form-basic'"
    >
      <q-card-section class="q-pa-none">
        <TitlePage :title="titlePage.title" :icon="titlePage.icon" />
      </q-card-section>
      <Loading :show="hasLoading" />
      <q-card-section class="q-pa-sm" v-show="!hasLoading">
        <q-form class="q-gutter-y-lg q-pa-md">
          <section
            v-if="props.data.exchange?.hasExchangeItem"
            class="border-blue-light q-pa-lg q-gutter-y-sm"
          >
            <TitlePage title="Entrega" icon="local_shipping" class="q-pa-none q-ma-none" />
            <q-toggle
              v-model="model.deliveryData.freight"
              label="Frete"
              size="lg"
              @click="clearDelivery"
            />
            <q-input
              label="R$ Valor do frete"
              v-model="model.deliveryData.freightValue"
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
              :disable="!model.deliveryData.freight"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" color="black" />
              </template>
            </q-input>
            <q-input
              v-model="model.deliveryData.cep"
              bg-color="white"
              label-color="black"
              outlined
              label="Digite o CEP"
              dense
              input-class="text-black"
              :loading="loading"
              maxlength="8"
              :disable="!model.deliveryData.freight"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="black" size="20px" />
              </template>
            </q-input>
            <div class="row justify-between">
              <q-input
                v-model="model.deliveryData.state"
                bg-color="white"
                label-color="black"
                outlined
                label="UF"
                dense
                input-class="text-black"
                class="input-divider"
                :disable="!model.deliveryData.freight"
              >
                <template v-slot:prepend>
                  <q-icon name="map" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="model.deliveryData.city"
                bg-color="white"
                label-color="black"
                outlined
                label="Cidade"
                dense
                input-class="text-black"
                class="input-divider"
                :disable="!model.deliveryData.freight"
              >
                <template v-slot:prepend>
                  <q-icon name="pin_drop" color="black" size="20px" />
                </template>
              </q-input>
            </div>
            <q-input
              v-model="model.deliveryData.neighborhood"
              bg-color="white"
              label-color="black"
              outlined
              label="Bairro"
              dense
              input-class="text-black"
              :disable="!model.deliveryData.freight"
            >
              <template v-slot:prepend>
                <q-icon name="pin_drop" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="model.deliveryData.address"
              bg-color="white"
              label-color="black"
              outlined
              label="Logradouro"
              dense
              input-class="text-black"
              :disable="!model.deliveryData.freight"
            >
              <template v-slot:prepend>
                <q-icon name="pin_drop" color="black" size="20px" />
              </template>
            </q-input>
            <div class="row justify-between">
              <q-input
                v-model="model.deliveryData.numberAddress"
                bg-color="white"
                label-color="black"
                outlined
                label="Número"
                dense
                input-class="text-black"
                class="input-divider"
                maxlength="15"
                mask="###############"
                :disable="!model.deliveryData.freight"
              >
                <template v-slot:prepend>
                  <q-icon name="numbers" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="model.deliveryData.complement"
                bg-color="white"
                label-color="black"
                outlined
                label="Complemento"
                dense
                input-class="text-black"
                class="input-divider"
                :disable="!model.deliveryData.freight"
              >
                <template v-slot:prepend>
                  <q-icon name="numbers" color="black" size="20px" />
                </template>
              </q-input>
            </div>
            <q-input
              v-model="model.deliveryData.recipientName"
              bg-color="white"
              label-color="black"
              outlined
              label="Nome do recebedor"
              dense
              input-class="text-black"
              :disable="!model.deliveryData.freight"
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
              :disable="!model.deliveryData.freight"
            >
              <template v-slot:prepend>
                <q-icon name="phone" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="model.deliveryData.observation"
              bg-color="white"
              label-color="black"
              outlined
              label="Observação"
              dense
              input-class="text-black no-resize"
              type="textarea"
              :disable="!model.deliveryData.freight"
            >
              <template v-slot:prepend>
                <q-icon name="description" color="black" size="20px" />
              </template>
            </q-input>
          </section>
          <section
            v-if="hasValue && props.data.exchange?.generateCredit === 0"
            class="border-blue-light q-pa-md q-gutter-y-sm"
          >
            <TitlePage title="Pagamentos" icon="payments" class="q-pa-none q-ma-none" />
            <div class="row q-gutter-x-md">
              <span class="text-bold text-h6 text-bold text-green"
                >Total: {{ formatToReal(totalPricePayment) }}</span
              >
              <span class="text-bold text-h6 text-bold text-blue-9"
                >Troco: {{ formatToReal(model.paymentExchangeOrDifferenceData.change) }}</span
              >
              <span class="text-bold text-h6 text-bold text-red-9"
                >Faltando: {{ formatToReal(missingAmount.toString()) }}</span
              >
            </div>
            <div
              v-if="clientCredit && clientCredit > 0 && !hasExchange"
              class="flex column q-pa-xs"
            >
              <span class="text-bold text-h6 text-bold text-black"
                >Este cliente possui um crédito de {{ formatToReal(clientCredit) }}</span
              >
            </div>
            <q-input
              v-if="!hasExchange"
              label="R$ Valor de tarifas"
              v-model="model.paymentExchangeOrDifferenceData.fees"
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
            <div class="q-gutter-y-lg q-mt-xs">
              <div class="flex row q-gutter-x-md">
                <q-checkbox v-model="paymentTotal" label="Pagar total" />
                <q-checkbox v-model="paymentDivider" label="Pagar dividido" />
              </div>
              <div v-if="paymentDivider" class="q-gutter-y-sm">
                <q-input
                  label="Informe a quantidade de formas de pagamento"
                  type="number"
                  fill-mask="2"
                  mask="##"
                  v-model.number="numPayments"
                  maxlength="2"
                  outlined
                  dense
                  input-class="text-black no-spinners"
                  bg-color="white"
                />
              </div>
              <div
                class="q-gutter-y-sm"
                v-for="(payments, index) in model.paymentExchangeOrDifferenceData.payment"
                :key="index"
              >
                <q-select
                  v-model="payments.paymentType"
                  :options="getTypes"
                  label="Selecione a forma de pagamento"
                  bg-color="white"
                  outlined
                  dense
                  options-dense
                  map-options
                  @update:model-value="
                    (val: IQuasarSelect<string>) => (payments.paymentType = val?.value ?? null)
                  "
                >
                  <template v-slot:prepend>
                    <q-icon name="wallet" color="black" />
                  </template>

                  <template v-slot:option="scope">
                    <q-item
                      v-bind="scope.itemProps"
                      v-if="!isRestrictedTypeAndAlreadySelected(scope.opt.value)"
                    >
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <div
                  :class="
                    paymentDivider && payments.paymentType === 'CREDIT_CARD'
                      ? 'flex q-gutter-x-xs q-gutter-y-xs full-width'
                      : ''
                  "
                >
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
                    :class="
                      paymentDivider && payments.paymentType === 'CREDIT_CARD' && !hasExchange
                        ? 'input-3-divider'
                        : 'full-width'
                    "
                    :disable="
                      disableValue || (payments.paymentType === 'CREDIT' && (clientCredit ?? 0) > 0)
                    "
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_money" color="black" />
                    </template>
                  </q-input>
                  <q-input
                    v-if="paymentDivider && payments.paymentType === 'CREDIT_CARD' && !hasExchange"
                    label="Quantidade de parcelas"
                    v-model="(payments as IDifferencePaymentMethodData).installment.value"
                    @input="
                      (val: string) =>
                        ((payments as IDifferencePaymentMethodData).installment.value = val
                          ? Number(val)
                          : null)
                    "
                    type="text"
                    bg-color="white"
                    label-color="black"
                    outlined
                    dense
                    input-class="text-black"
                    maxlength="2"
                    class="input-3-divider"
                    mask="##"
                  >
                    <template v-slot:prepend>
                      <q-icon name="fa-regular fa-credit-card" color="black" size="20px" />
                    </template>
                  </q-input>
                  <q-input
                    v-if="paymentDivider && payments.paymentType === 'CREDIT_CARD' && !hasExchange"
                    label="R$ Valor das parcelas"
                    v-model="(payments as IDifferencePaymentMethodData).installment.amount"
                    bg-color="white"
                    label-color="black"
                    mask="#.##"
                    fill-mask="0"
                    reverse-fill-mask
                    outlined
                    dense
                    class="input-3-divider"
                    style="width: 34.5%"
                    input-class="text-black"
                    type="text"
                    readonly
                  >
                    <template v-slot:prepend>
                      <q-icon name="credit_card" color="black" />
                    </template>
                  </q-input>
                </div>
                <div
                  v-if="paymentTotal && payments.paymentType === 'CREDIT_CARD' && !hasExchange"
                  class="q-gutter-y-sm"
                >
                  <q-select
                    v-if="!hasExchange"
                    v-model="payments.installment"
                    label="Parcelamento"
                    outlined
                    dense
                    :options="getInstallmentOptions"
                    map-options
                    options-dense
                  />
                </div>
                <q-select
                  v-if="payments.paymentType !== 'CREDIT'"
                  v-model="payments.receiptID"
                  label="Selecione o recebimento"
                  :options="getReceiptOptions(payments.paymentType)"
                  bg-color="white"
                  map-options
                  options-dense
                  outlined
                  dense
                  @update:model-value="
                    (val: IQuasarSelect<number>) => (payments.receiptID = val?.value ?? null)
                  "
                  :disable="payments.paymentType === null"
                >
                  <template v-slot:prepend>
                    <q-icon name="payments" color="black" />
                  </template>
                </q-select>
              </div>
            </div>
          </section>
          <div class="q-mx-n-md">
            <FormPaymentFreight
              v-if="
                props.data.exchange?.hasExchangeItem &&
                props.data.exchange.differenceValue === 0 &&
                Number(model.deliveryData.freightValue) > 0
              "
              v-model="model.freightPaymentData"
              :open="props.data.open"
              :freightValue="Number(model.deliveryData.freightValue)"
              :saleID="props.data.exchange?.saleID ?? 0"
              @send:missing-amount="assignMissingAmountFreight"
            />
          </div>
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
            :loading="hasLoading"
            unelevated
            no-caps
          />
          <q-btn
            @click="emit('send:missingsAmounts', missingAmount, missingAmountFreightPayment)"
            color="primary"
            label="Salvar"
            size="md"
            :loading="hasLoading"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
