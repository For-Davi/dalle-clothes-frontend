<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import TableSaleProducts from '../table/TableSaleProducts.vue';
import TableReturnProducts from '../table/TableReturnProducts.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { storeToRefs } from 'pinia';
import { useSaleStore } from 'src/stores/sale-store';
import { formatToReal } from 'src/composables/Money';
import TableListProducts from '../table/TableListProducts.vue';
import TableShiftItems from '../table/TableShiftItems.vue';

defineOptions({
  name: 'FormReturn',
});

const props = defineProps<{
  data: {
    open: boolean;
    saleID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const quantity = ref<number>(1);
const returnData = ref<IReturnData[]>([]);
const localProducts = ref<ISaleItens[]>([]);
const shiftLocalProducts = ref<IClientCartProduct[]>([]);

const { listSaleProducts, loadingListSaleProducts } = storeToRefs(useSaleStore());

const fetchProduct = async () => {
  if (props.data.saleID) {
    await useSaleStore().getSaleItens(props.data.saleID);
  }
  localProducts.value = listSaleProducts.value.map((p: ISaleItens) => ({
    ...p,
    returnQuantity: 0,
  }));
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
const addToReturnTable = (product: IReturnItens, index: number) => {
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
const removeFromReturnTable = (id: number, index: number) => {
  const productIndex = returnData.value[index].products.findIndex(
    (p) => p.product_variant_id === id,
  );

  if (productIndex !== -1) {
    returnData.value[index].products.splice(productIndex, 1);
  }
};
const removeFromShiftTable = (id: number) => {
  const index = shiftLocalProducts.value.findIndex((p) => p.product_variant_id === id);

  if (index !== -1) {
    shiftLocalProducts.value.splice(index, 1);
  }
};
const close = () => {
  open.value = false;
  returnData.value = [];
  quantity.value = 1;
};

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
const optionsReasons = computed(() => {
  return [
    {
      label: 'Produto com defeito',
      value: 'DEFECT',
    },
    {
      label: 'Produto violado',
      value: 'VIOLATED',
    },
    {
      label: 'Produto diferente do padrão',
      value: 'OUT_OF_STANDARD',
    },
    {
      label: 'Produto errado enviado',
      value: 'WRONG_SENT',
    },
    {
      label: 'Produto não recebido',
      value: 'NOT_RECEIVED',
    },
    {
      label: 'Atraso na entrega',
      value: 'DELIVERY_DELAY',
    },
    {
      label: 'Produto errado comprado',
      value: 'WRONG_BOUGHT',
    },
    {
      label: 'Insatisfação do cliente',
      value: 'DISSATISFACTION',
    },
    {
      label: 'Compra duplicada',
      value: 'DUPLICATE_ORDER',
    },
    {
      label: 'Incompatibilidade',
      value: 'INCOMPATIBLE',
    },
    {
      label: 'Desistência/Arrependimento',
      value: 'REGRET',
    },
    {
      label: 'Problemas com pagamento',
      value: 'PAYMENT_ISSUE',
    },
    {
      label: 'Não informado',
      value: null,
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

  const shiftTotal = shiftLocalProducts.value.reduce((total, product) => {
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

  const shiftTotal = shiftLocalProducts.value.reduce((total, product) => {
    const price =
      product.offer !== '0.00' && product.offer !== null ? product.offer : product.price;
    return total + Number(price) * product.quantity;
  }, 0);

  const total = returnTotal - shiftTotal;

  if (total > 0) {
    return 0;
  }
  return total;
});
const addToShiftTable = (product: IClientCartProduct) => {
  const hasReturnProducts = returnData.value.some((item) => item.products.length === 0);
  if (hasReturnProducts || !product.quantity || product.quantity === 0) {
    createErrorData('Adicione ao menos um produto para devolução antes de inserir itens na troca');
  } else {
    shiftLocalProducts.value.push(product);
  }
};
const cartIds = computed(() => shiftLocalProducts.value.map((p) => p.product_variant_id));

watch(
  () => quantity,
  () => {
    if (props.data.open) {
      if (quantity.value <= 0) {
        quantity.value = 1;
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
      await fetchProduct();
    }
  },
);
</script>

<template>
  <q-dialog v-model="open">
    <q-card style="width: 900px; max-width: 98vw" class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Formulário de devolução" icon="assignment_return" />
      </q-card-section>
      <q-card-section>
        <div class="q-gutter-y-lg">
          <q-input
            v-model="quantity"
            label="Quantidade de itens que foram devolvidos"
            type="number"
            outlined
            dense
            bg-color="white"
            input-class="text-black no-spinners"
          />

          <div class="q-mb-lg" v-for="(item, index) in returnData" :key="index">
            <div class="q-gutter-y-sm">
              <TableSaleProducts
                :rows="localProducts"
                :loading="loadingListSaleProducts"
                @add-to-return="(product) => addToReturnTable(product, index)"
              />
              <TableReturnProducts
                v-model="item.products"
                :rows="item.products"
                @remove-from-return="(id) => removeFromReturnTable(id, index)"
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
            <TableListProducts
              class="q-mt-md"
              :hidden-ids="cartIds"
              @add-to-cart="addToShiftTable"
            />
            <TableShiftItems
              class="q-mt-md"
              :rows="shiftLocalProducts"
              @remove-from-shift="removeFromShiftTable"
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
          <q-btn color="red" label="Fechar" size="md" @click="close" unelevated no-caps flat />
          <q-btn
            @click="console.log(returnData)"
            color="primary"
            label="Salvar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
