<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from 'src/components/shared/Loading.vue';
import { getLabelStatus } from 'src/composables/Label';
import { formatToBrazilianDate } from 'src/composables/FormatData';
import { formatToReal } from 'src/composables/Money';
import { useSupplierOrderStore } from 'src/stores/supplier-order-store';
import { exportOrderService } from 'src/services/supplier-order-service';
import { nextTick } from 'vue';
import { checkSupplierOrderReceived } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';

defineOptions({
  name: 'SupplierOrderDetails',
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

const { loadingSupplierOrder } = storeToRefs(useSupplierOrderStore());

const loading = ref<boolean>(false);
const dataOrder = ref<IShowOrder | null>(null);
const dateReceived = ref<string>('');
const showSupplierOrderReceipt = ref<boolean>(false);

const clear = (): void => {
  dataOrder.value = null;
  dateReceived.value = '';
  showSupplierOrderReceipt.value = false;
};
const mountData = async (): Promise<void> => {
  if (!orderID.value) return;

  const response = await useSupplierOrderStore().showOrderSupplier(orderID.value);
  if (response?.status === 200) {
    dataOrder.value = response.data.order;
  }
};
const getColorStyle = (hexColor: string) => {
  return {
    backgroundColor: hexColor || 'transparent',
    width: '15px',
    height: '15px',
    border: '1px solid #ddd',
    borderRadius: '50%',
    display: 'inline-block',
    verticalAlign: 'middle',
  };
};
const download = async () => {
  loading.value = true;
  await exportOrderService(orderID.value!);
  loading.value = false;
};
const changeShowSupplierOrderReceipt = (): void => {
  showSupplierOrderReceipt.value = !showSupplierOrderReceipt.value;
};
const checkReceived = (): void => {
  dataOrder.value?.items?.forEach((item: ISupplierOrderItem) => {
    let received = Number(item.received ?? 0);

    const requested = Number(item.quantity_requested) || 0;
    const alreadyReceived = Number(item.quantity_received) || 0;
    const remaining = requested - alreadyReceived;

    if (isNaN(received)) received = 0;

    let corrected = received;

    if (received > remaining) corrected = remaining;
    if (received < 0) corrected = 0;

    if (String(corrected) !== String(item.received)) {
      nextTick(() => {
        item.received = String(corrected);
      });
    }
  });
};
const closeReceived = (): void => {
  if (!dataOrder.value?.items) return;

  dataOrder.value.items.forEach((item: any) => {
    if ('received' in item) {
      delete item.received;
    }
  });

  dateReceived.value = '';

  changeShowSupplierOrderReceipt();
};
const getDataReceived = () => {
  return (
    dataOrder.value?.items
      .filter(
        (item: { id: number; received?: string }) =>
          item.received !== undefined && Number(item.received) !== 0,
      )
      .map((item: { id: number; received: string }) => ({
        id: item.id,
        received: Number(item.received),
      })) ?? []
  );
};
const saveReceived = async (): Promise<void> => {
  const check = checkSupplierOrderReceived(dataOrder.value?.items || [], dateReceived.value);
  if (check.status) {
    const response = await useSupplierOrderStore().saveReceivedOrder({
      dateReceived: dateReceived.value,
      items: getDataReceived(),
    });
    if (response?.status === 200) {
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar recebimento');
  }
};
const save = async () => {
  if (showSupplierOrderReceipt.value) {
    await saveReceived();
  }
};
const needReceived = (item: ISupplierOrderItem): boolean => {
  const remaining = (item.quantity_requested || 0) - (item.quantity_received || 0);

  return remaining <= 0 ? false : true;
};

const orderID = computed(() => props.data.orderID);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
const orderTotalCost = computed<number>(() => {
  if (!dataOrder.value || !dataOrder.value.items || dataOrder.value.items.length === 0) {
    return 0;
  }
  return dataOrder.value.items.reduce((sum: number, item: any) => {
    const cost = parseFloat(item.total_cost || 0);
    return sum + (isNaN(cost) ? 0 : cost);
  }, 0);
});
const hasItemForReceived = computed(() => {
  const items = dataOrder.value?.items ?? [];

  return items.some((item) => needReceived(item));
});

watch(
  () => dataOrder.value,
  () => {
    checkReceived();
  },
  { deep: true },
);
watch(open, async () => {
  if (open.value) {
    clear();
    await mountData();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic" style="max-width: 700px; width: 95vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Detalhes do pedido" icon="list_alt" />
      </q-card-section>
      <Loading :show="loadingSupplierOrder" v-show="loadingSupplierOrder" />
      <q-card-section class="q-pa-md" v-show="!loadingSupplierOrder">
        <div class="column q-gutter-md">
          <q-card flat bordered class="q-pa-md bg-white">
            <div class="text-h6 text-primary flex items-center">
              <q-icon name="info" class="q-mr-sm" />
              Informações do Pedido
            </div>

            <q-separator spaced />

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <p class="flex items-center">
                  <q-icon name="confirmation_number" class="q-mr-sm text-primary" />
                  <b class="q-mr-sm">Número do pedido:</b> {{ dataOrder?.order_number }}
                </p>

                <p class="flex items-center">
                  <q-icon name="person" class="q-mr-sm text-primary" />
                  <b>Criado por:</b> {{ dataOrder?.user?.name }} - {{ dataOrder?.user?.email }}
                </p>

                <p class="flex items-center">
                  <q-icon name="flag" class="q-mr-sm text-primary" />
                  <b class="q-mr-sm">Status:</b>
                  <span
                    class="text-bold"
                    :style="{
                      color: getLabelStatus(dataOrder?.status).color,
                    }"
                  >
                    {{ getLabelStatus(dataOrder?.status).text }}
                  </span>
                </p>

                <p class="flex items-center">
                  <q-icon name="notes" class="q-mr-sm text-primary" />
                  <b class="q-mr-sm">Observações:</b> {{ dataOrder?.observation ?? '-' }}
                </p>
              </div>

              <div class="col-12 col-sm-6">
                <p class="flex items-center">
                  <q-icon name="paid" class="q-mr-sm text-primary" />
                  <b class="q-mr-sm">Total do pedido:</b> {{ formatToReal(orderTotalCost) }}
                </p>
                <p class="flex items-center">
                  <q-icon name="calendar_today" class="q-mr-sm text-primary" />
                  <b class="q-mr-sm">Data de emissão:</b> {{ dataOrder?.date_issue ?? '-' }}
                </p>

                <p class="flex items-center">
                  <q-icon name="event" class="q-mr-sm text-primary" />
                  <b class="q-mr-sm">Previsão entrega:</b>
                  {{ dataOrder?.date_delivery_expected ?? '-' }}
                </p>

                <p class="flex items-center">
                  <q-icon name="schedule" class="q-mr-sm text-primary" />
                  <b class="q-mr-sm">Criado em:</b>
                  {{ formatToBrazilianDate(dataOrder?.created_at) }}
                </p>
              </div>
            </div>
          </q-card>

          <q-card flat bordered class="q-pa-md bg-white">
            <div class="text-h6 text-primary">Itens do Pedido</div>
            <q-separator />
            <q-list class="column q-gutter-y-sm">
              <q-item
                v-for="(item, index) in dataOrder?.items ?? []"
                :key="index"
                class="q-py-md border-full-grey-light rounded-borders"
              >
                <q-item-section>
                  <div class="row q-col-gutter-sm">
                    <div class="col-12 col-sm-6">
                      <p class="flex items-center">
                        <q-icon name="shopping_bag" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Produto:</b> {{ item?.variant?.product?.name }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="view_module" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Grade:</b> {{ item?.variant?.grid_item?.size }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="qr_code_2" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Código:</b> {{ item?.variant?.code }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="label" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">SKU:</b> {{ item?.variant?.sku }}
                      </p>
                    </div>

                    <div class="col-12 col-sm-6">
                      <p class="flex items-center">
                        <q-icon name="palette" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Cor:</b>
                        <span
                          class="cursor-pointer"
                          :style="getColorStyle(item?.variant?.color?.hex_color_code)"
                        >
                          <q-tooltip>{{ item?.variant?.color?.name }}</q-tooltip>
                        </span>
                      </p>

                      <p class="flex items-center">
                        <q-icon name="payments" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Custo unitário:</b> {{ formatToReal(item?.unit_cost) }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="paid" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Total:</b>{{ formatToReal(item?.total_cost) }}
                      </p>
                    </div>

                    <div class="col-12">
                      <q-separator spaced />
                    </div>

                    <div class="col-12 col-sm-6">
                      <p class="flex items-center">
                        <q-icon name="shopping_cart" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Qtde requisitada:</b> {{ item?.quantity_requested }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="inventory" class="q-mr-sm text-primary" />
                        <b class="q-mr-sm">Qtde recebida:</b> {{ item?.quantity_received ?? '-' }}
                      </p>
                    </div>

                    <div class="col-12 col-sm-6">
                      <p class="flex items-center">
                        <q-icon
                          name="check_circle"
                          class="q-mr-sm"
                          :class="item?.finished ? 'text-positive' : 'text-grey'"
                        />
                        <b class="q-mr-sm">Finalizado:</b> {{ item?.finished ? 'Sim' : 'Não' }}
                      </p>
                    </div>

                    <div class="col-12" v-if="showSupplierOrderReceipt && needReceived(item)">
                      <q-input
                        outlined
                        label="Informe a quantidade recebida"
                        dense
                        v-model="item.received"
                        input-class="text-right"
                        class="q-mr-sm"
                        mask="##########"
                      />
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
            <div class="col-12 q-mt-sm" v-if="showSupplierOrderReceipt">
              <q-input
                v-model="dateReceived"
                bg-color="white"
                label-color="black"
                outlined
                label="Data de recebimento"
                dense
                input-class="text-black"
                mask="##/##/####"
              >
                <template v-slot:prepend>
                  <q-icon name="today" color="black" size="20px" />
                </template>
              </q-input>
            </div>
          </q-card>
        </div>
      </q-card-section>
      <q-card-actions v-show="!loadingSupplierOrder" class="row justify-between items-center">
        <div class="row no-wrap">
          <div v-if="!showSupplierOrderReceipt">
            <q-btn color="primary" icon="list_alt" round unelevated no-caps class="q-ml-sm">
              <q-tooltip>Status</q-tooltip>
            </q-btn>
            <q-btn color="secondary" icon="history" round unelevated no-caps class="q-ml-sm">
              <q-tooltip>Histórico</q-tooltip>
            </q-btn>
            <q-btn
              color="grey"
              icon="download"
              round
              unelevated
              no-caps
              class="q-ml-sm"
              @click="download"
              :loading="loading"
            >
              <q-tooltip>Download</q-tooltip>
            </q-btn>
          </div>
          <div>
            <q-btn
              v-if="!showSupplierOrderReceipt && hasItemForReceived"
              color="green"
              icon="fa-solid fa-box-archive"
              round
              unelevated
              no-caps
              class="q-ml-sm"
              @click="changeShowSupplierOrderReceipt"
            >
              <q-tooltip>Recebimento</q-tooltip>
            </q-btn>
            <q-btn
              v-if="showSupplierOrderReceipt"
              color="red"
              icon="close"
              round
              unelevated
              no-caps
              class="q-ml-sm"
              @click="closeReceived"
            >
              <q-tooltip>Cancelar</q-tooltip>
            </q-btn>
          </div>
        </div>
        <div>
          <q-btn
            color="red"
            label="Fechar"
            @click="open = false"
            unelevated
            no-caps
            class="q-mr-sm"
            :flat="showSupplierOrderReceipt"
          />
          <q-btn
            v-if="showSupplierOrderReceipt"
            @click="save"
            color="primary"
            label="Salvar"
            class="q-mr-sm"
            :loading="isLoading"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>

    <!-- Modals -->
    <FormSupplierOrderReceipt
      :data="showFormNewMovementProduct"
      @update:open="changeShowFormNewMovementProduct(false)"
      @new-request="newRequest"
    />
  </q-dialog>
</template>
