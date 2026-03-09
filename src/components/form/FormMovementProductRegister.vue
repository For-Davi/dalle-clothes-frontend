<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { useProductStore } from 'src/stores/product-store';
import { useSupplierStore } from 'src/stores/supplier-store';

defineOptions({
  name: 'FormMovementProductRegister',
});

const props = defineProps<{
  data: {
    open: boolean;
    variantID: number | null;
    type: 'in' | 'out';
    productType: 'stock' | 'return' | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
  newRequest: [void];
}>();

const { loadingProduct } = storeToRefs(useProductStore());
const { loadingSupplier, listSupplier } = storeToRefs(useSupplierStore());

const dataMovement = reactive({
  documentNumber: '' as string,
  lotNumber: '' as string,
  quantity: '' as string,
  unitCost: '' as string,
  totalCost: '' as string,
  description: '' as string,
});
const selectedReason = ref<IQuasarSelect<string>>({
  label: 'Devolução',
  value: 'return',
});
const selectedSupplier = ref<IQuasarSelect<number | null>>({
  label: 'Não informado',
  value: null,
});
const selectedType = ref<IQuasarSelect<'in' | 'out'>>({
  label: 'Entrada 🟩',
  value: 'in',
});

const clear = (): void => {
  Object.assign(dataMovement, {
    documentNumber: '',
    lotNumber: '',
    quantity: '',
    unitCost: '',
    totalCost: '',
    description: '',
  });

  selectedReason.value = {
    label: 'Devolução',
    value: 'return',
  };
  selectedSupplier.value = {
    label: 'Não informado',
    value: null,
  };

  selectedType.value = {
    label: 'Entrada 🟩',
    value: 'in',
  };
};
const save = async (): Promise<void> => {
  let response = null;
  if (props.data.productType === 'stock') {
    response = await useProductStore().createMovementVariant({
      variantID: variantID.value ?? 0,
      documentNumber:
        dataMovement.documentNumber.trim().length === 0 ? null : dataMovement.documentNumber,
      lotNumber: dataMovement.lotNumber.trim().length === 0 ? null : dataMovement.lotNumber,
      quantity: Number(dataMovement.quantity),
      unitCost: parseFloat(dataMovement.unitCost),
      totalCost: parseFloat(dataMovement.totalCost),
      reason: selectedReason.value.value,
      supplierID: selectedSupplier.value.value,
      type: props.data.type,
      description: dataMovement.description.trim().length === 0 ? null : dataMovement.description,
    });
  }
  if (props.data.productType === 'return') {
    response = await useProductStore().createMovementStockReentry({
      variantID: variantID.value ?? 0,
      documentNumber:
        dataMovement.documentNumber.trim().length === 0 ? null : dataMovement.documentNumber,
      lotNumber: dataMovement.lotNumber.trim().length === 0 ? null : dataMovement.lotNumber,
      quantity: Number(dataMovement.quantity),
      unitCost: parseFloat(dataMovement.unitCost),
      totalCost: parseFloat(dataMovement.totalCost),
      reason: selectedReason.value.value,
      supplierID: selectedSupplier.value.value,
      type: props.data.type,
      description: dataMovement.description.trim().length === 0 ? null : dataMovement.description,
    });
  }
  if (response?.status === 200) {
    clear();
    emit('update:open');
    emit('newRequest');
  }
};
const fetchSuppliers = async () => {
  await useSupplierStore().getSuppliers();
};
const checkType = (): void => {
  selectedType.value =
    props.data.type === 'in'
      ? {
          label: 'Entrada 🟩',
          value: 'in',
        }
      : {
          label: 'Saída 🟥',
          value: 'out',
        };
};
const checkReason = (): void => {
  if (props.data.type === 'in') {
    selectedReason.value = {
      label: 'Compra',
      value: 'buy',
    };
  } else {
    selectedReason.value = {
      label: 'Devolução',
      value: 'return',
    };
  }
};

const isLoading = computed((): boolean => {
  return loadingProduct.value || loadingSupplier.value;
});
const variantID = computed(() => props.data.variantID);
const optionsReason = computed((): IQuasarSelect<string>[] => {
  const entryReasons: IQuasarSelect<string>[] = [
    { label: 'Compra', value: 'buy' },
    { label: 'Devolução', value: 'return' },
    { label: 'Transferência de entrada', value: 'transfer_in' },
    { label: 'Ajuste de entrada', value: 'adjustment_in' },
    { label: 'Produção', value: 'production' },
  ];

  const exitReasons: IQuasarSelect<string>[] = [
    { label: 'Devolução', value: 'return' },
    { label: 'Transferência de saída', value: 'transfer_out' },
    { label: 'Perda/Avaria', value: 'loss' },
    { label: 'Ajuste de saída', value: 'adjustment_out' },
    { label: 'Consumo interno', value: 'internal_use' },
  ];

  return props.data.type === 'in' ? entryReasons : exitReasons;
});
const optionsSuppliers = computed((): IQuasarSelect<number | null>[] => {
  return [
    {
      label: 'Não informado',
      value: null,
    },
    ...listSupplier.value.map((item) => ({
      label: item.name,
      value: item.id,
    })),
  ];
});
const optionsType = computed(() => {
  return [
    {
      label: 'Entrada 🟩',
      value: 'in',
    },
    {
      label: 'Saída 🟥',
      value: 'out',
    },
  ];
});
const showSupplierField = computed(() => {
  const entryReasons = ['buy', 'return', 'production'];
  return props.data.type === 'in' && entryReasons.includes(selectedReason.value.value);
});
const showFinancialFields = computed(() => {
  const financialReasons = ['buy', 'sale', 'production'];
  return financialReasons.includes(selectedReason.value.value);
});
const showDocumentField = computed(() => {
  const noDocumentReasons = ['adjustment_in', 'adjustment_out', 'internal_use'];
  return !noDocumentReasons.includes(selectedReason.value.value);
});
const showLotField = computed(() => {
  const noLotReasons = ['adjustment_in', 'adjustment_out', 'internal_use'];
  return !noLotReasons.includes(selectedReason.value.value);
});
const documentLabel = computed(() => {
  const labels: Record<string, string> = {
    buy: 'Nº Nota Fiscal',
    sale: 'Nº Pedido',
    return: 'Nº Devolução',
    transfer_in: 'Nº Transferência',
    transfer_out: 'Nº Transferência',
    loss: 'Nº Relatório',
    production: 'Nº Ordem Produção',
    adjustment_in: 'Nº Ajuste',
    adjustment_out: 'Nº Ajuste',
    internal_use: 'Nº Requisição',
  };
  return labels[selectedReason.value.value] || 'Nº Documento';
});
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(selectedReason, (newReason) => {
  if (newReason.value === 'return' && props.data.type === 'in') {
    selectedSupplier.value = {
      label: 'Cliente/Consumidor',
      value: null,
    };
  } else if (newReason.value === 'buy') {
    selectedSupplier.value = {
      label: 'Não informado',
      value: null,
    };
  }
});
watch(open, async () => {
  clear();
  if (open.value) {
    checkType();
    checkReason();
    await fetchSuppliers();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Registro de movimentação" icon="list_alt" />
      </q-card-section>
      <q-card-section class="q-pa-sm" v-show="!isLoading">
        <Loading v-show="isLoading" :show="isLoading" />
        <q-form class="q-gutter-y-sm">
          <q-select
            v-model="selectedType"
            outlined
            bg-color="white"
            label-color="black"
            :options="optionsType"
            label="Tipo de movimentação"
            map-options
            readonly
            dense
            options-dense
          >
            <template v-slot:prepend>
              <q-icon name="checklist" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            outlined
            v-model="selectedReason"
            label="Motivo"
            :options="optionsReason"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="info" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-if="showSupplierField"
            outlined
            v-model="selectedSupplier"
            label="Fornecedor"
            :options="optionsSuppliers"
            bg-color="white"
            dense
            map-options
            options-dense
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="local_shipping" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-if="showDocumentField"
            v-model="dataMovement.documentNumber"
            bg-color="white"
            label-color="black"
            outlined
            :label="documentLabel"
            dense
            input-class="text-black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-barcode" color="black" size="14px" />
            </template>
          </q-input>
          <q-input
            v-if="showLotField"
            v-model="dataMovement.lotNumber"
            bg-color="white"
            label-color="black"
            outlined
            label="Lote"
            dense
            input-class="text-black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-box" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataMovement.quantity"
            bg-color="white"
            label-color="black"
            outlined
            label="Quantidade"
            dense
            input-class="text-black"
            class="full-width"
            maxlength="11"
          >
            <template v-slot:prepend>
              <q-icon name="calculate" color="black" size="20px" />
            </template>
          </q-input>
          <div v-if="showFinancialFields" class="row justify-between">
            <q-input
              v-model="dataMovement.totalCost"
              bg-color="white"
              label-color="black"
              outlined
              label="R$ Total"
              dense
              input-class="text-black no-spinners"
              type="text"
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataMovement.unitCost"
              bg-color="white"
              label-color="black"
              outlined
              label="R$ Unitário"
              dense
              input-class="text-black no-spinners"
              type="text"
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="dataMovement.description"
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
      <q-card-actions align="right" v-show="!loadingSupplier">
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
            @click="save"
            color="primary"
            label="Salvar"
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
