<script setup lang="ts">
import Description from 'src/components/general/Description.vue';
import { ref, reactive, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useReceiptstore } from 'src/stores/receipt-store';
import { columnsReceipts } from 'src/utils/columns';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import { PaymentTypeLabels, PaymentType } from 'src/enums/payment-enum';

const paymentTypeIcon: Record<string, string> = {
  [PaymentType.CREDIT]: 'account_balance',
  [PaymentType.PIX]: 'pix',
  [PaymentType.CREDIT_CARD]: 'credit_card',
  [PaymentType.DEBT_CARD]: 'credit_card',
  [PaymentType.MONEY]: 'payments',
};

const paymentTypeColor: Record<string, string> = {
  [PaymentType.CREDIT]: 'blue-7',
  [PaymentType.PIX]: 'teal-6',
  [PaymentType.CREDIT_CARD]: 'purple-6',
  [PaymentType.DEBT_CARD]: 'indigo-6',
  [PaymentType.MONEY]: 'green-7',
};

defineOptions({
  name: 'TableReceipt',
});

const props = withDefaults(
  defineProps<{
    filter?: string;
  }>(),
  {
    filter: '',
  },
);

const emit = defineEmits<{
  'show:showFormReceipt': [number];
}>();

const { loadingReceipt, listReceipt } = storeToRefs(useReceiptstore());

const showConfirmAction = ref<boolean>(false);
const receiptMonitoring = ref<number | null>(null);
const showDescription = reactive<{
  open: boolean;
  description: string | null;
}>({
  open: false,
  description: null,
});

const changeShowDescription = (show: boolean, receipt: IReceipt | null = null): void => {
  Object.assign(showDescription, {
    open: show,
    description: receipt?.description || null,
  });
};
const openConfirmAction = (id: number): void => {
  receiptMonitoring.value = id;
  showConfirmAction.value = true;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useReceiptstore().deleteReceipt(receiptMonitoring.value ?? 0);
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
};
const startEdit = (id: number): void => {
  emit('show:showFormReceipt', id);
};
const startExclude = (id: number): void => {
  openConfirmAction(id);
};
const fetchReceipts = async (): Promise<void> => {
  await useReceiptstore().getReceipt();
};

onMounted(async () => {
  await fetchReceipts();
});
</script>

<template>
  <section class="q-py-sm">
    <q-table
      grid
      :rows="loadingReceipt ? [] : listReceipt"
      :columns="columnsReceipts"
      :filter="props.filter"
      :loading="loadingReceipt"
      row-key="id"
      card-container-class="row q-col-gutter-md"
      no-data-label="Nenhum recebimento para mostrar"
      :rows-per-page-options="[0]"
    >
      <template v-slot:item="props">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-card class="receipt-card" flat bordered>
            <q-card-section class="text-center q-pb-none">
              <q-avatar
                size="72px"
                font-size="28px"
                :color="paymentTypeColor[props.row.type?.name] ?? 'grey-6'"
                text-color="white"
                class="shadow-2"
              >
                <q-icon :name="paymentTypeIcon[props.row.type?.name] ?? 'receipt'" />
              </q-avatar>

              <div class="text-h6 q-mt-md ellipsis">{{ props.row.identifier }}</div>
              <div class="text-caption text-grey-7">
                {{
                  PaymentTypeLabels[props.row.type?.name as keyof typeof PaymentTypeLabels] ||
                  'Nenhum selecionado'
                }}
              </div>
            </q-card-section>

            <q-card-section>
              <div
                v-if="props.row.description"
                class="text-body2 text-grey-8 q-mb-sm description-text"
              >
                <q-icon name="notes" size="xs" class="q-mr-xs" />
                {{ props.row.description }}
              </div>

              <q-separator inset class="q-my-sm" />

              <div class="row justify-between items-center">
                <q-chip
                  dense
                  :color="props.row.active === 1 ? 'green-1' : 'red-1'"
                  :text-color="props.row.active === 1 ? 'green-9' : 'red-9'"
                  :icon="props.row.active === 1 ? 'check_circle' : 'do_not_disturb_on'"
                >
                  {{ props.row.active === 1 ? 'Ativo' : 'Inativo' }}
                </q-chip>

                <div class="row">
                  <q-btn
                    v-if="props.row.description"
                    flat
                    round
                    color="blue"
                    icon="description"
                    size="sm"
                    @click="changeShowDescription(true, props.row)"
                  >
                    <q-tooltip>Ver descrição</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="hasPermission('receipt.update')"
                    flat
                    round
                    color="primary"
                    icon="edit"
                    size="sm"
                    @click="startEdit(props.row.id)"
                  >
                    <q-tooltip>Editar recebimento</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="hasPermission('receipt.delete')"
                    flat
                    round
                    color="negative"
                    icon="delete"
                    size="sm"
                    @click="startExclude(props.row.id)"
                  >
                    <q-tooltip>Excluir recebimento</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>

    <!-- Modals -->
    <Description :data="showDescription" @update:open="changeShowDescription(false)" />
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão de recebimento"
      message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá o recebimento permanentemente."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>

<style scoped lang="scss">
.receipt-card {
  border-radius: 12px;
}

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
