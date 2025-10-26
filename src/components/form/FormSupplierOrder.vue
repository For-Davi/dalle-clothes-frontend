<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
// import { checkDataSupplier } from 'src/composables/CheckData';
// import { createErrorData } from 'src/composables/CreateNotify';
import { useSupplierStore } from 'src/stores/supplier-store';
import { useSupplierOrderStore } from 'src/stores/supplier-order-store';
import { useProductStore } from 'src/stores/product-store';
import TableSelectProductVariant from '../fragments/supplier/TableSelectProductVariant.vue';

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
  itens: [] as ISupplierCartProduct[],
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
    itens: [],
  });

  selectedSupplier.value = {
    label: 'Não informado',
    value: null,
  };
};
const changeShowTableSelectProductVariant = () => {
  showTableSelectProductVariant.value = !showTableSelectProductVariant.value;
};
// const save = async () => {
//   const check = checkDataSupplier(dataSupplierOrder);
//   if (check.status) {
//     const response = await useSupplierStore().createSupplier(
//       dataSupplier.name,
//       dataSupplier.email.trim() !== '' ? dataSupplier.email : null,
//       dataSupplier.phone.trim() !== '' ? dataSupplier.phone : null,
//       dataSupplier.cpf.trim() !== '' ? Number(dataSupplier.cpf) : null,
//       dataSupplier.cnpj.trim() !== '' ? Number(dataSupplier.cnpj) : null,
//       dataSupplier.stateRegistration.trim() !== '' ? dataSupplier.stateRegistration : null,
//       dataSupplier.municipalRegistration.trim() !== '' ? dataSupplier.municipalRegistration : null,
//       dataSupplier.site.trim() !== '' ? dataSupplier.site : null,
//       dataSupplier.country.trim() !== '' ? dataSupplier.country : null,
//       dataSupplier.state.trim() !== '' ? dataSupplier.state : null,
//       dataSupplier.city.trim() !== '' ? dataSupplier.city : null,
//       dataSupplier.cep.trim() !== '' ? Number(dataSupplier.cep) : null,
//       dataSupplier.neighborhood.trim() !== '' ? dataSupplier.neighborhood : null,
//       dataSupplier.address.trim() !== '' ? dataSupplier.address : null,
//       dataSupplier.number.trim() !== '' ? Number(dataSupplier.number) : null,
//       dataSupplier.complement.trim() !== '' ? dataSupplier.complement : null,
//       dataSupplier.description.trim() !== '' ? dataSupplier.description : null,
//       selectedCategory.value.value,
//     );
//     if (response?.status === 201) {
//       clear();
//       emit('update:open');
//     }
//   } else {
//     createErrorData(check.message || 'Erro ao processar dados do fornecedor');
//   }
// };
// const update = async () => {
//   const check = checkDataSupplier(dataSupplier);
//   if (check.status) {
//     const response = await useSupplierStore().updateSupplier(
//       supplierId.value ?? 0,
//       dataSupplier.name,
//       dataSupplier.email.trim() !== '' ? dataSupplier.email : null,
//       dataSupplier.phone.trim() !== '' ? dataSupplier.phone : null,
//       dataSupplier.cpf.trim() !== '' ? Number(dataSupplier.cpf) : null,
//       dataSupplier.cnpj.trim() !== '' ? Number(dataSupplier.cnpj) : null,
//       dataSupplier.stateRegistration.trim() !== '' ? dataSupplier.stateRegistration : null,
//       dataSupplier.municipalRegistration.trim() !== '' ? dataSupplier.municipalRegistration : null,
//       dataSupplier.site.trim() !== '' ? dataSupplier.site : null,
//       dataSupplier.country.trim() !== '' ? dataSupplier.country : null,
//       dataSupplier.state.trim() !== '' ? dataSupplier.state : null,
//       dataSupplier.city.trim() !== '' ? dataSupplier.city : null,
//       dataSupplier.cep.trim() !== '' ? Number(dataSupplier.cep) : null,
//       dataSupplier.neighborhood.trim() !== '' ? dataSupplier.neighborhood : null,
//       dataSupplier.address.trim() !== '' ? dataSupplier.address : null,
//       dataSupplier.number.trim() !== '' ? Number(dataSupplier.number) : null,
//       dataSupplier.complement.trim() !== '' ? dataSupplier.complement : null,
//       dataSupplier.description.trim() !== '' ? dataSupplier.description : null,
//       selectedCategory.value.value,
//       selectedStatus.value.value,
//     );
//     if (response?.status === 200) {
//       clear();
//       emit('update:open');
//     }
//   } else {
//     createErrorData(check.message || 'Erro ao processar dados do fornecedor');
//   }
// };
// const checkDataEdit = async () => {
//   if (supplierId.value) {
//     const response = await useSupplierStore().showSupplier(supplierId.value);
//     if (response?.status === 200) {
//       const supplier = response.data.supplier;

//       Object.assign(dataSupplier, {
//         name: supplier.name ?? '',
//         email: supplier.email ?? '',
//         phone: supplier.phone ?? '',
//         cpf: supplier.cpf ? String(supplier.cpf) : '',
//         cnpj: supplier.cnpj ? String(supplier.cnpj) : '',
//         stateRegistration: supplier.state_registration ?? '',
//         municipalRegistration: supplier.municipal_registration ?? '',
//         site: supplier.site ?? '',
//         country: supplier.country ?? '',
//         state: supplier.state ?? '',
//         city: supplier.city ?? '',
//         cep: supplier.cep ? String(supplier.cep) : '',
//         neighborhood: supplier.neighborhood ?? '',
//         address: supplier.address ?? '',
//         number: supplier.number ? String(supplier.number) : '',
//         complement: supplier.complement ?? '',
//         description: supplier.description ?? '',
//       });

//       const selectedCategoryItem = listCategorySupplier.value.find(
//         (item) => item.id === supplier.category_supplier_id,
//       );
//       selectedCategory.value = selectedCategoryItem
//         ? { label: selectedCategoryItem?.name, value: selectedCategoryItem?.id }
//         : { label: 'Sem categoria', value: null };

//       selectedStatus.value =
//         supplier.active === 0
//           ? {
//               label: 'Inativo',
//               value: 0,
//             }
//           : {
//               label: 'Ativo',
//               value: 1,
//             };
//     }
//   }
// };
const fetchSuppliers = async (): Promise<void> => {
  await useSupplierStore().getSuppliersSelect();
};
const fetchProductVariants = async (): Promise<void> => {
  await useProductStore().getProducts();
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
const getLabelItens = computed((): string => {
  return `Total de itens: ${dataSupplierOrder.itens.length}`;
});

watch(open, async () => {
  clear();
  if (open.value) {
    await fetchSuppliers();
    await fetchProductVariants();
    // await checkDataEdit();
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
            :label="getLabelItens"
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
          <q-btn v-if="!orderID" color="primary" label="Salvar" size="md" unelevated no-caps />
          <q-btn v-else color="primary" label="Atualizar" size="md" unelevated no-caps />
        </div>
      </q-card-actions>
    </q-card>

    <!-- Modals -->
    <TableSelectProductVariant
      v-model:selected="dataSupplierOrder.itens"
      :list="listProduct"
      :loading="isLoading"
      :open="showTableSelectProductVariant"
      @update:open="changeShowTableSelectProductVariant"
    />
  </q-dialog>
</template>
