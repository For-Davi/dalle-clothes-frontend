<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { useTypesReceiptStore } from 'src/stores/types-receipt-store';
import { useReceiptstore } from 'src/stores/receipt-store';
import { checkReceiptData } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';
import { PaymentTypeLabels } from 'src/enums/payment-enum';

defineOptions({ name: 'FormReceipt' });

const props = defineProps<{
  data: {
    open: boolean;
    receiptID: number | null;
  };
}>();
const emit = defineEmits<{ 'update:open': [void] }>();

const { listTypesReceipt } = storeToRefs(useTypesReceiptStore());
const { loadingReceipt } = storeToRefs(useReceiptstore());

const loading = ref<boolean>(false);
const dataReceipt = reactive({
  identifier: '',
  type: { label: 'Nenhum selecionado', value: null } as IQuasarSelect<number | null>,
  description: '',
});
const selectedStatus = ref<IQuasarSelect<number>>({ label: 'Ativo', value: 1 });

const clear = () => {
  dataReceipt.identifier = '';
  dataReceipt.type = { label: 'Nenhum selecionado', value: null };
  dataReceipt.description = '';
  selectedStatus.value = { label: 'Ativo', value: 1 };
};
const save = async () => {
  const check = checkReceiptData(dataReceipt);
  if (!check.status) return createErrorData(check.message || 'Erro ao cadastrar recebimento');

  const response = await useReceiptstore().createReceipt({
    identifier: dataReceipt.identifier,
    typesID: dataReceipt.type.value,
    description: dataReceipt.description || null,
  });

  if (response?.status === 201) {
    clear();
    emit('update:open');
  }
};
const update = async () => {
  const check = checkReceiptData(dataReceipt);
  if (check.status) {
    const response = await useReceiptstore().updateReceipt(
      receiptID.value ?? 0,
      dataReceipt.identifier,
      dataReceipt.type.value,
      selectedStatus.value.value,
      dataReceipt.description || null,
    );
    if (response?.status === 200) {
      clear();
      emit('update:open');
    }
  }
};
const checkDataEdit = async () => {
  if (receiptID.value !== null) {
    const response = await useReceiptstore().showReceipt(receiptID.value);

    if (response?.status === 200) {
      const receipt = response.data.receipt;

      Object.assign(dataReceipt, {
        identifier: receipt.identifier,
        type: optionsTypes.value.find((opt) => opt.value === receipt.type_receipt_id) || {
          label: 'Nenhum selecionado',
          value: null,
        },
        active: receipt.active,
        description: receipt.description,
      });
      selectedStatus.value = optionsStatus.value.find((opt) => opt.value === receipt.active) || {
        label: 'Ativo',
        value: 1,
      };
    }
  }
};
const changeLoading = (value: boolean) => {
  loading.value = value;
};

const receiptID = computed(() => props.data.receiptID);
const optionsTypes = computed((): IQuasarSelect<number | null>[] => [
  { label: 'Nenhum selecionado', value: null },
  ...listTypesReceipt.value.map((item) => ({
    label: PaymentTypeLabels[item.name as keyof typeof PaymentTypeLabels],
    value: item.id,
  })),
]);
const optionsStatus = computed(() => [
  { label: 'Ativo', value: 1 },
  { label: 'Inativo', value: 0 },
]);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
const isLoading = computed((): boolean => {
  return loading.value || loadingReceipt.value;
});

watch(open, async () => {
  if (open.value) {
    clear();
    changeLoading(true);
    await useTypesReceiptStore().getTypesReceipt();
    await checkDataEdit();
    changeLoading(false);
  }
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="receiptID ? 'Atualização de recebimento' : 'Cadastro de recebimento'"
          icon="account_balance"
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading :show="isLoading" />
        <q-form v-show="!isLoading" class="q-gutter-y-sm">
          <q-input
            v-model="dataReceipt.identifier"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome do recebimento (Identificador)"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="account_balance" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="dataReceipt.type"
            label="Selecione o tipo"
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
            class="full-width"
            :options="optionsTypes"
          >
            <template v-slot:prepend>
              <q-icon name="credit_card" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-show="receiptID !== null"
            v-model="selectedStatus"
            label="Status"
            outlined
            dense
            options-dense
            bg-color="white"
            label-color="black"
            class="full-width"
            :options="optionsStatus"
          >
            <template v-slot:prepend>
              <q-icon name="check" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataReceipt.description"
            bg-color="white"
            label-color="black"
            outlined
            label="Descrição"
            dense
            input-class="text-black no-resize"
            type="textarea"
            counter
            :maxlength="500"
          >
            <template v-slot:prepend>
              <q-icon name="description" color="black" size="20px" />
            </template>
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
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
            v-if="!receiptID"
            color="primary"
            label="Salvar"
            @click="save"
            :loading="isLoading"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            color="primary"
            label="Atualizar"
            @click="update"
            :loading="isLoading"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
