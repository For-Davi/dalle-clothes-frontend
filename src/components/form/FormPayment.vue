<script setup lang="ts">
import TitlePage from '../shared/TitlePage.vue';
import { ref, computed, watch, onMounted } from 'vue';
import { formatToReal } from 'src/composables/Money';
import { storeToRefs } from 'pinia';
import { useEmployeeStore } from 'src/stores/employee-store';
import { useReceiptstore } from 'src/stores/receipt-store';
import { useTypesReceiptStore } from 'src/stores/types-receipt-store';
import { searchCep } from 'src/services/cep-service';
import { PaymentTypeLabels } from 'src/enums/payment-enum';
import Loading from '../shared/Loading.vue';

defineOptions({
  name: 'FormPayment',
});

const props = defineProps<{
  totalPrice: string;
  checkPaymentsReset: boolean;
  loadingSale: boolean;
}>();
const emit = defineEmits<{
  'send-missing-amount': [number];
}>();

const { listEmployee } = storeToRefs(useEmployeeStore());
const { listReceipt } = storeToRefs(useReceiptstore());
const { listTypesReceipt } = storeToRefs(useTypesReceiptStore());

const disableValue = ref<boolean>(false);
const paymentTotal = ref(true);
const paymentDivider = ref(false);
const numPayments = ref<number>(2);
const timer = ref<number | null>(null);
const totalPricePayment = ref<string>(props.totalPrice);
const searchFilter = ref<string>('');
const allowSearchCep = ref<boolean>(false);
const loading = ref<boolean>(false);
const model = defineModel<IVModelSalePayment>({
  default: () => ({
    sellerID: null,
    freight: false,
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
    observation: '',
    fees: '',
    couponID: null,
    payment: [],
  }),
});
const fetchEmployees = async (): Promise<void> => {
  await useEmployeeStore().getEmployees();
};
const fetchReceiptsAndTypes = async (): Promise<void> => {
  await useReceiptstore().getReceipt({ active: 1 });
  await useTypesReceiptStore().getTypesReceipt({ active: 1 });
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
const clearFreight = () => {
  model.value.freightValue = '';
  model.value.cep = '';
  model.value.state = '';
  model.value.city = '';
  model.value.neighborhood = '';
  model.value.address = '';
  model.value.numberAddress = '';
  model.value.complement = '';
  model.value.recipientName = '';
  model.value.recipientPhone = '';
};
const isMoneyAndHasArrayPayment = (label: string) => {
  return label === 'MONEY' && model.value.payment.some((p) => p.paymentType === 'MONEY');
};
const createPaymentsAfterReset = () => {
  createPayments(paymentTotal.value ? 1 : 2);
};
const reset = () => {
  model.value.freight = false;
  paymentTotal.value = true;
};

const formattedPhone = computed({
  get() {
    const phone = (model.value.recipientPhone || '').replace(/\D/g, '');

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

    model.value.recipientPhone = digits;
  },
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

const getInstallmentOptions = computed(() => {
  const total = Number(totalPricePayment.value);
  const options = [];

  if (paymentTotal.value) {
    for (let i = 2; i <= 12; i++) {
      const installmentValue = total / i;
      const amountValue = installmentValue.toFixed(2);

      options.push({
        label: `${i}X - R$ ${amountValue}`,
        value: i,
        amount: amountValue.toString(),
      });
    }
    options.unshift({
      label: `1X - R$ ${Number(totalPricePayment.value).toFixed(2)}`,
      value: 1,
      amount: null,
    });
  }

  return options;
});
const listEmployeeOptions = computed(() => {
  const options = listEmployee.value.map((employee) => ({
    label: employee.name,
    value: employee.id || null,
  }));

  options.unshift({
    label: 'Nenhum vendedor selecionado',
    value: null,
  });

  if (!searchFilter.value || searchFilter.value.toLowerCase() === 'nenhum vendedor selecionado') {
    return options;
  }

  const needle = searchFilter.value.toLowerCase();
  return options.filter((option) => option.label.toLowerCase().includes(needle));
});
const getTypes = computed(() => {
  return listTypesReceipt.value.map((type: ITypesReceipt) => ({
    label: PaymentTypeLabels[type.name as keyof typeof PaymentTypeLabels],
    value: type.name,
  }));
});

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
    if (paymentTotal.value) {
      newPaymentTypes.forEach((type, index) => {
        const payment = model.value.payment[index];

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
watch(
  () => props.checkPaymentsReset,
  () => {
    createPaymentsAfterReset();
    reset();
  },
);
watch(
  () => missingAmount.value,
  () => {
    emit('send-missing-amount', missingAmount.value);
  },
);
//Cada vez que o valor pago mudar ele verifica se ele é maior que o preço total, caso seja ele possui troco
watch(
  () => totalPaid.value,
  () => {
    if (totalPaid.value > Number(totalPricePayment.value)) {
      model.value.change = (totalPaid.value - Number(totalPricePayment.value))
        .toFixed(2)
        .toString();
    } else {
      model.value.change = '0.00';
    }
  },
);
//Integração com o cep API
watch(
  () => model.value.cep,
  async (cep) => {
    if (cep !== null) {
      model.value.cep = model.value.cep?.replace(/\D/g, '') ?? null;
      if (allowSearchCep.value) {
        if (cep.trim().length === 8) {
          loading.value = true;
          const response = await searchCep(cep);
          if (response.status === 200) {
            model.value.neighborhood = response.data.bairro;
            model.value.state = response.data.estado;
            model.value.city = response.data.localidade;
            model.value.address = response.data.logradouro;
          }
        } else {
          model.value.neighborhood = '';
          model.value.state = '';
          model.value.city = '';
          model.value.address = '';
        }
      } else {
        allowSearchCep.value = true;
      }
    }
    loading.value = false;
  },
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
//Caso o frete ou as tarifas mudem eles ja são somados ao total
watch(
  [() => model.value.freightValue, () => model.value.fees],
  ([freight, fees]) => {
    const freightValue = Number(freight);
    const feesValue = Number(fees);
    const total = Number(props.totalPrice);

    totalPricePayment.value = (total + freightValue + feesValue).toString();
  },
  { immediate: true },
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

onMounted(async () => {
  await fetchEmployees();
  await fetchReceiptsAndTypes();
});
</script>

<template>
  <q-card class="column form-basic-no-modal justify-between" flat bordered>
    <q-card-section class="q-pa-none">
      <TitlePage title="Formulário de venda" icon="shopping_cart" />
    </q-card-section>
    <Loading :show="props.loadingSale" />
    <q-card-section v-if="!props.loadingSale">
      <div class="q-gutter-y-lg">
        <section class="border-blue-light q-pa-md">
          <TitlePage title="Vendedor" icon="person" class="q-pa-none q-ma-none" />
          <q-select
            v-model="model.sellerID"
            label="Selecione um vendedor"
            :options="listEmployeeOptions"
            emit-value
            map-options
            hide-selected
            dense
            options-dense
            use-input
            fill-input
            clearable
            outlined
            input-debounce="1"
            @input-value="(val: string) => (searchFilter = val)"
          />
        </section>

        <section class="border-blue-light q-pa-md q-gutter-y-sm">
          <TitlePage title="Entrega" icon="local_shipping" class="q-pa-none q-ma-none" />
          <q-toggle v-model="model.freight" label="Frete" size="lg" @click="clearFreight" />
          <q-input
            label="R$ Valor do frete"
            v-model="model.freightValue"
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
            :disable="!model.freight"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" color="black" />
            </template>
          </q-input>
          <q-input
            v-model="model.cep"
            bg-color="white"
            label-color="black"
            outlined
            label="Digite o CEP"
            dense
            input-class="text-black"
            :loading="loading"
            maxlength="8"
            :disable="!model.freight"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="black" size="20px" />
            </template>
          </q-input>
          <div class="row justify-between">
            <q-input
              v-model="model.state"
              bg-color="white"
              label-color="black"
              outlined
              label="UF"
              dense
              input-class="text-black"
              class="input-divider"
              :disable="!model.freight"
            >
              <template v-slot:prepend>
                <q-icon name="map" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="model.city"
              bg-color="white"
              label-color="black"
              outlined
              label="Cidade"
              dense
              input-class="text-black"
              class="input-divider"
              :disable="!model.freight"
            >
              <template v-slot:prepend>
                <q-icon name="pin_drop" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="model.neighborhood"
            bg-color="white"
            label-color="black"
            outlined
            label="Bairro"
            dense
            input-class="text-black"
            :disable="!model.freight"
          >
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="model.address"
            bg-color="white"
            label-color="black"
            outlined
            label="Logradouro"
            dense
            input-class="text-black"
            :disable="!model.freight"
          >
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
            </template>
          </q-input>
          <div class="row justify-between">
            <q-input
              v-model="model.numberAddress"
              bg-color="white"
              label-color="black"
              outlined
              label="Número"
              dense
              input-class="text-black"
              class="input-divider"
              maxlength="15"
              mask="###############"
              :disable="!model.freight"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="model.complement"
              bg-color="white"
              label-color="black"
              outlined
              label="Complemento"
              dense
              input-class="text-black"
              class="input-divider"
              :disable="!model.freight"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="model.recipientName"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome do recebedor"
            dense
            input-class="text-black"
            :disable="!model.freight"
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
            :disable="!model.freight"
          >
            <template v-slot:prepend>
              <q-icon name="phone" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="model.observation"
            bg-color="white"
            label-color="black"
            outlined
            label="Observação"
            dense
            input-class="text-black no-resize"
            type="textarea"
            :disable="!model.freight"
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
              >Troco: {{ formatToReal(model.change) }}</span
            >
            <span class="text-bold text-h6 text-bold text-red-9"
              >Faltando: {{ formatToReal(missingAmount.toString()) }}</span
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
          <q-select
            v-model="model.couponID"
            label="Selecione um cupom de desconto"
            disable
            outlined
            dense
          >
            <template v-slot:prepend>
              <q-icon name="sell" color="black" />
            </template>
          </q-select>
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
            />
          </div>
          <div class="q-gutter-y-lg q-mt-xs">
            <div class="q-gutter-y-sm" v-for="(payments, index) in model.payment" :key="index">
              <q-select
                v-model="payments.paymentType"
                :options="getTypes"
                label="Selecione a forma de pagamento"
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
                    paymentDivider && payments.paymentType === 'CREDIT_CARD'
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
                  v-if="paymentDivider && payments.paymentType === 'CREDIT_CARD'"
                  label="Quantidade de parcelas"
                  v-model="payments.installment.value"
                  @input="(val: string) => (payments.installment.value = val ? Number(val) : null)"
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
                  v-model="payments.installment.amount"
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
                v-model="payments.receiptID"
                label="Selecione o recebimento"
                :options="getReceiptOptions(payments.paymentType)"
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
      </div>
    </q-card-section>
  </q-card>
</template>
