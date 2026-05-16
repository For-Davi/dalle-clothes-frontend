<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useEmployeeStore } from 'src/stores/employee-store';
import { useCategoryProductStore } from 'src/stores/category-product-store';
import { useProductStore } from 'src/stores/product-store';
import { useTypesReceiptStore } from 'src/stores/types-receipt-store';
import Loading from '../shared/Loading.vue';
import type { PaymentType } from 'src/enums/payment-enum';
import { PaymentTypeLabels } from 'src/enums/payment-enum';

defineOptions({
  name: 'FilterDashboard',
});

const props = defineProps<{
  open: boolean;
  filters: IFilterDashboard;
}>();
const emit = defineEmits<{
  'update:open': ['close' | IFilterDashboard];
}>();

const { listEmployee, loadingEmployee } = storeToRefs(useEmployeeStore());
const { listCategoryProduct, loadingCategoryProduct } = storeToRefs(useCategoryProductStore());
const { listProduct, loadingProduct } = storeToRefs(useProductStore());
const { listTypesReceipt, loadingTypesReceipt } = storeToRefs(useTypesReceiptStore());

const dataDashboard = reactive({
  startDate: '' as string,
  endDate: '' as string,
});
const selectedSeller = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const selectedCategory = ref<IQuasarSelect<number | null>>({
  label: 'Todas',
  value: null,
});
const selectedProduct = ref<IQuasarSelect<string | null>>({
  label: 'Todos',
  value: null,
});
const selectedTypeReceipt = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const loading = ref<boolean>(false);

const mountFilter = () => {
  Object.assign(dataDashboard, {
    startDate: props.filters.startDate,
    endDate: props.filters.endDate,
  });

  const selectedSellerItem = listEmployee.value.find((item) => item.id === props.filters.seller);
  const selectedProductCategoryItem = listCategoryProduct.value.find(
    (item) => item.id === props.filters.category,
  );
  const selectedProductItem = listProduct.value.find((item) => item.name === props.filters.product);
  const selectedTypeReceiptItem = listTypesReceipt.value.find(
    (item) => item.id === props.filters.typeReceipt,
  );

  selectedSeller.value = selectedSellerItem
    ? { label: selectedSellerItem?.name, value: selectedSellerItem?.id }
    : { label: 'Todos', value: null };
  selectedCategory.value = selectedProductCategoryItem
    ? { label: selectedProductCategoryItem?.name, value: selectedProductCategoryItem?.id }
    : { label: 'Todas', value: null };
  selectedProduct.value = selectedProductItem
    ? { label: selectedProductItem?.name, value: selectedProductItem?.name }
    : { label: 'Todos', value: null };
  selectedTypeReceipt.value = selectedTypeReceiptItem
    ? {
        label:
          PaymentTypeLabels[selectedTypeReceiptItem.name as PaymentType] ??
          selectedTypeReceiptItem.name,
        value: selectedTypeReceiptItem.id,
      }
    : { label: 'Todos', value: null };
};
const fetchSellers = async () => {
  await useEmployeeStore().getEmployees();
};
const fetchCategory = async () => {
  await useCategoryProductStore().getCategoriesProduct();
};
const fetchProduct = async () => {
  await useProductStore().getProducts();
};
const fetchTypeReceipt = async () => {
  await useTypesReceiptStore().getTypesReceipt({ active: 1 });
};
const clear = (): void => {
  Object.assign(dataDashboard, {
    startDate: '',
    endDate: '',
  });
  selectedSeller.value = {
    label: 'Todos',
    value: null,
  };
  selectedCategory.value = {
    label: 'Todas',
    value: null,
  };
  selectedProduct.value = {
    label: 'Todos',
    value: null,
  };
  selectedTypeReceipt.value = {
    label: 'Todos',
    value: null,
  };
};
const search = () => {
  const data = {
    startDate: dataDashboard.startDate,
    endDate: dataDashboard.endDate,
    seller: selectedSeller.value.value,
    category: selectedCategory.value.value,
    product: selectedProduct.value.value,
    typeReceipt: selectedTypeReceipt.value.value,
  };

  emit('update:open', data);
};

const isLoading = computed((): boolean => {
  return (
    loading.value ||
    loadingEmployee.value ||
    loadingCategoryProduct.value ||
    loadingProduct.value ||
    loadingTypesReceipt.value
  );
});
const open = computed({
  get: () => props.open,
  set: (state: IFilterDashboard | 'close') => emit('update:open', state),
});
const optionsSellers = computed(() => {
  return [
    {
      label: 'Todos',
      value: null,
    },
    ...listEmployee.value.map((item) => ({
      label: item.name,
      value: item.id,
    })),
  ];
});
const optionsCategories = computed(() => {
  return [
    {
      label: 'Todas',
      value: null,
    },
    ...listCategoryProduct.value.map((item) => ({
      label: item.name,
      value: item.id,
    })),
  ];
});
const optionsProducts = computed(() => {
  return [
    {
      label: 'Todos',
      value: null,
    },
    ...listProduct.value
      .filter((item, index, array) => index === array.findIndex((p) => p.name === item.name))
      .map((item) => ({
        label: item.name,
        value: item.name,
      })),
  ];
});
const optionsTypesReceipts = computed(() => {
  return [
    {
      label: 'Todos',
      value: null,
    },
    ...listTypesReceipt.value.map((item) => ({
      label: PaymentTypeLabels[item.name as PaymentType],
      value: item.id,
    })),
  ];
});

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchSellers();
    await fetchCategory();
    await fetchProduct();
    await fetchTypeReceipt();
    mountFilter();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent :maximized="$q.screen.lt.sm">
    <q-card class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Filtro do dashboard" icon="bar_chart" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading :show="isLoading" />
        <q-form v-show="!isLoading" class="q-gutter-y-sm">
          <q-input
            v-model="dataDashboard.startDate"
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
            v-model="dataDashboard.endDate"
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
          <q-select
            outlined
            v-model="selectedSeller"
            label="Filtre por vendedor"
            :options="optionsSellers"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            outlined
            v-model="selectedCategory"
            label="Filtre por categoria"
            :options="optionsCategories"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="category" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            outlined
            v-model="selectedProduct"
            label="Filtre por produto"
            :options="optionsProducts"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="shopping_cart" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            outlined
            v-model="selectedTypeReceipt"
            label="Filtre por tipo de recebimento"
            :options="optionsTypesReceipts"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="account_balance" color="black" size="20px" />
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
          <q-btn @click="clear" color="secondary" label="Limpar" size="md" unelevated no-caps />
          <q-btn @click="search" color="primary" label="Filtrar" size="md" unelevated no-caps />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
