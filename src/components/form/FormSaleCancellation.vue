<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import { checkDataSaleCancellation } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';
import { useSaleStore } from 'src/stores/sale-store';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';

defineOptions({
  name: 'FormSaleCancellation',
});

const props = defineProps<{
  data: {
    open: boolean;
    saleID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
  cancelled: [void];
}>();

const { loadingCancellation } = storeToRefs(useSaleStore());

const dataCancellation = reactive({
  saleID: props.data.saleID,
  reason: '' as string | null,
  description: '' as string,
});
const showConfirmAction = ref<boolean>(false);

const save = async () => {
  const check = checkDataSaleCancellation(dataCancellation);
  if (check.status) {
    const response = await useSaleStore().createSaleCancellation(dataCancellation);

    if (response?.status === 201) {
      emit('cancelled');
    }
  } else {
    createErrorData(check.message || 'Erro ao enviar dados do cancelamento');
  }
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await save();
};
const closeConfirmAction = () => {
  showConfirmAction.value = false;
};
const changeShowConfirmAction = () => {
  showConfirmAction.value = true;
};
const clear = () => {
  Object.assign(dataCancellation, {
    saleID: props.data.saleID,
    reason: '',
    description: '',
  });
};

const optionsReasons = computed(() => {
  return [
    { label: 'Não informado', value: 'not_informed' },
    { label: 'Desistência/Arrependimento', value: 'regret' },
    { label: 'Atraso na entrega', value: 'delivery_delay' },
    { label: 'Produto(s) errado(s) entregado(s)', value: 'wrong_product' },
    { label: 'Produto(s) com falta de estoque', value: 'out_of_stock' },
    { label: 'Impossibilidade de pagamento', value: 'payment_failure' },
    { label: 'Compra por engano', value: 'mistaken_purchase' },
    { label: 'Venda duplicada', value: 'duplicate_sale' },
    { label: 'Dados incorretos (pagamentos, cliente, entrega)', value: 'incorrect_data' },
    { label: 'Fraude/Transação suspeita', value: 'fraud' },
    { label: 'Cliente com restrição cadastral ou legal', value: 'customer_restriction' },
  ];
});
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>

<template>
  <q-dialog v-model="open" persistent>
    <q-card style="min-width: 50vw" class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Formulário de cancelamento" icon="money_off" />
      </q-card-section>
      <q-card-section>
        <Loading v-show="loadingCancellation" :show="loadingCancellation" />
        <div class="q-gutter-y-sm" v-if="!loadingCancellation">
          <q-select
            v-model="dataCancellation.reason"
            :options="optionsReasons"
            label="Selecione o motivo"
            outlined
            dense
            options-dense
            emit-value
            map-options
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon name="description" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataCancellation.description"
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
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            :loading="loadingCancellation"
            unelevated
            no-caps
            flat
          />
          <q-btn
            color="primary"
            label="Salvar"
            size="md"
            @click="changeShowConfirmAction"
            :loading="loadingCancellation"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Modals -->
  <ConfirmAction
    :open="showConfirmAction"
    label-action="Continuar"
    title="Confirmação de cancelamento da venda"
    message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e cancelará a venda permanentemente."
    @update:open="closeConfirmAction"
    @update:ok="closeConfirmActionOk"
  />
</template>
