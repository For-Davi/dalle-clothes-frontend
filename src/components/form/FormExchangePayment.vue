<script setup lang="ts">
import { computed, onMounted, ref, watch, reactive } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { checkDataDifferencePayment, checkDataExchangePayment } from 'src/composables/CheckData';
import { useExchangeStore } from 'src/stores/exchange-store';
import { PaymentTypeLabels } from 'src/enums/payment-enum';
import { useTypesReceiptStore } from 'src/stores/types-receipt-store';
import { useReceiptstore } from 'src/stores/receipt-store';
import { searchCep } from 'src/services/cep-service';
import { formatToReal } from 'src/composables/Money';

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
}>();

const { loadingExchange } = storeToRefs(useExchangeStore());
const { listTypesReceipt } = storeToRefs(useTypesReceiptStore());
const { listReceipt } = storeToRefs(useReceiptstore());

const exchangePaymentData = ref<IExchangePaymentMethodData[]>([]);
const additionalPaymentData = reactive({
  change: 0,
  fees: 0,
  description: '',
});
const paymentTotal = ref(true);
const paymentDivider = ref(false);
const numPayments = ref<number>(2);
const disableValue = ref<boolean>(false);
const timer = ref<number | null>(null);
const allowSearchCep = ref<boolean>(false);
const loading = ref<boolean>(false);
const deliveryData = reactive({
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
});

