<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import Loading from '../shared/Loading.vue';
import { storeToRefs } from 'pinia';
import { useClientStore } from 'src/stores/client-store';
import { useProductStore } from 'src/stores/product-store';
import { useEmployeeStore } from 'src/stores/employee-store';
import { useTypesReceiptStore } from 'src/stores/types-receipt-store';
import { useReceiptstore } from 'src/stores/receipt-store';
import { PaymentTypeLabels } from 'src/enums/payment-enum';

defineOptions({
  name: 'FilterSale',
});

const props = defineProps<{
  open: boolean;
  filters: IFilterSale;
}>();
const emit = defineEmits<{
  'update:open': ['close' | IFilterSale];
}>();

const { listClient, loadingClient } = storeToRefs(useClientStore());
const { listProduct, loadingProduct } = storeToRefs(useProductStore());
const { listEmployee, loadingEmployee } = storeToRefs(useEmployeeStore());
const { listTypesReceipt, loadingTypesReceipt } = storeToRefs(useTypesReceiptStore());
const { listReceipt, loadingReceipt } = storeToRefs(useReceiptstore());

const dataSale = reactive({
  startDate: '' as string,
  endDate: '' as string,
  minTotal: '' as string,
  maxTotal: '' as string,
});
const searchClient = ref<string>('');
const searchSeller = ref<string>('');
const searchProduct = ref<string>('');
const searchReceipt = ref<string>('');

const selectedStatus = ref<IQuasarSelect<null | 'active' | 'canceled'>>({
  label: 'Todos',
  value: null,
});
const selectedClient = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const selectedSeller = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const selectedProduct = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const selectedPaymentType = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const selectedReceipt = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});

const fetchClients = async () => {
  await useClientStore().getClients();
};
const fetchSellers = async () => {
  await useEmployeeStore().getEmployees();
};
const fetchProducts = async () => {
  await useProductStore().getProducts();
};
const fetchPaymentTypes = async () => {
  await useTypesReceiptStore().getTypesReceipt();
};
const fetchReceipts = async () => {
  await useReceiptstore().getReceipt();
};
const clear = () => {
  Object.assign(dataSale, {
    startDate: null,
    endDate: null,
    minTotal: null,
    maxTotal: null,
  });

  selectedStatus.value = {
    label: 'Todos',
    value: null,
  };

  selectedClient.value = {
    label: 'Todos',
    value: null,
  };

  selectedSeller.value = {
    label: 'Todos',
    value: null,
  };

  selectedProduct.value = {
    label: 'Todos',
    value: null,
  };

  selectedPaymentType.value = {
    label: 'Todos',
    value: null,
  };

  selectedReceipt.value = {
    label: 'Todos',
    value: null,
  };
};
const mountFilter = () => {
  Object.assign(dataSale, {
    startDate: props.filters.startDate,
    endDate: props.filters.endDate,
    minTotal: props.filters.minTotal,
    maxTotal: props.filters.maxTotal,
  });

  const clientItem = listClient.value.find((item) => item.id === props.filters.client);

  const sellerItem = listEmployee.value.find((item) => item.id === props.filters.seller);

  const productItem = listProduct.value.find(
    (item) => item.product_variant_id === props.filters.product,
  );

  const paymentTypeItem = listTypesReceipt.value.find(
    (item) => item.id === props.filters.paymentType,
  );

  const receiptItem = listReceipt.value.find((item) => item.id === props.filters.receipt);

  selectedStatus.value = props.filters.status
    ? {
        label:
          props.filters.status === 'active'
            ? 'Ativa'
            : props.filters.status === 'canceled'
              ? 'Cancelada'
              : 'Todos',
        value: props.filters.status,
      }
    : { label: 'Todos', value: null };

  selectedClient.value = clientItem
    ? { label: clientItem.name, value: clientItem.id }
    : { label: 'Todos', value: null };

  selectedSeller.value = sellerItem
    ? { label: sellerItem.name, value: sellerItem.id }
    : { label: 'Todos', value: null };

  selectedProduct.value = productItem
    ? {
        label: `${productItem.name} - ${productItem.grid_item?.size ?? 'Sem tamanho'} - ${productItem.color?.name}`,
        value: productItem.product_variant_id,
      }
    : { label: 'Todos', value: null };

  selectedPaymentType.value = paymentTypeItem
    ? {
        label: PaymentTypeLabels[paymentTypeItem.name as keyof typeof PaymentTypeLabels],
        value: paymentTypeItem.id,
      }
    : { label: 'Todos', value: null };

  selectedReceipt.value = receiptItem
    ? { label: receiptItem.identifier, value: receiptItem.id }
    : { label: 'Todos', value: null };
};
const search = () => {
  const data = {
    startDate: dataSale.startDate,
    endDate: dataSale.endDate,
    status: selectedStatus.value.value,
    client: selectedClient.value.value,
    seller: selectedSeller.value.value,
    product: selectedProduct.value.value,
    paymentType: selectedPaymentType.value.value,
    receipt: selectedReceipt.value.value,
    minTotal: normalizeMoney(dataSale.minTotal),
    maxTotal: normalizeMoney(dataSale.maxTotal),
  };

  emit('update:open', data);
};
const normalizeMoney = (value: string | null) => {
  if (!value) return null;
  const number = parseFloat(value);
  return number > 0 ? number.toFixed(2) : null;
};

