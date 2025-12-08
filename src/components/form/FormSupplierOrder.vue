<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { useSupplierStore } from 'src/stores/supplier-store';
import { useProductStore } from 'src/stores/product-store';
import TableSelectProductVariant from '../fragments/supplier/TableSelectProductVariant.vue';
import { checkDataSupplierOrder } from 'src/composables/CheckData';
import { useSupplierOrderStore } from 'src/stores/supplier-order-store';
import { createErrorData } from 'src/composables/CreateNotify';

defineOptions({
  name: 'FormSupplierOrder',
});

const props = defineProps<{
  data: {
    open: boolean;
    orderID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingSupplier, listSupplierSelect } = storeToRefs(useSupplierStore());
const { loadingSupplierOrder } = storeToRefs(useSupplierOrderStore());
const { loadingProduct, listProduct } = storeToRefs(useProductStore());

const textAny = ref<string>('');
const showTableSelectProductVariant = ref<boolean>(false);
const dataSupplierOrder = reactive({
  orderNumber: '' as string,
  dateIssue: '' as string,
  dateDeliveryExpected: '' as string,
  description: '' as string,
  items: [] as ISupplierCartProduct[],
  itemsToDelete: [] as string[],
});
const selectedSupplier = ref<IQuasarSelect<number | null>>({
  label: 'Não informado',
  value: null,
});

const clear = (): void => {
  Object.assign(dataSupplierOrder, {
    orderNumber: '',
    dateIssue: '',
    dateDeliveryExpected: '',
    description: '',
    items: [],
    itemsToDelete: [],
  });

  selectedSupplier.value = {
    label: 'Não informado',
    value: null,
  };
};
const changeShowTableSelectProductVariant = () => {
  showTableSelectProductVariant.value = !showTableSelectProductVariant.value;
};
const getItems = (items: ISupplierCartProduct[]): IProductSupplierOrder[] => {
  return items.map((item) => {
    return {
      productVariantID: item.product_variant_id,
      unitCost: item.newPrice,
      quantityRequested: item.newQuantity,
    };
  });
};
const verifyString = (value: string): string | null => {
  return value.trim() !== '' ? value : null;
};
const save = async () => {
  const check = checkDataSupplierOrder(dataSupplierOrder, selectedSupplier.value.value);
  if (check.status) {
    const response = await useSupplierOrderStore().createSupplierOrder({
      orderNumber: dataSupplierOrder.orderNumber,
      dateIssue: dataSupplierOrder.dateIssue,
      dateDeliveryExpected: dataSupplierOrder.dateDeliveryExpected,
      items: getItems(dataSupplierOrder.items),
      supplierID: selectedSupplier.value.value,
    });
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados do pedido');
  }
};
const update = async () => {
  const check = checkDataSupplierOrder(dataSupplierOrder, selectedSupplier.value.value);
  if (check.status) {
    const response = await useSupplierOrderStore().updateSupplierOrder({
      id: props.data.orderID!,
      supplierID: selectedSupplier.value.value,
      dateIssue: dataSupplierOrder.dateIssue,
      dateDeliveryExpected: dataSupplierOrder.dateDeliveryExpected,
      orderNumber: verifyString(dataSupplierOrder.orderNumber),
      items: getItems(dataSupplierOrder.items),
      itemsToDelete: dataSupplierOrder.itemsToDelete,
    });
    if (response?.status === 200) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados do pedido');
  }
};
const checkDataEdit = async () => {
  if (!orderID.value) return;

  const response = await useSupplierOrderStore().showOrderSupplier(orderID.value);

  if (response?.status === 200) {
    const order = response.data.order as IShowOrder;

    const mappedItems: ISupplierCartProduct[] = order.items.map((item: ISupplierOrderItem) => {
      const variant = item.product_variant;

      return {
        product_variant_id: item.product_variant_id,
        price: item.unit_cost,
        newPrice: item.unit_cost,
        quantity: item.quantity_requested,
        newQuantity: item.quantity_requested,
        stock_quantity: variant.stock_quantity,
        sku: variant.sku,
        code: variant.code,
        variant_active: variant.active ? 1 : 0,
        color: variant.color
          ? {
              name: variant.color.name,
              hex_color_code: variant.color.hex_color_code,
            }
          : null,
      };
    });

    Object.assign(dataSupplierOrder, {
      orderNumber: order.order_number,
      dateIssue: order.date_issue ?? '',
      dateDeliveryExpected: order.date_delivery_expected ?? '',
      description: order.observation ?? '',
      items: mappedItems,
      itemsToDelete: [],
    });
  }
};

const fetchSuppliers = async (): Promise<void> => {
  await useSupplierStore().getSuppliersSelect();
};
const fetchProductVariants = async (): Promise<void> => {
  await useProductStore().getProducts();
};
const submit = async () => {
  if (props.data.orderID) {
    await update();
  } else {
    await save();
  }
};

const getListSupplierSelect = computed((): IQuasarSelect<number | null>[] => {
  const mappedSuppliers = listSupplierSelect.value.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return [...mappedSuppliers, { label: 'Não informado', value: null }];
});
const isLoading = computed((): boolean => {
  return loadingSupplier.value || loadingSupplierOrder.value || loadingProduct.value;
});
const orderID = computed(() => props.data.orderID);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
const getLabelItems = computed((): string => {
  return `Total de itens: ${dataSupplierOrder.items.length}`;
});

watch(open, async () => {
  clear();
  if (open.value) {
    await fetchSuppliers();
    await fetchProductVariants();
    await checkDataEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="orderID ? 'Atualização de pedido' : 'Cadastro de pedido'"
          icon="list_alt"
        />
      </q-card-section>
      <Loading :show="isLoading" />
      <q-card-section class="q-pa-sm" v-show="!isLoading">
        <q-form class="q-gutter-y-sm">
          <q-select
            outlined
            v-model="selectedSupplier"
            label="Selecione o fornecedor"
            :options="getListSupplierSelect"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="local_shipping" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataSupplierOrder.dateIssue"
            bg-color="white"
            label-color="black"
            outlined
            label="Data de emissão"
            dense
            input-class="text-black"
            mask="##/##/####"
          >
            <template v-slot:prepend>
              <q-icon name="today" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSupplierOrder.dateDeliveryExpected"
            bg-color="white"
            label-color="black"
            outlined
            label="Previsão de entrega"
            dense
            input-class="text-black"
            mask="##/##/####"
          >
            <template v-slot:prepend>
              <q-icon name="today" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSupplierOrder.orderNumber"
            bg-color="white"
            label-color="black"
            outlined
            label="Número de pedido"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="info" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="textAny"
            bg-color="white"
            label-color="black"
            outlined
            :label="getLabelItems"
            dense
            input-class="text-black"
            class="full-width"
            color="orange"
            readonly
            :disable="isLoading"
          >
            <template v-slot:append>
              <q-btn
                size="sm"
                @click="changeShowTableSelectProductVariant"
                unelevated
                no-caps
                round
              >
                <q-icon name="add_circle" color="black" size="20px">
                  <q-tooltip> Gerenciar itens </q-tooltip>
                </q-icon>
              </q-btn>
            </template>
          </q-input>
          <q-input
            v-model="dataSupplierOrder.description"
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
        </q-form>
      </q-card-section>
      <q-card-actions align="right" v-show="!isLoading">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            unelevated
            no-caps
          />
          <q-btn
            @click="submit"
            color="primary"
            :label="orderID ? 'Atualizar' : 'Salvar'"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
      dataSupplierOrder {{ dataSupplierOrder.itens }}
    </q-card>

    <!-- Modals -->
    <TableSelectProductVariant
      v-model:selected="dataSupplierOrder.items"
      :list="listProduct"
      :loading="isLoading"
      :open="showTableSelectProductVariant"
      @update:open="changeShowTableSelectProductVariant"
    />
  </q-dialog>
</template>
