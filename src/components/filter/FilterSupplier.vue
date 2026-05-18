<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { useSupplierStore } from 'src/stores/supplier-store';
import { useCategorySupplierStore } from 'src/stores/category-supplier-store';

defineOptions({
  name: 'FilterSupplier',
});

const props = defineProps<{
  open: boolean;
  filters: IFilterSupplier;
}>();
const emit = defineEmits<{
  'update:open': ['close' | IFilterSupplier];
}>();

const { loadingSupplier } = storeToRefs(useSupplierStore());
const { loadingCategorySupplier, listCategorySupplier } = storeToRefs(useCategorySupplierStore());

const loading = ref<boolean>(false);
const dataSupplier = reactive({
  name: '' as string,
  email: '' as string,
  cpf: '' as string,
  cnpj: '' as string,
  country: '' as string,
  state: '' as string,
  city: '' as string,
});
const selectedCategory = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const selectedStatus = ref<IQuasarSelect<number | null>>({
  label: 'Todos',
  value: null,
});
const selectedIdentifier = ref<string>('CNPJ');
const optionsIdentifier = reactive<string[]>(['CNPJ', 'CPF']);

const open = computed({
  get: () => props.open,
  set: (state: IFilterSupplier | 'close') => emit('update:open', state),
});

const clear = (): void => {
  Object.assign(dataSupplier, {
    name: '',
    email: '',
    cpf: '',
    cnpj: '',
    country: '',
    state: '',
    city: '',
  });

  selectedCategory.value = {
    label: 'Todos',
    value: null,
  };
  selectedStatus.value = {
    label: 'Todos',
    value: null,
  };
};
const fetchCategories = async () => {
  await useCategorySupplierStore().getCategoriesSupplier();
};
const changeLoading = (): void => {
  loading.value = !loading.value;
};
const mountFilter = () => {
  Object.assign(dataSupplier, {
    name: props.filters.name,
    email: props.filters.email,
    cpf: props.filters.cpf,
    cnpj: props.filters.cnpj,
    country: props.filters.country,
    state: props.filters.state,
    city: props.filters.city,
  });

  const selectedCategoryItem = listCategorySupplier.value.find(
    (item) => item.id === props.filters.category,
  );
  selectedCategory.value = selectedCategoryItem
    ? { label: selectedCategoryItem?.name, value: selectedCategoryItem?.id }
    : { label: 'Todos', value: null };
};
const search = () => {
  const data = {
    name: dataSupplier.name,
    email: dataSupplier.email,
    cpf: dataSupplier.cpf,
    cnpj: dataSupplier.cnpj,
    country: dataSupplier.country,
    state: dataSupplier.state,
    city: dataSupplier.city,
    active: selectedStatus.value.value,
    category: selectedCategory.value.value,
  };

  emit('update:open', data);
};

const optionsCategories = computed(() => {
  return [
    {
      label: 'Todos',
      value: null,
    },
    ...listCategorySupplier.value.map((item) => ({
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
const isLoading = computed((): boolean => {
  return loading.value || loadingCategorySupplier.value || loadingSupplier.value;
});

watch(
  () => dataSupplier.country,
  (country: string) => {
    if (country.trim().length > 0) {
      dataSupplier.country = dataSupplier.country.replace(/\d+/g, '');
    }
  },
);
watch([() => dataSupplier.cpf, () => dataSupplier.cnpj], ([cpf, cnpj]) => {
  dataSupplier.cpf = cpf.replace(/\D/g, '');
  dataSupplier.cnpj = cnpj.replace(/\D/g, '');
});
watch(
  selectedIdentifier,
  (identifier: string) => {
    if (identifier === 'CPF') {
      dataSupplier.cnpj = '';
    } else {
      dataSupplier.cpf = '';
    }
  },
  { immediate: true },
);
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
        <TitlePage title="Filtro de fornecedores" icon="person" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading :show="isLoading" />
        <q-form v-show="!isLoading" class="q-gutter-y-sm">
          <q-input
            v-model="dataSupplier.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre por nome"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSupplier.email"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre por e-mail"
            dense
            input-class="text-black"
            autocomplete="new-email"
          >
            <template v-slot:prepend>
              <q-icon name="mail" color="black" size="20px" />
            </template>
          </q-input>
          <div class="row justify-between">
            <q-select
              v-model="selectedIdentifier"
              :options="optionsIdentifier"
              label="Selecione o documento"
              outlined
              dense
              options-dense
              bg-color="white"
              label-color="black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="info" color="black" size="20px" />
              </template>
            </q-select>
            <q-input
              v-if="selectedIdentifier === 'CNPJ'"
              v-model="dataSupplier.cnpj"
              bg-color="white"
              label-color="black"
              outlined
              label="Filtre por CNPJ"
              dense
              input-class="text-black"
              class="input-divider"
              maxlength="14"
            >
              <template v-slot:prepend>
                <q-icon name="badge" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-else
              v-model="dataSupplier.cpf"
              bg-color="white"
              label-color="black"
              outlined
              label="Filtre por CPF"
              dense
              input-class="text-black"
              class="input-divider"
              maxlength="11"
            >
              <template v-slot:prepend>
                <q-icon name="badge" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="dataSupplier.country"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre por país"
            dense
            input-class="text-black"
            autocomplete="new-email"
          >
            <template v-slot:prepend>
              <q-icon name="south_america" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSupplier.state"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre por estado"
            dense
            input-class="text-black"
            autocomplete="new-email"
          >
            <template v-slot:prepend>
              <q-icon name="map" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSupplier.city"
            bg-color="white"
            label-color="black"
            outlined
            label="Filtre por cidade"
            dense
            input-class="text-black"
            autocomplete="new-email"
          >
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
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
