<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductStore } from 'src/stores/product-store';
import TableSearchProductVariant from '../table/TableSearchProductVariant.vue';
import Empty from '../info/Empty.vue';
import FormMovementProductRegister from './FormMovementProductRegister.vue';
import TableSearchReturnItem from '../table/TableSearchReturnItem.vue';
import { useReturnStore } from 'src/stores/return-store';

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
const listReturnItemSearch = ref<IStockReentryReturnItem[]>([]);
const showFormNewMovementProduct = reactive<{
  open: boolean;
  variantID: number | null;
  type: 'in' | 'out';
  productType: 'stock' | 'return' | null;
}>({
  open: false,
  variantID: null,
  type: 'in',
  productType: null,
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
  if (search.value.trim() !== '') {
    const response = await useProductStore().searchProduct(search.value);
    if (response?.status === 200) {
      listProductSearch.value = response.data.products;
    }
  }
};
const getReturnItem = async () => {
  const response = await useReturnStore().getStockReentryReturnItems();
  if (response?.status === 200) {
    listReturnItemSearch.value = response.data.products;
  }
};
const makeNewRequests = async () => {
  await newRequest();
  await getReturnItem();
};
const changeShowFormNewMovementProduct = (
  show: boolean,
  type: 'in' | 'out' = 'in',
  variantID: number | null = null,
  productType: 'stock' | 'return' | null = null,
): void => {
  showFormNewMovementProduct.variantID = variantID;
  showFormNewMovementProduct.type = type;
  showFormNewMovementProduct.open = show;
  showFormNewMovementProduct.productType = productType;
};
const makeProductVariant = (
  productVariantID: number,
  type: 'in' | 'out',
  productType: 'stock' | 'return',
) => {
  changeShowFormNewMovementProduct(true, type, productVariantID, productType);
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

watch(open, async () => {
  if (open.value) {
    clear();
    await getReturnItem();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent :maximized="$q.screen.lt.sm">
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
            <Empty v-if="listProductSearch.length === 0" message="Sem resultado" color="bg-red-3" />
            <TableSearchProductVariant
              v-if="listProductSearch.length > 0"
              :list="listProductSearch"
              @choose-product-variant="makeProductVariant"
            />
            <q-separator
              v-if="listReturnItemSearch.length > 0"
              class="q-my-lg"
              color="primary"
              inset
            />
            <TableSearchReturnItem
              v-if="listReturnItemSearch.length > 0"
              class="q-mt-md"
              :list="listReturnItemSearch"
              @choose-product-variant="makeProductVariant"
            />
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
      @new-request="makeNewRequests"
    />
  </q-dialog>
</template>
