<script setup lang="ts">
import { computed, ref, watch, reactive } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import TableForReturnSaleOrReturnProducts from '../table/TableForReturnSaleOrReturnProducts.vue';
import TableReturnProducts from '../table/TableReturnProducts.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { storeToRefs } from 'pinia';
import { useSaleStore } from 'src/stores/sale-store';
import { useReturnStore } from 'src/stores/return-store';
import { useEmployeeStore } from 'src/stores/employee-store';
import { formatToReal } from 'src/composables/Money';
import TableListProducts from '../table/TableListProducts.vue';
import TableExchangeItems from '../table/TableExchangeItems.vue';
import { checkDataCreateReturn } from 'src/composables/CheckData';
import FormExchangePayment from './FormExchangePayment.vue';
import Loading from '../shared/Loading.vue';

defineOptions({
  name: 'FormReturn',
});

const props = defineProps<{
  data: {
    open: boolean;
    saleID: number | null;
    returnID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
  'show:coupon': [IExchangeCouponData];
}>();

const quantity = ref<number>(1);
const returnData = ref<IReturnData[]>([]);
const localProducts = ref<ISaleItens[] | IDataReturnItens[]>([]);
const exchangeProducts = ref<IClientCartProduct[]>([]);
const sellerID = ref<number | null>(null);
const generatesCredit = ref<1 | 0>(0);
const searchFilter = ref<string>('');
const returnQuantities = ref<Record<number, Record<number, number>>>({});
const showFormExchangePayment = reactive({
  open: false as boolean,
  exchange: null as IExchange | null,
  hasExchangeItem: false as boolean,
  generateCredit: 0 as number,
});
const missingAmount = ref<number>(0);
const missingAmountFreight = ref<number>(0);
const formExchangeModel = reactive<IVModelReturnPayment>({
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
});

const { listSaleProducts, loadingListSaleProducts } = storeToRefs(useSaleStore());
const { listReturnItems, loadingReturn } = storeToRefs(useReturnStore());
const { listEmployee } = storeToRefs(useEmployeeStore());

const fetchSaleProduct = async () => {
  if (props.data.saleID) {
    await useSaleStore().getSaleItens(props.data.saleID);
    localProducts.value = listSaleProducts.value.map((p: ISaleItens) => ({
      ...p,
      returnQuantity: 0,
    }));
  }
};

const fetchReturnProduct = async () => {
  if (props.data.returnID) {
    await useReturnStore().getReturnItems(props.data.returnID);
    localProducts.value = listReturnItems.value.map((p: IDataReturnItens) => ({
      ...p,
      returnQuantity: 0,
    }));
  }
};
const fetchSellers = async () => {
  await useEmployeeStore().getEmployees();
};
const createReturnData = (count: number) => {
  for (let i = 0; i < count; i++) {
    returnData.value.push({
      products: [],
      reason: '',
      description: '',
    });
  }
};
const addToReturnTable = (product: IDataReturnItens, index: number) => {
  const products = returnData.value[index].products;

  const existing = products.find(
    (p) => p.product_variant_id != null && p.product_variant_id === product.product_variant_id,
  );

  if (existing) {
    if (
      product.returnQuantity > existing.quantity ||
      existing.returnQuantity >= existing.quantity
    ) {
      createErrorData('A quantidade limite do produto para sua devolução foi atingida');
    } else {
      existing.returnQuantity += product.returnQuantity;
    }
  } else {
    products.push({
      ...product,
      returnQuantity: product.returnQuantity,
    });
  }
};
const addToExchangeTable = (product: IClientCartProduct) => {
  const hasReturnProducts = returnData.value.some((item) => item.products.length === 0);
  if (hasReturnProducts || !product.quantity || product.quantity === 0) {
    createErrorData('Adicione ao menos um produto para devolução antes de inserir itens na troca');
  } else {
    exchangeProducts.value.push(product);
  }
};
const removeFromReturnTable = (id: number, index: number) => {
  const productIndex = returnData.value[index].products.findIndex(
    (p) => p.product_variant_id === id,
  );

  if (productIndex !== -1) {
    returnData.value[index].products.splice(productIndex, 1);
  }
};
const removeFromExchangeTable = (id: number) => {
  const index = exchangeProducts.value.findIndex((p) => p.product_variant_id === id);

  if (index !== -1) {
    exchangeProducts.value.splice(index, 1);
  }
};
const close = () => {
  open.value = false;
  returnData.value = [];
  quantity.value = 1;
  returnQuantities.value = {};
  exchangeProducts.value = [];
  sellerID.value = null;
  generatesCredit.value = 0;
  searchFilter.value = 'Nenhum vendedor selecionado';
  closeFormPayment(false);
};
const save = async () => {
  const check = checkDataCreateReturn(
    {
      saleID: props.data.saleID!,
      returnID: props.data.returnID,
      sellerID: sellerID.value,
      returnData: returnData.value,
      exchangeData: {
        generatesCredit: generatesCredit.value,
        exchangeValue: refundValue.value,
        differenceValue: differenceRefundValue.value,
      },
      exchangeProducts: exchangeProducts.value,
      paymentData: formExchangeModel,
    },
    missingAmount.value,
    missingAmountFreight.value,
  );

  if (check.status) {
    const response = await useReturnStore().createReturn({
      saleID: props.data.saleID!,
      returnID: props.data.returnID,
      sellerID: sellerID.value,
      returnData: returnData.value,
      exchangeData: {
        generatesCredit: generatesCredit.value,
        exchangeValue: refundValue.value,
        differenceValue: differenceRefundValue.value,
      },
      exchangeProducts: exchangeProducts.value,
      paymentData: formExchangeModel,
    });
    if (response?.status === 201) {
      if (response.data.coupon) {
        emit('show:coupon', response.data.coupon);
      }
      close();
    }
  } else {
    createErrorData(check.message || 'Erro ao enviar dados da devolução');
  }
};
const updateQuantity = (formIndex: number, productId: number, value: number) => {
  if (!returnQuantities.value[formIndex]) {
    returnQuantities.value[formIndex] = {};
  }

  returnQuantities.value[formIndex][productId] = value;
};
const openFormPayment = (
  open: boolean,
  saleID: number | null,
  differenceValue: number,
  exchangeValue: number,
  generateCredit: number,
) => {
  Object.assign(showFormExchangePayment, {
    open,
    exchange: {
      saleID: saleID,
      differenceValue: differenceValue,
      exchangeValue: exchangeValue,
      hasExchangeItem: exchangeProducts.value.length > 0 ? true : false,
      generateCredit: generateCredit,
    },
  });
};
const closeFormPayment = (open: boolean) => {
  Object.assign(showFormExchangePayment, {
    open,
    exchange: null,
    hasExchangeItem: false,
    generateCredit: 0,
  });
};
const sendMissingsAmountsAndSave = async (amount: number, amountFreight: number) => {
  missingAmount.value = amount;
  missingAmountFreight.value = amountFreight;
  await save();
};

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
const optionsReasons = computed(() => {
  return [
    {
      label: 'Produto com defeito',
      value: 'defect',
    },
    {
      label: 'Produto violado',
      value: 'violated',
    },
    {
      label: 'Produto diferente do padrão',
      value: 'out_of_standard',
    },
    {
      label: 'Produto errado enviado',
      value: 'wrong_sent',
    },
    {
      label: 'Atraso na entrega',
      value: 'delivery_delay',
    },
    {
      label: 'Produto errado comprado',
      value: 'wrong_bought',
    },
    {
      label: 'Insatisfação do cliente',
      value: 'dissatisfaction',
    },
    {
      label: 'Compra duplicada',
      value: 'duplicate_order',
    },
    {
      label: 'Incompatibilidade',
      value: 'incompatible',
    },
    {
      label: 'Desistência/Arrependimento',
      value: 'regret',
    },
    {
      label: 'Problemas com pagamento',
      value: 'payment_issue',
    },
    {
      label: 'Não informado',
      value: 'not_informed',
    },
  ];
});
const refundValue = computed(() => {
  const returnTotal = returnData.value.reduce((total, item) => {
    const subtotal = item.products.reduce((sum, product) => {
      return sum + product.product_price * product.returnQuantity;
    }, 0);

    return total + subtotal;
  }, 0);

  const shiftTotal = exchangeProducts.value.reduce((total, product) => {
    const price =
      product.offer !== '0.00' && product.offer !== null ? product.offer : product.price;
    return total + Number(price) * product.quantity;
  }, 0);

  const total = returnTotal - shiftTotal;

  if (total < 0) {
    return 0;
  }
  return total;
});
const differenceRefundValue = computed(() => {
  const returnTotal = returnData.value.reduce((total, item) => {
    const subtotal = item.products.reduce((sum, product) => {
      return sum + product.product_price * product.returnQuantity;
    }, 0);

    return total + subtotal;
  }, 0);

  const shiftTotal = exchangeProducts.value.reduce((total, product) => {
    const price =
      product.offer !== '0.00' && product.offer !== null ? product.offer : product.price;
    return total + Number(price) * product.quantity;
  }, 0);

  const total = returnTotal - shiftTotal;

  if (total > 0) {
    return 0;
  }
  return Math.abs(total);
});
const listEmployeeOptions = computed(() => {
  const options = listEmployee.value
    .map((employee) => ({
      label: employee.name,
      value: employee.id || null,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));

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
const cartIds = computed(() => exchangeProducts.value.map((p) => p.product_variant_id));
const returnedQuantities = computed(() => {
  const map: Record<number, number> = {};

  returnData.value.forEach((item) => {
    item.products.forEach((product) => {
      map[product.product_variant_id] =
        (map[product.product_variant_id] || 0) + product.returnQuantity;
    });
  });

  return map;
});
const availableProducts = computed((): ISaleItens[] | IDataReturnItens[] => {
  return localProducts.value.filter((product) => {
    const returned = returnedQuantities.value[product.product_variant_id] ?? 0;
    return product.quantity - returned > 0;
  }) as ISaleItens[] | IDataReturnItens[];
});

watch(
  () => quantity,
  () => {
    if (props.data.open) {
      if (quantity.value <= 0) {
        quantity.value = 1;
      }
      if (quantity.value > 12) {
        quantity.value = 12;
      }
      returnData.value = [];
      createReturnData(quantity.value);
    }
  },
  { immediate: true, deep: true },
);
watch(
  () => props.data.open,
  () => {
    if (props.data.open) {
      returnData.value = [];
      createReturnData(1);
    }
  },
  { immediate: true, deep: true },
);
watch(
  () => props.data.open,
  async () => {
    if (props.data.open) {
      if (props.data.returnID) {
        await fetchReturnProduct();
      } else {
        await fetchSaleProduct();
      }
      await fetchSellers();
    }
  },
);
</script>

<template>
  <q-dialog v-model="open" :maximized="$q.screen.lt.sm">
    <q-card
      style="min-width: 70vw"
      :class="
        loadingReturn ? 'bg-grey-2 form-basic column justify-between' : 'bg-grey-2 form-basic'
      "
    >
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="
            props.data.returnID !== null
              ? 'Formulário de vinculação de devolução'
              : 'Formulário de devolução'
          "
          icon="assignment_return"
        />
      </q-card-section>
      <q-card-section>
        <Loading v-show="loadingReturn" :show="loadingReturn" />
        <div class="q-gutter-y-lg" v-show="!loadingReturn">
          <TitlePage
            title="Itens devolvidos do cliente"
            icon="assignment_return"
            class="q-pa-none"
          />
          <q-input
            v-model="quantity"
            label="Quantidade de devoluções (por motivo)"
            type="number"
            outlined
            dense
            bg-color="white"
            input-class="text-black no-spinners"
          />

          <div class="q-mb-lg" v-for="(item, index) in returnData" :key="index">
            <div class="q-gutter-y-sm">
              <TableForReturnSaleOrReturnProducts
                :rows="availableProducts"
                :loading="props.data.returnID !== null ? loadingReturn : loadingListSaleProducts"
                :type="props.data.returnID !== null ? 'linked' : 'return'"
                :returned-quantities="returnedQuantities"
                :form-index="index"
                :quantities="returnQuantities[index] || {}"
                @add-to-return="(product: IDataReturnItens) => addToReturnTable(product, index)"
                @update-quantity="updateQuantity"
              />
              <TableReturnProducts
                v-model="item.products"
                :rows="item.products"
                @remove-from-return="(id: number) => removeFromReturnTable(id, index)"
              />
              <q-select
                v-model="item.reason"
                :options="optionsReasons"
                label="Selecione o motivo"
                outlined
                dense
                options-dense
                emit-value
                map-options
                bg-color="white"
                label-color="black"
              >
                <template v-slot:prepend>
                  <q-icon name="description" color="black" size="20px" />
                </template>
              </q-select>
              <q-input
                v-model="item.description"
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
              <q-separator
                v-if="returnData.length > 1 && returnData.length - 1 !== index"
                color="light-blue-9"
                class="q-mb-lg q-mt-lg"
              />
            </div>
          </div>
          <div class="q-mt-xl">
            <TitlePage title="Troca de itens" icon="assignment_return" class="q-pa-none" />
            <q-select
              class="q-mb-lg bg-white"
              outlined
              v-model="sellerID"
              label="Selecione o vendedor que efetuou a troca"
              :options="listEmployeeOptions"
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
            <q-toggle
              v-model="generatesCredit"
              label="Gerar crédito a partir do estorno ao cliente?"
              class="text-body1"
              checked-icon="check"
              color="primary"
              unchecked-icon="clear"
              :true-value="1"
              :false-value="0"
              :disable="refundValue <= 0"
            />
            <TableListProducts
              class="q-mt-md"
              :hidden-ids="cartIds"
              @add-to-cart="addToExchangeTable"
            />
            <TableExchangeItems
              class="q-mt-md"
              :rows="exchangeProducts"
              @remove-from-shift="removeFromExchangeTable"
            />
          </div>
          <div class="flex justify-end q-pa-sm q-gutter-x-lg">
            <span class="text-h5 text-green-8 text-weight-medium"
              >Estorno: {{ formatToReal(refundValue) }}
            </span>
            <span class="text-h5 text-red-8 text-weight-medium"
              >Diferença a pagar: {{ formatToReal(differenceRefundValue) }}
            </span>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="close"
            :loading="loadingReturn"
            unelevated
            no-caps
            flat
          />
          <q-btn
            v-if="generatesCredit && exchangeProducts.length === 0"
            @click="save()"
            :loading="loadingReturn"
            color="primary"
            label="Salvar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="
              openFormPayment(
                true,
                props.data.saleID,
                differenceRefundValue,
                refundValue,
                generatesCredit,
              )
            "
            color="primary"
            label="Avançar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Modals -->
  <FormExchangePayment
    :data="showFormExchangePayment"
    v-model="formExchangeModel"
    @update:open="closeFormPayment(false)"
    @send:missings-amounts="sendMissingsAmountsAndSave"
  />
</template>
