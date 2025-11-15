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

const clear = (): void => {
  dataOrder.value = null;
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
                        <b>Qtde requisitada:</b> {{ item?.quantity_requested }}
                      </p>

                      <p class="flex items-center">
                        <q-icon name="inventory" class="q-mr-sm text-primary" />
                        <b>Qtde recebida:</b> {{ item?.quantity_received ?? '-' }}
                      </p>
                    </div>

                    <div class="col-12 col-sm-6">
                      <p class="flex items-center">
                        <q-icon name="event_available" class="q-mr-sm text-primary" />
                        <b>Data recebimento:</b> {{ item?.date_received ?? '-' }}
                      </p>

                      <p class="flex items-center">
                        <q-icon
                          name="check_circle"
                          class="q-mr-sm"
                          :class="item?.finished ? 'text-positive' : 'text-grey'"
                        />
                        <b>Finalizado:</b>&nbsp; {{ item?.finished ? 'Sim' : 'Não' }}
                      </p>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </q-card-section>
      <q-card-actions v-show="!loadingSupplierOrder" class="row justify-between items-center">
        <div>
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
          <q-btn color="secondary" icon="history" round unelevated no-caps class="q-ml-sm">
            <q-tooltip>Histórico</q-tooltip>
          </q-btn>
        </div>
        <div>
          <q-btn
            color="red"
            label="Fechar"
            flat
            size="md"
            @click="open = false"
            unelevated
            no-caps
            class="q-mr-sm"
          />
          <q-btn color="primary" label="Status" size="md" unelevated no-caps class="q-mr-sm" />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
