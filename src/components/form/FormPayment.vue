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

defineOptions({
  name: 'FormPayment',
});

const props = defineProps<{
  totalPrice: string;
  checkPaymentsReset: boolean;
}>();
const emit = defineEmits<{
  'send-missing-amount': [number];
}>();

const { listEmployee } = storeToRefs(useEmployeeStore());
const { listReceipt } = storeToRefs(useReceiptstore());
const { listTypesReceipt } = storeToRefs(useTypesReceiptStore());

const paymentTotal = ref(true);
const paymentDivider = ref(false);
const showAddress = ref(false);
const numPayments = ref<number>(2);
const totalPricePayment = ref<string>(props.totalPrice);
const searchFilter = ref<string>('');
const allowSearchCep = ref<boolean>(false);
const loading = ref<boolean>(false);
const model = defineModel<IVModelSalePayment>({
  default: () => ({
    sellerID: null,
    freight: '',
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
  model.value.payment = [];
  for (let i = 0; i < count; i++) {
    model.value.payment.push({
      paymentType: null,
      value: '',
      receiptID: null,
      installment: null,
    });
  }
};
const getReceiptOptions = (paymentType: string | null) => {
  if (paymentType) {
    const options = listReceipt.value
      .filter((r) => r.type?.name === paymentType)
      .map((r) => ({
        label: r.identifier,
        value: r.id || null,
      }));

    options.unshift({
      label: 'Sem recebimento',
      value: null,
    });

    return options;
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
  model.value.payment.reduce((sum, p) => sum + Number(p.value || 0), 0),
);
const missingAmount = computed(() => {
  const payments = model.value.payment;
  const hasInstallment = payments.some((p) => p.installment !== null && p.installment.value > 1);
  if (hasInstallment) return 0;
  const diff = Number(totalPricePayment.value) - totalPaid.value;
  return diff > 0 ? diff : 0;
});

const totalForInstallment = computed(() => {
  const total = Number(totalPricePayment.value) - totalPaid.value;
  return total > 0 ? total : 0;
});
const getInstallmentOptions = computed(() => {
  const total = totalForInstallment.value || 0;
  const options = [];

  for (let i = 2; i <= 13; i++) {
    const installmentValue = total / i;
    const amountValue = installmentValue.toFixed(2);

    options.push({
      label: `${i}X - R$ ${amountValue}`,
      value: i,
      amount: amountValue.toString(),
    });
  }
  options.unshift({
    label: 'Sem parcelamento',
    value: null,
    amount: null,
  });

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
  () => props.checkPaymentsReset,
  () => {
    createPaymentsAfterReset();
  },
);
watch(
  () => missingAmount.value,
  () => {
    emit('send-missing-amount', missingAmount.value);
  },
);
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

watch(
  [paymentTotal, paymentDivider, numPayments],
  ([isTotal, isDivider, count]) => {
    if (isTotal) {
      createPayments(1);
    } else if (isDivider) {
      createPayments(count <= 2 ? 2 : count);
    }
  },
  { immediate: true, deep: true },
);

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
    <q-card-section>
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
          <q-toggle v-model="showAddress" label="Frete" size="lg" @click="clearFreight" />
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
            :disable="showAddress === false ? true : false"
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
            :disable="showAddress === false ? true : false"
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
              :disable="showAddress === false ? true : false"
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
              :disable="showAddress === false ? true : false"
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
            :disable="showAddress === false ? true : false"
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
            :disable="showAddress === false ? true : false"
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
              :disable="showAddress === false ? true : false"
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
              :disable="showAddress === false ? true : false"
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
          <div v-if="paymentDivider" class="q-gutter-y-sm q-mb-sm">
            <q-input
              label="Informe a quantidade de formas de pagamento"
              type="number"
              v-model="numPayments"
              outlined
              dense
              input-class="text-black no-spinners"
            />
          </div>
          <div class="q-gutter-y-xl q-mt-sm">
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

              <q-input
                v-if="
                  !payments.installment ||
                  payments.installment?.value === null ||
                  payments.installment?.amount === null
                "
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
              <div v-if="payments.paymentType === 'CREDIT_CARD'" class="q-gutter-y-sm">
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
            </div>
          </div>
        </section>
      </div>
    </q-card-section>
  </q-card>
</template>
