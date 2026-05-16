<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { useCategoryProductStore } from 'src/stores/category-product-store';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';

defineOptions({
  name: 'FilterProduct',
});

const props = defineProps<{
  open: boolean;
  filters: IFilterProduct;
}>();
const emit = defineEmits<{
  'update:open': ['close' | IFilterProduct];
}>();

const { listCategoryProduct, loadingCategoryProduct } = storeToRefs(useCategoryProductStore());

const loading = ref<boolean>(false);
const dataProduct = reactive({
  name: '' as string,
  sku: '' as string,
});
const selectedStockCritical = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const selectedStatus = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const selectedCategory = ref<IQuasarSelect<number | null>>({
  label: 'Todas',
  value: null,
});

const fetchCategories = async () => {
  await useCategoryProductStore().getCategoriesProduct();
};
const changeLoading = (): void => {
  loading.value = !loading.value;
};
const clear = (): void => {
  Object.assign(dataProduct, {
    name: '',
    sku: '',
    cpf: '',
    cnpj: '',
  });
  selectedStatus.value = {
    label: 'Todos',
    value: null,
  };
  selectedCategory.value = {
    label: 'Todos',
    value: null,
  };
  selectedStockCritical.value = {
    label: 'Todas',
    value: null,
  };
};
const mountFilter = () => {
  Object.assign(dataProduct, {
    name: props.filters.name ?? '',
    sku: props.filters.sku ?? '',
  });

  const selectedCategoryItem = listCategoryProduct.value.find(
    (item) => item.id === props.filters.category,
  );
  selectedCategory.value = selectedCategoryItem
    ? { label: selectedCategoryItem?.name, value: selectedCategoryItem?.id }
    : { label: 'Todos', value: null };

  selectedStockCritical.value =
    props.filters.stockCritical === 1
      ? { label: 'Apenas com estoque critíco', value: 1 }
      : props.filters.stockCritical === 0
        ? { label: 'Apenas com estoque não critíco', value: 0 }
        : { label: 'Todos', value: null };

  selectedStockCritical.value =
    props.filters.stockCritical === 1
      ? { label: 'Apenas com estoque critíco', value: 1 }
      : props.filters.stockCritical === 0
        ? { label: 'Apenas com estoque não critíco', value: 0 }
        : { label: 'Todos', value: null };

  selectedStatus.value =
    props.filters.active === 1
      ? { label: 'Apenas ativos', value: 1 }
      : props.filters.active === 0
        ? { label: 'Apenas inativos', value: 0 }
        : { label: 'Todos', value: null };
};
const search = () => {
  const data = {
    name: dataProduct.name.trim() !== '' ? dataProduct.name : null,
    sku: dataProduct.sku.trim() !== '' ? dataProduct.sku : null,
    stockCritical: selectedStockCritical.value.value,
    active: selectedStatus.value.value,
    category: selectedCategory.value.value,
  };

  emit('update:open', data);
};

const open = computed({
  get: () => props.open,
  set: (state: IFilterProduct | 'close') => emit('update:open', state),
});
const optionsCategories = computed(() => {
  return [
    {
      label: 'Todos',
      value: null,
    },
    ...listCategoryProduct.value.map((item) => ({
      label: item.name,
      value: item.id,
    })),
  ];
});
const optionsStatus = computed(() => {
  return [
    {
      label: 'Todos',
      value: null,
    },
    {
      label: 'Ativo',
      value: 1,
    },
    {
      label: 'Inativo',
      value: 0,
    },
  ];
});
const optionsStockCritical = computed(() => {
  return [
    {
      label: 'Todos',
      value: null,
    },
    {
      label: 'Apenas com estoque crítico',
      value: 1,
    },
    {
      label: 'Apenas com estoque regular',
      value: 0,
    },
  ];
});
const isLoading = computed((): boolean => {
  return loadingCategoryProduct.value || loading.value;
});

watch(open, async () => {
  if (open.value) {
    clear();
    changeLoading();
    await fetchCategories();
    mountFilter();
    changeLoading();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent :maximized="$q.screen.lt.sm">
    <q-card class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Filtro de produtos" icon="inventory" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading :show="isLoading" />
        <q-form v-show="!isLoading" class="q-gutter-y-sm">
          <q-input
            v-model="dataProduct.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre por nome"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-box" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataProduct.sku"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre por SKU"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="dialpad" color="black" size="20px" />
            </template>
          </q-input>
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
            v-model="selectedStatus"
            label="Filtre por status"
            :options="optionsStatus"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="check" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            outlined
            v-model="selectedStockCritical"
            label="Filtre por estoque"
            :options="optionsStockCritical"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="check" color="black" size="20px" />
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
            @click="search"
            color="primary"
            label="Filtrar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
