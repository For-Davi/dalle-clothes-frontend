<script setup lang="ts">
import { computed, ref, watch, reactive } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { useExchangeStore } from 'src/stores/exchange-store';
import { PaymentTypeLabels } from 'src/enums/payment-enum';
import { useTypesReceiptStore } from 'src/stores/types-receipt-store';
import { useReceiptstore } from 'src/stores/receipt-store';
import { formatToReal } from 'src/composables/Money';
import { useClientStore } from 'src/stores/client-store';
import { useReturnStore } from 'src/stores/return-store';

defineOptions({
  name: 'FormExchangePayment',
});

const props = defineProps<{
  open: boolean;
  saleID: number | null;
  freightValue: number;
}>();
const emit = defineEmits<{
  'update:open': [void];
  'send:data': [number];
  'new-request': [void];
}>();

const { loadingExchange } = storeToRefs(useExchangeStore());
const { loadingClient } = storeToRefs(useClientStore());
const { listTypesReceipt } = storeToRefs(useTypesReceiptStore());
const { listReceipt } = storeToRefs(useReceiptstore());
const { loadingReturn } = storeToRefs(useReturnStore());

const clientCredit = ref<number | null>(null);
const paymentTotal = ref(true);
const paymentDivider = ref(false);
const numPayments = ref<number>(2);
const disableValue = ref<boolean>(false);
const timer = ref<number | null>(null);
const model = defineModel<IPaymentData>({
  default: () => ({
    change: '',
    fees: '',
    payment: [],
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
    model.value.payment = [];
    for (let i = 0; i < count; i++) {
      model.value.payment.push({
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
    model.value.payment = [];
    for (let i = 0; i < count; i++) {
      model.value.payment.push({
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
  clientCredit.value = await useClientStore().getClientCredit(props.saleID ?? 0);
};

const clear = () => {
  paymentTotal.value = true;
};
const isRestrictedTypeAndAlreadySelected = (type: string) => {
  const restrictedTypes = ['MONEY', 'CREDIT'];

  if (!restrictedTypes.includes(type) || paymentTotal.value) return false;

  return model.value.payment.some((p) => p.paymentType === type);
};

const getInstallmentOptions = computed(() => {
  const total = Number(totalPricePayment.value);
  const options = [];

  if (paymentTotal.value) {
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
const totalPricePayment = computed(() => {
  const base = Number(totalFreight.value ?? 0);
  const fees = Number(model.value.fees ?? 0);

  return (base + fees).toFixed(2);
});
const totalFreight = computed(() => {
  return props.freightValue;
});
const totalPaid = computed(() =>
  model.value.payment.reduce(
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
  if ((clientCredit.value ?? 0) === 0) {
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
  const payments = model.value.payment;

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
  get: () => props.open,
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
  () => model.value.payment.map((p) => p.installment.value),
  (installments) => {
    if (paymentDivider.value) {
      installments.forEach((val, index) => {
        if ((val ?? 0) > 12) {
          model.value.payment[index].installment.value = 12;
        }
      });
    }
  },
  { deep: true },
);
watch(
  () => model.value.payment,
  (newPayments) => {
    newPayments.forEach((payment, index) => {
      if (Number(payment.value) > 0 && payment.installment.value !== null) {
        const payment = model.value.payment[index];
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
  () => model.value.payment.map((p) => p.paymentType),
  (newTypes, oldTypes) => {
    newTypes.forEach((type, index) => {
      if (type !== oldTypes[index]) {
        const payment = model.value.payment[index];
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
    model.value.payment.forEach((payment) => {
      if (payment.paymentType !== 'MONEY') {
        disableValue.value = true;
        payment.value = Number(totalPricePayment.value).toFixed(2).toString();
      }
    });
  }
});
watch(
  () => model.value.payment.map((p) => p.paymentType),
  (newPaymentTypes) => {
    if (paymentDivider.value) {
      newPaymentTypes.forEach((type, index) => {
        const payment = model.value.payment[index];

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
  () => model.value.payment.map((p) => p.paymentType),
  (newPaymentTypes) => {
    if (paymentTotal.value) {
      newPaymentTypes.forEach((type, index) => {
        const payment = model.value.payment[index];

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
        if (type === 'CREDIT_CARD') {
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
  () => model.value.payment.map((p) => p.paymentType),
  (newTypes, oldTypes) => {
    newTypes.forEach((type, index) => {
      if (type !== oldTypes[index]) {
        const payment = model.value.payment[index];
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
      model.value.payment = [];
      createPayments(numPayments.value);
    }
  },
  { immediate: true },
);
watch(
  () => totalPaid.value,
  () => {
    let creditValue = 0;

    model.value.payment.forEach((p) => {
      if (p.paymentType === 'CREDIT') {
        creditValue += Number(p.value);
      }
    });
    if (totalPaid.value > Number(totalPricePayment.value)) {
      const change = totalPaid.value - Number(totalPricePayment.value) - creditValue;
      model.value.change = change > 0 ? change.toFixed(2).toString() : '0.00';
    } else {
      model.value.change = '0.00';
    }
  },
);
watch(
  () => props.open,
  async () => {
    if (props.open) {
      await fetchClientCredit();
      await fetchReceiptsAndTypes();
    }
  },
);
</script>
<template>
  <section>
    <Loading :show="loadingExchange || loadingClient || loadingReturn" />
    <q-card-section class="q-pa-sm" v-show="!(loadingExchange || loadingClient || loadingReturn)">
      <q-form class="q-gutter-y-lg q-pa-md">
        <section class="border-blue-light q-pa-md q-gutter-y-sm">
          <TitlePage title="Pagamentos do frete" icon="payments" class="q-pa-none q-ma-none" />
          <div class="row q-gutter-x-md">
            <span class="text-bold text-h6 text-bold text-green"
              >Total: {{ formatToReal(totalPricePayment) }}</span
            >
            <span class="text-bold text-h6 text-bold text-blue-9"
              >Troco: {{ formatToReal(model.change) }}</span
            >
            <span class="text-bold text-h6 text-bold text-red-9"
              >Faltando: {{ formatToReal(missingAmount.toString()) }}</span
            >
          </div>
          <div v-if="clientCredit && clientCredit > 0" class="flex column q-pa-xs">
            <span class="text-bold text-h6 text-bold text-black"
              >Este cliente possui um crédito de {{ formatToReal(clientCredit) }}</span
            >
          </div>
          <q-input
            label="R$ Valor de tarifas"
            v-model="model.fees"
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
            <div class="q-gutter-y-sm" v-for="(payments, index) in model.payment" :key="index">
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
                    paymentDivider && payments.paymentType === 'CREDIT_CARD'
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
                  v-if="paymentDivider && payments.paymentType === 'CREDIT_CARD'"
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
                  v-if="paymentDivider && payments.paymentType === 'CREDIT_CARD'"
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
                v-if="paymentTotal && payments.paymentType === 'CREDIT_CARD'"
                class="q-gutter-y-sm"
              >
                <q-select
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
      </q-form>
    </q-card-section>
  </section>
</template>