const open = computed({
  get: () => props.open,
  set: (state: IFilterSale | 'close') => emit('update:open', state),
});
const isLoading = computed(() => {
  return (
    loadingClient.value ||
    loadingEmployee.value ||
    loadingProduct.value ||
    loadingReceipt.value ||
    loadingTypesReceipt.value
  );
});
const optionsStatus = computed(() => {
  return [
    {
      label: 'Todos',
      value: null,
    },
    {
      label: 'Ativa',
      value: 'active',
    },
    {
      label: 'Cancelada',
      value: 'canceled',
    },
  ];
});
const optionsClient = computed(() => {
  const options = [
    {
      label: 'Todos',
      value: null,
    },
    ...listClient.value.map((item) => ({
      label: item.name,
      value: item.id,
    })),
  ];

  if (!searchClient.value || searchClient.value.toLowerCase() === 'todos') {
    return options;
  }

  const needle = searchClient.value.toLowerCase();
  return options.filter((option) => option.label.toLowerCase().includes(needle));
});
const optionsSeller = computed(() => {
  const options = [
    {
      label: 'Todos',
      value: null,
    },
    ...listEmployee.value.map((item) => ({
      label: item.name,
      value: item.id,
    })),
  ];

  if (!searchSeller.value || searchSeller.value.toLowerCase() === 'todos') {
    return options;
  }

  const needle = searchSeller.value.toLowerCase();
  return options.filter((option) => option.label.toLowerCase().includes(needle));
});
const optionsProduct = computed(() => {
  const options = [
    {
      label: 'Todos',
      value: null,
    },
    ...listProduct.value.map((item) => ({
      label: `${item.name} - ${item.grid_item?.size ?? 'Sem tamanho'} - ${item.color?.name ?? 'Sem cor'}`,
      value: item.name,
    })),
  ];

  if (!searchProduct.value || searchProduct.value.toLowerCase() === 'todos') {
    return options;
  }

  const needle = searchProduct.value.toLowerCase();
  return options.filter((option) => option.label.toLowerCase().includes(needle));
});
const optionsPaymentType = computed(() => {
  return [
    {
      label: 'Todos',
      value: null,
    },
    ...listTypesReceipt.value.map((item) => ({
      label: PaymentTypeLabels[item.name as keyof typeof PaymentTypeLabels],
      value: item.id,
    })),
  ];
});
const optionsReceipt = computed(() => {
  const options = [
    {
      label: 'Todos',
      value: null,
    },
    ...listReceipt.value.map((item) => ({
      label: item.identifier,
      value: item.id,
    })),
  ];

  if (!searchReceipt.value || searchReceipt.value.toLowerCase() === 'todos') {
    return options;
  }

  const needle = searchReceipt.value.toLowerCase();
  return options.filter((option) => option.label.toLowerCase().includes(needle));
});

watch(
  () => props.open,
  async () => {
    if (props.open) {
      clear();
      await fetchClients();
      await fetchSellers();
      await fetchProducts();
      await fetchPaymentTypes();
      await fetchReceipts();
      mountFilter();
    }
  },
);
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Filtro de vendas" icon="attach_money" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading :show="isLoading" />
        <q-form v-show="!isLoading" class="q-gutter-y-sm">
          <q-input
            v-model="dataSale.startDate"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre pela data inicial"
            mask="##/##/####"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="date_range" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSale.endDate"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre pela data final"
            mask="##/##/####"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="date_range" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSale.minTotal"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre pelo total mínimo da venda"
            dense
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSale.maxTotal"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre pelo total máximo da venda"
            dense
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="selectedStatus"
            :options="optionsStatus"
            label="Selecione o status"
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="info" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-model="selectedClient"
            :options="optionsClient"
            label="Selecione o cliente"
            outlined
            dense
            options-dense
            use-input
            hide-selected
            fill-input
            input-debounce="1"
            @input-value="(val: string) => (searchClient = val)"
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-model="selectedSeller"
            :options="optionsSeller"
            label="Selecione o vendedor"
            outlined
            dense
            options-dense
            hide-selected
            fill-input
            use-input
            input-debounce="1"
            @input-value="(val: string) => (searchSeller = val)"
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="badge" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-model="selectedProduct"
            :options="optionsProduct"
            label="Selecione o produto"
            outlined
            dense
            options-dense
            hide-selected
            fill-input
            use-input
            input-debounce="1"
            @input-value="(val: string) => (searchProduct = val)"
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="inventory_2" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-model="selectedReceipt"
            :options="optionsReceipt"
            label="Selecione o recebimento"
            outlined
            dense
            options-dense
            hide-selected
            fill-input
            use-input
            input-debounce="1"
            @input-value="(val: string) => (searchReceipt = val)"
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="account_balance" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-model="selectedPaymentType"
            :options="optionsPaymentType"
            label="Selecione o tipo de pagamento"
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="credit_card" color="black" size="20px" />
            </template>
          </q-select>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="emit('update:open', 'close')"
            unelevated
            no-caps
          />
          <q-btn
            v-show="!isLoading"
            @click="clear"
            color="secondary"
            label="Limpar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-show="!isLoading"
            color="primary"
            label="Filtrar"
            @click="search"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
