<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive } from 'vue';
import Loading from '../shared/Loading.vue';
import Empty from '../info/Empty.vue';
import { storeToRefs } from 'pinia';
import { useDeliveryGuyStore } from 'src/stores/delivery-guy-store';
import DeliveryGuyTable from '../table/DeliveryGuyTable.vue';
import FormDeliveryGuy from '../form/FormDeliveryGuy.vue';

defineOptions({
  name: 'DeliveryGuyManage',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingDeliveryGuy, listDeliveryGuy } = storeToRefs(useDeliveryGuyStore());

const showFormDeliveryGuy = reactive({
  open: false as boolean,
  deliveryGuyID: null as number | null,
});

const startEdit = (data: number) => {
  changeShowFormDeliveryGuy(true, data);
};
const changeShowFormDeliveryGuy = (show: boolean, deliveryGuyID: number | null = null): void => {
  Object.assign(showFormDeliveryGuy, {
    open: show,
    deliveryGuyID: deliveryGuyID,
  });
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card
      :class="
        loadingDeliveryGuy ? 'bg-grey-2 sub-page column justify-between' : 'bg-grey-2 sub-page'
      "
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Entregadores" icon="redeem" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingDeliveryGuy">
          <DeliveryGuyTable
            v-show="listDeliveryGuy.length > 0"
            @show:show-form-delivery-guy="startEdit"
          />
          <Empty
            v-show="listDeliveryGuy.length <= 0"
            message="Nenhum entregador cadastrado"
            color="bg-red-3"
          />
        </div>
        <Loading v-show="loadingDeliveryGuy" :show="loadingDeliveryGuy" />
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
        </div>
      </q-card-actions>
    </q-card>
    <!-- Modals -->
    <FormDeliveryGuy :data="showFormDeliveryGuy" @update:open="changeShowFormDeliveryGuy(false)" />
  </q-dialog>
</template>
