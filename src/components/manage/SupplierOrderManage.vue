<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref, watch } from 'vue';
import Loading from '../shared/Loading.vue';
import Empty from '../info/Empty.vue';
import { storeToRefs } from 'pinia';
import { useSupplierOrderStore } from 'src/stores/supplier-order-store';
import FormSupplierOrder from '../form/FormSupplierOrder.vue';
import TableSupplierOrder from '../table/TableSupplierOrder.vue';
import SupplierOrderDetails from '../fragments/supplier/SupplierOrderDetails.vue';
import { checkRegisterLimit } from 'src/composables/Plans';
import SubscriptionBanner from 'src/components/banner/SubscriptionBanner.vue';

defineOptions({
  name: 'SupplierOrderManage',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { listSupplierOrder, loadingSupplierOrder } = storeToRefs(useSupplierOrderStore());

const showFilterSupplierOrder = ref<boolean>(false);
const filter = ref<string>('');
const showDetailsSupplierOrder = reactive<{
  open: boolean;
  orderID: number | null;
}>({
  open: false,
  orderID: null,
});
const showFormSupplierOrder = reactive<{
  open: boolean;
  orderID: number | null;
}>({
  open: false,
  orderID: null,
});

const clear = () => {
  Object.assign(showDetailsSupplierOrder, {
    open: false,
    orderID: null,
  });
  Object.assign(showFormSupplierOrder, {
    open: false,
  });
};

const showDetails = async (orderID: number) => {
  await changeShowDetailsSupplierOrder(true, orderID);
};
const changeShowDetailsSupplierOrder = async (
  show: boolean,
  orderID: number | null = null,
): Promise<void> => {
  Object.assign(showDetailsSupplierOrder, {
    open: show,
    orderID: orderID,
  });

  if (!show) {
    await fetchOrders();
  }
};
const changeShowFormSupplierOrder = (show: boolean): void => {
  Object.assign(showFormSupplierOrder, {
    open: show,
  });
};
const fetchOrders = async (): Promise<void> => {
  await useSupplierOrderStore().getSupplierOrders();
};
const changeShowFilterSupplierOrder = (): void => {
  showFilterSupplierOrder.value = !showFilterSupplierOrder.value;
};

const planValidation = computed(() => {
  return checkRegisterLimit('supplier_orders', listSupplierOrder.value.length);
});
const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchOrders();
  }
});
</script>
<template>
  <q-dialog v-model="open" :maximized="$q.screen.lt.sm">
    <q-card class="bg-grey-2 sub-page column justify-between" style="min-width: 90vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de pedidos" icon="fa-solid fa-list" />
      </q-card-section>
      <q-card-section class="q-py-sm">
        <div v-show="!loadingSupplierOrder">
          <SubscriptionBanner v-if="planValidation.showUpgradeBanner" resource-name="pedidos" />
          <q-banner rounded class="bg-grey-4 q-mb-sm">
            <div class="row q-gutter-x-sm justify-end items-center">
              <q-input
                label="Pesquise"
                outlined
                v-model="filter"
                dense
                style="width: 200px"
                class="bg-white rounded-borders"
              >
                <template v-slot:prepend>
                  <q-icon name="search" size="20px" color="black" />
                </template>
              </q-input>
              <q-btn
                @click="changeShowFilterSupplierOrder"
                round
                color="primary"
                icon="filter_alt"
                unelevated
                size="13px"
              >
                <!-- <q-badge v-show="hasFilter" floating color="red" rounded /> -->
              </q-btn>
            </div>
          </q-banner>
          <div v-if="listSupplierOrder.length > 0" class="column items-end">
            <TableSupplierOrder :filter="filter" @show-details-supplier-order="showDetails" />
          </div>
          <Empty v-else message="Sem pedidos cadastrados" color="bg-red-3" type-img="list" />
        </div>
        <Loading v-show="loadingSupplierOrder" :show="loadingSupplierOrder" />
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm q-mr-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            unelevated
            no-caps
            flat
          />
          <q-btn
            v-if="hasPermission('supplier-order.create') && planValidation.canAdd"
            @click="changeShowFormSupplierOrder(true)"
            color="primary"
            label="Adicionar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>

      <!-- Modals -->
      <FormSupplierOrder
        :data="showFormSupplierOrder"
        @update:open="changeShowFormSupplierOrder(false)"
      />
      <SupplierOrderDetails
        :data="showDetailsSupplierOrder"
        @update:open="changeShowDetailsSupplierOrder(false)"
      />
    </q-card>
  </q-dialog>
</template>