const save = async () => {
  if (hasExchange.value) {
    const check = checkDataExchangePayment(
      {
        exchangePaymentData: exchangePaymentData.value,
        additionalExchangePaymentData: {
          saleID: props.data.exchange?.sale_id ?? 0,
          exchangeID: props.data.exchange?.id ?? 0,
          change: additionalPaymentData.change,
          fees: additionalPaymentData.fees,
          description: additionalPaymentData.description,
        },
      },
      missingAmount.value,
    );
    if (check.status) {
      const response = await useExchangeStore().createExchangePayment({
        exchangePaymentData: exchangePaymentData.value,
        additionalExchangePaymentData: {
          saleID: props.data.exchange?.sale_id ?? 0,
          exchangeID: props.data.exchange?.id ?? 0,
          change: additionalPaymentData.change,
          fees: additionalPaymentData.fees,
          description: additionalPaymentData.description,
        },
      });
      if (response?.status === 201) {
        emit('update:open');
      }
      console.log('dados', {
        exchangePaymentData: exchangePaymentData.value,
        additionalExchangePaymentData: {
          saleID: props.data.exchange?.sale_id,
          exchangeID: props.data.exchange?.id,
          change: additionalPaymentData.change,
          description: additionalPaymentData.description,
        },
      });
    } else {
      createErrorData(check.message || 'Erro ao processar dados do pagamento');
    }
  } else {
    const check = checkDataDifferencePayment(
      {
        differencePaymentData: exchangePaymentData.value,
        additionalDifferencePaymentData: {
          saleID: props.data.exchange?.sale_id ?? 0,
          exchangeID: props.data.exchange?.id ?? 0,
          fees: additionalPaymentData.fees,
          change: additionalPaymentData.change,
          description: additionalPaymentData.description,
        },
        differenceDeliveryData: deliveryData,
      },
      missingAmount.value,
    );
    if (check.status) {
      const response = await useExchangeStore().createDifferencePayment({
        differencePaymentData: exchangePaymentData.value,
        additionalDifferencePaymentData: {
          saleID: props.data.exchange?.sale_id ?? 0,
          exchangeID: props.data.exchange?.id ?? 0,
          fees: additionalPaymentData.fees,
          change: additionalPaymentData.change,
          description: additionalPaymentData.description,
        },
        differenceDeliveryData: deliveryData,
      });
      if (response?.status === 201) {
        emit('update:open');
      }
      console.log('dadodasodosad', {
        differencePaymentData: exchangePaymentData.value,
        additionalDifferencePaymentData: {
          saleID: props.data.exchange?.sale_id ?? 0,
          exchangeID: props.data.exchange?.id ?? 0,
          fees: additionalPaymentData.fees,
          change: additionalPaymentData.change,
          description: additionalPaymentData.description,
        },
        differenceDelievryData: deliveryData,
      });
    } else {
      createErrorData(check.message || 'Erro ao processar dados do pagamento');
    }
  }
};
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
const isMoneyAndHasArrayPayment = (label: string) => {
  return label === 'MONEY' && exchangePaymentData.value.some((p) => p.paymentType === 'MONEY');
};
const createPayments = (count: number) => {
  if (paymentTotal.value) {
    exchangePaymentData.value = [];
    for (let i = 0; i < count; i++) {
      exchangePaymentData.value.push({
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
    exchangePaymentData.value = [];
    for (let i = 0; i < count; i++) {
      exchangePaymentData.value.push({
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
const clearDelivery = () => {
  deliveryData.freightValue = '0.00';
  deliveryData.cep = '';
  deliveryData.state = '';
  deliveryData.city = '';
  deliveryData.neighborhood = '';
  deliveryData.address = '';
  deliveryData.numberAddress = '';
  deliveryData.complement = '';
  deliveryData.recipientName = '';
  deliveryData.recipientPhone = '';
};
const clear = () => {
  paymentTotal.value = true;
  clearDelivery();
};

const getInstallmentOptions = computed(() => {
  const total = Number(totalPricePayment.value);
  const options = [];

  if ((exchange.value?.difference_value ?? 0) > 0 && paymentTotal.value) {
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
    const phone = (deliveryData.recipientPhone || '').replace(/\D/g, '');

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

    deliveryData.recipientPhone = digits;
  },
});
const getTypes = computed(() => {
  return listTypesReceipt.value.map((type: ITypesReceipt) => ({
    label: PaymentTypeLabels[type.name as keyof typeof PaymentTypeLabels],
    value: type.name,
  }));
});
const totalPricePayment = computed(() => {
  const base = Number(totalExchange.value ?? 0);
  const freight = Number(deliveryData.freightValue ?? 0);
  const fees = Number(additionalPaymentData.fees ?? 0);

  return (base + freight + fees).toFixed(2);
});
const totalExchange = computed(() => {
  const exchangeValue = exchange.value?.exchange_value ?? 0;
  const differenceValue = exchange.value?.difference_value ?? 0;

  return exchangeValue > 0 ? exchangeValue : differenceValue;
});
const exchange = computed(() => props.data.exchange);
const hasExchange = computed(() => (props.data.exchange?.exchange_value ?? 0) > 0);
const totalPaid = computed(() =>
  exchangePaymentData.value.reduce(
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
const missingAmount = computed(() => {
  const payments = exchangePaymentData.value;

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
  () => deliveryData.cep,
  async (cep) => {
    if (cep !== null) {
      deliveryData.cep = deliveryData.cep?.replace(/\D/g, '') ?? null;
      if (allowSearchCep.value) {
        if (cep.trim().length === 8) {
          loading.value = true;
          const response = await searchCep(cep);
          if (response.status === 200) {
            deliveryData.neighborhood = response.data.bairro;
            deliveryData.state = response.data.estado;
            deliveryData.city = response.data.localidade;
            deliveryData.address = response.data.logradouro;
          }
        } else {
          deliveryData.neighborhood = '';
          deliveryData.state = '';
          deliveryData.city = '';
          deliveryData.address = '';
        }
      } else {
        allowSearchCep.value = true;
      }
    }
    loading.value = false;
  },
);
watch(
  () => exchangePaymentData.value.map((p) => p.installment.value),
  (installments) => {
    if (paymentDivider.value) {
      installments.forEach((val, index) => {
        if ((val ?? 0) > 12) {
          exchangePaymentData.value[index].installment.value = 12;
        }
      });
    }
  },
  { deep: true },
);
watch(
  () => exchangePaymentData.value,
  (newPayments) => {
    newPayments.forEach((payment, index) => {
      if (Number(payment.value) > 0 && payment.installment.value !== null) {
        const payment = exchangePaymentData.value[index];
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
  () => exchangePaymentData.value.map((p) => p.paymentType),
  (newTypes, oldTypes) => {
    newTypes.forEach((type, index) => {
      if (type !== oldTypes[index]) {
        const payment = exchangePaymentData.value[index];
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
//Caso o preço total mude com tarifas ou frete e caso seja pagar total ele ja coloca esse valor no payment.value
watch([() => totalPricePayment.value, paymentTotal], () => {
  if (paymentTotal.value) {
    if (hasExchange.value) {
      exchangePaymentData.value.forEach((payment) => {
        if (payment.paymentType !== 'MONEY') {
          disableValue.value = true;
          payment.value = Number(totalPricePayment.value).toFixed(2).toString();
        }
      });
    } else {
      exchangePaymentData.value.forEach((payment) => {
        if (payment.paymentType !== 'MONEY') {
          disableValue.value = true;
          payment.value = Number(totalPricePayment.value).toFixed(2).toString();
        }
      });
    }
  }
});
watch(
  () => exchangePaymentData.value.map((p) => p.paymentType),
  (newPaymentTypes) => {
    if (paymentTotal.value) {
      newPaymentTypes.forEach((type, index) => {
        const payment = exchangePaymentData.value[index];

        //Caso o tipo de pagamento seja dinheiro ele tira o disable e deixa nulo a quantidade de parcelas e o valor delas
        if (type === 'MONEY') {
          disableValue.value = false;
          payment.value = '';
          payment.installment = { value: null, amount: null };
        } else {
          //Caso o tipo seja outro ele volta o disable e coloca o valor total no input value e deixa nulo a quantidade de parcelas e o valor delas
          disableValue.value = true;
          payment.value = Number(totalPricePayment.value).toFixed(2).toString();
          payment.installment = { value: null, amount: null };
        }

        //Caso o tipo de pagamento seja cartão de crédito ele ja coloca o parcelamento de 1X como padrão
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
  () => exchangePaymentData.value.map((p) => p.paymentType),
  (newTypes, oldTypes) => {
    newTypes.forEach((type, index) => {
      if (type !== oldTypes[index]) {
        const payment = exchangePaymentData.value[index];
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
      exchangePaymentData.value = [];
      createPayments(numPayments.value);
    }
  },
  { immediate: true },
);
watch(
  () => totalPaid.value,
  () => {
    if (totalPaid.value > Number(totalPricePayment.value)) {
      additionalPaymentData.change = totalPaid.value - Number(totalPricePayment.value);
    } else {
      additionalPaymentData.change = 0;
    }
  },
);

onMounted(async () => {
  await fetchReceiptsAndTypes();
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      style="min-width: 80vw"
      :class="
        loadingExchange ? 'bg-grey-2 form-basic column justify-between' : 'bg-grey-2 form-basic'
      "
    >
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="hasExchange ? 'Pagamento do estorno' : 'Pagamento da diferença'"
          icon="attach_money"
        />
      </q-card-section>
      <Loading :show="loadingExchange" />
      <q-card-section class="q-pa-sm" v-show="!loadingExchange">
        <q-form class="q-gutter-y-lg q-pa-md">
          <section v-if="!hasExchange" class="border-blue-light q-pa-lg q-gutter-y-sm">
            <TitlePage title="Entrega" icon="local_shipping" class="q-pa-none q-ma-none" />
            <q-toggle
              v-model="deliveryData.freight"
              label="Frete"
              size="lg"
              @click="clearDelivery"
            />
            <q-input
              label="R$ Valor do frete"
              v-model="deliveryData.freightValue"
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
              :disable="!deliveryData.freight"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" color="black" />
              </template>
            </q-input>
            <q-input
              v-model="deliveryData.cep"
              bg-color="white"
              label-color="black"
              outlined
              label="Digite o CEP"
              dense
              input-class="text-black"
              :loading="loading"
              maxlength="8"
              :disable="!deliveryData.freight"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="black" size="20px" />
              </template>
            </q-input>
            <div class="row justify-between">
              <q-input
                v-model="deliveryData.state"
                bg-color="white"
                label-color="black"
                outlined
                label="UF"
                dense
                input-class="text-black"
                class="input-divider"
                :disable="!deliveryData.freight"
              >
                <template v-slot:prepend>
                  <q-icon name="map" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="deliveryData.city"
                bg-color="white"
                label-color="black"
                outlined
                label="Cidade"
                dense
                input-class="text-black"
                class="input-divider"
                :disable="!deliveryData.freight"
              >
                <template v-slot:prepend>
                  <q-icon name="pin_drop" color="black" size="20px" />
                </template>
              </q-input>
            </div>
            <q-input
              v-model="deliveryData.neighborhood"
              bg-color="white"
              label-color="black"
              outlined
              label="Bairro"
              dense
              input-class="text-black"
              :disable="!deliveryData.freight"
            >
              <template v-slot:prepend>
                <q-icon name="pin_drop" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="deliveryData.address"
              bg-color="white"
              label-color="black"
              outlined
              label="Logradouro"
              dense
              input-class="text-black"
              :disable="!deliveryData.freight"
            >
              <template v-slot:prepend>
                <q-icon name="pin_drop" color="black" size="20px" />
              </template>
            </q-input>
            <div class="row justify-between">
              <q-input
                v-model="deliveryData.numberAddress"
                bg-color="white"
                label-color="black"
                outlined
                label="Número"
                dense
                input-class="text-black"
                class="input-divider"
                maxlength="15"
                mask="###############"
                :disable="!deliveryData.freight"
              >
                <template v-slot:prepend>
                  <q-icon name="numbers" color="black" size="20px" />
                </template>
              </q-input>
              <q-input
                v-model="deliveryData.complement"
                bg-color="white"
                label-color="black"
                outlined
                label="Complemento"
                dense
                input-class="text-black"
                class="input-divider"
                :disable="!deliveryData.freight"
              >
                <template v-slot:prepend>
                  <q-icon name="numbers" color="black" size="20px" />
                </template>
              </q-input>
            </div>
            <q-input
              v-model="deliveryData.recipientName"
              bg-color="white"
              label-color="black"
              outlined
              label="Nome do recebedor"
              dense
              input-class="text-black"
              :disable="!deliveryData.freight"
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
              :disable="!deliveryData.freight"
            >
              <template v-slot:prepend>
                <q-icon name="phone" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="deliveryData.observation"
              bg-color="white"
              label-color="black"
              outlined
              label="Observação"
              dense
              input-class="text-black no-resize"
              type="textarea"
              :disable="!deliveryData.freight"
            >
              <template v-slot:prepend>
                <q-icon name="description" color="black" size="20px" />
              </template>
            </q-input>
          </section>
          <section class="border-blue-light q-pa-md q-gutter-y-sm">
            <TitlePage title="Pagamentos" icon="payments" class="q-pa-none q-ma-none" />
            <div class="row q-gutter-x-md">
              <span class="text-bold text-h6 text-bold text-green"
                >Total: {{ formatToReal(totalPricePayment) }}</span
              >
              <span class="text-bold text-h6 text-bold text-blue-9"
                >Troco: {{ formatToReal(additionalPaymentData.change) }}</span
              >
              <span class="text-bold text-h6 text-bold text-red-9"
                >Faltando: {{ formatToReal(missingAmount.toString()) }}</span
              >
            </div>
            <q-input
              v-if="!hasExchange"
              label="R$ Valor de tarifas"
              v-model="additionalPaymentData.fees"
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
                v-for="(payments, index) in exchangePaymentData"
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
                      v-if="!isMoneyAndHasArrayPayment(scope.opt.value)"
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
                    :disable="disableValue"
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
              <q-input
                v-model="additionalPaymentData.description"
                bg-color="white"
                label-color="black"
                outlined
                label="Descrição"
                dense
                input-class="text-black no-resize"
                type="textarea"
              >
                <template v-slot:prepend>
                  <q-icon name="description" color="black" size="20px" />
                </template>
              </q-input>
            </div>
          </section>
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
            :loading="loadingExchange"
            unelevated
            no-caps
          />
          <q-btn
            v-if="
              exchange?.exchange_payment_method.length === 0 &&
              exchange?.difference_payment_method.length === 0
            "
            @click="save"
            color="primary"
            label="Realizar pagamento"
            size="md"
            :loading="loadingExchange"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
