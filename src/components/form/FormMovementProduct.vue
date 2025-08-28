<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductStore } from 'src/stores/product-store';
import TableSearchProductVariant from '../table/TableSearchProductVariant.vue';
import Empty from '../info/Empty.vue';
import FormMovementProductRegister from './FormMovementProductRegister.vue';

defineOptions({
  name: 'FormMovementProduct',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
  newRequest: [void];
}>();

const { loadingProduct } = storeToRefs(useProductStore());

const listProductSearch = ref<ISearchProductVariant[]>([]);
const showFormNewMovementProduct = reactive<{
  open: boolean;
  variantID: number | null;
  type: 'in' | 'out';
}>({
  open: false,
  variantID: null,
  type: 'in',
});
const search = ref<string>('');
const dataMovement = reactive({
  value: '' as string,
  date: '' as string,
  description: '' as string,
});
const selectedType = ref<IQuasarSelect<'in' | 'out'>>({
  label: 'Entrada 🟩',
  value: 'in',
});

const clear = (): void => {
  Object.assign(dataMovement, {
    value: '',
    date: '',
    description: '',
  });

  selectedType.value = {
    label: 'Entrada 🟩',
    value: 'in',
  };

  search.value = '';
  listProductSearch.value = [];
};
const searchProduct = async () => {
  const response = await useProductStore().searchProduct(search.value);
  if (response?.status === 200) {
    listProductSearch.value = response.data.products;
  }
};
const newRequest = async (): Promise<void> => {
  const response = await useProductStore().searchProduct(search.value);
  if (response?.status === 200) {
    listProductSearch.value = response.data.products;
  }
};
const changeShowFormNewMovementProduct = (
  show: boolean,
  type: 'in' | 'out' = 'in',
  variantID: number | null = null,
): void => {
  showFormNewMovementProduct.variantID = variantID;
  showFormNewMovementProduct.type = type;
  showFormNewMovementProduct.open = show;
};
const makeProductVariant = (productVariantID: number, type: 'in' | 'out') => {
  changeShowFormNewMovementProduct(true, type, productVariantID);
};

const getLabelSearch = computed((): string => {
  return 'Buscar por produto, SKU ou código';
});
const open = computed({
  get: () => props.open,
  set: () => {
    emit('update:open');
    emit('newRequest');
  },
});

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-2" style="width: 900px; max-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Atualização de estoque" icon="sync_alt" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm column full-width">
          <div>
            <q-input
              v-model="search"
              bg-color="white"
              label-color="black"
              outlined
              :label="getLabelSearch"
              dense
              input-class="text-black no-spinners"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="black" size="20px" />
              </template>
            </q-input>
            <q-btn
              @click="searchProduct"
              :disable="search.trim().length === 0"
              color="green-9"
              label="Buscar"
              class="full-width q-mt-sm"
              size="md"
              unelevated
              no-caps
              :loading="loadingProduct"
            />
          </div>
          <div>
            <TableSearchProductVariant
              v-if="listProductSearch.length > 0"
              :list="listProductSearch"
              @choose-product-variant="makeProductVariant"
            />
            <Empty v-else message="Sem resultado" color="bg-red-3" />
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center full-width">
          <q-btn
            @click="open = false"
            color="red"
            label="Fechar"
            size="md"
            unelevated
            no-caps
            class="q-mr-sm"
          />
        </div>
      </q-card-actions>
    </q-card>

    <!-- Modals -->
    <FormMovementProductRegister
      :data="showFormNewMovementProduct"
      @update:open="changeShowFormNewMovementProduct(false)"
      @new-request="newRequest"
    />
  </q-dialog>
</template>
