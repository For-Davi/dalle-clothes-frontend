<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, watch } from 'vue';
import Loading from '../shared/Loading.vue';
import Empty from '../info/Empty.vue';
import { storeToRefs } from 'pinia';
import { useSupplierOrderStore } from 'src/stores/supplier-order-store';
import FormSupplierOrder from '../form/FormSupplierOrder.vue';

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

const showFormSupplierOrder = reactive<{
  open: boolean;
  orderID: number | null;
}>({
  open: false,
  orderID: null,
});

const clear = () => {
  Object.assign(showFormSupplierOrder, {
    open: false,
    orderID: null,
  });
};

const startEdit = (orderID: number) => {
  changeShowFormSupplierOrder(true, orderID);
};
const changeShowFormSupplierOrder = (show: boolean, orderID: number | null = null): void => {
  Object.assign(showFormSupplierOrder, {
    open: show,
    orderID: orderID,
  });
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 sub-page column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de pedidos" icon="fa-solid fa-list" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingSupplierOrder">
          <TableSupplierOrder
            v-show="listSupplierOrder.length > 0"
            @show:show-form-supplier-order="startEdit"
          />
          <Empty
            v-show="listSupplierOrder.length <= 0"
            message="Sem pedidos cadastrados"
            color="bg-red-3"
            type-img="list"
          />
        </div>
        <Loading v-show="loadingSupplierOrder" :show="loadingSupplierOrder" />
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
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
    </q-card>
  </q-dialog>
</template>
