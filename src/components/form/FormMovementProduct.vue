<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductStore } from 'src/stores/product-store';
import TableSearchProductVariant from '../table/TableSearchProductVariant.vue';
import Empty from '../info/Empty.vue';
// import { createErrorData } from 'src/composables/CreateNotify';
// import { checkDataMovement } from 'src/composables/CheckData';

defineOptions({
  name: 'FormMovementProduct',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingProduct } = storeToRefs(useProductStore());

const listProductSearch = ref<ISearchProductVariant[]>([]);
const selectedProduct = ref<IVariant | null>(null);
const search = ref<string>('');
const dataMovement = reactive({
  value: '' as string,
  date: '' as string,
  description: '' as string,
});
const selectedType = ref<IQuasarSelect<'entry' | 'out'>>({
  label: 'Entrada 🟩',
  value: 'entry',
});

const clear = (): void => {
  Object.assign(dataMovement, {
    value: '',
    date: '',
    description: '',
  });

  selectedType.value = {
    label: 'Entrada 🟩',
    value: 'entry',
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

const getLabelSearch = computed((): string => {
  return 'Buscar por produto, SKU ou código';
});
const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const isLoading = computed(() => {
  return loadingProduct.value;
});
// const optionsType = computed(() => {
//   return [
//     {
//       label: 'Entrada 🟩',
//       value: 'entry',
//     },
//     {
//       label: 'Saída 🟥',
//       value: 'out',
//     },
//   ];
// });

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-2" style="width: 800px; max-width: 98vw">
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
          <q-btn
            v-if="false"
            color="primary"
            label="Registrar"
            size="md"
            :loading="isLoading"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
