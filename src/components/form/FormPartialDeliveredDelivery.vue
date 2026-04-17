<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSaleStore } from 'src/stores/sale-store';
import { useReturnStore } from 'src/stores/return-store';
import TitlePage from '../shared/TitlePage.vue';
import Loading from '../shared/Loading.vue';
import { checkDataPartialDelivered } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';
import { useDeliveryStore } from 'src/stores/delivery-store';

defineOptions({
  name: 'FormPartialDeliveredDelivery',
});

const props = defineProps<{
  data: {
    open: boolean;
    saleID: number | null;
    returnID: number | null;
    deliveryID: number | null;
    status: string;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingDelivery } = storeToRefs(useDeliveryStore());
const { loadingListSaleProducts, listSaleProducts } = storeToRefs(useSaleStore());
const { loadingReturn, listReturnItems } = storeToRefs(useReturnStore());

const partialDeliveryData = ref<IDeliveredProducts[]>([]);

const save = async () => {
  const check = checkDataPartialDelivered(partialDeliveryData.value);

  if (check.status) {
    const response = await useDeliveryStore().createPartialDeliveredDelivery(
      props.data.deliveryID ?? 0,
      partialDeliveryData.value,
      props.data.status,
    );
    if (response?.status === 200) {
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao enviar dados para marcar como entregue parcialmente');
  }
};
const fetchSaleProducts = async () => {
  await useSaleStore().getSaleItens(props.data.saleID ?? 0, 1);
};
const fetchReturnProducts = async () => {
  await useReturnStore().getReturnItems(props.data.returnID ?? 0, 1);
};

const listProducts = computed(() => {
  if (props.data.saleID && !props.data.returnID) {
    return listSaleProducts;
  } else {
    return listReturnItems;
  }
});
const hasLoading = computed(() => {
  return loadingListSaleProducts.value || loadingReturn.value || loadingDelivery.value;
});
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(
  () => open.value,
  async () => {
    if (open.value) {
      if (props.data.returnID) {
        await fetchReturnProducts();
      } else {
        await fetchSaleProducts();
      }
    }
  },
);
watch(
  () => listProducts.value,
  (newList) => {
    if (newList && newList.value.length > 0) {
      partialDeliveryData.value = newList.value.map((item) => ({
        productVariantID: item.product_variant_id,
        quantitySaled: item.quantity,
        quantityDelivered: item.quantity_delivered ?? 0,
      }));
    }
  },
  { deep: true },
);
</script>

<template>
  <q-dialog v-model="open">
    <q-card
      :class="
        hasLoading ? 'bg-grey-2 form-basic column justify-between' : 'bg-grey-2 form-basic column'
      "
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Finalizar entrega parcialmente" icon="check" />
      </q-card-section>
      <Loading :show="hasLoading" v-show="hasLoading" />
      <q-card-section v-if="!hasLoading">
        <div class="text-h6 text-primary flex items-center q-mb-md">
          <q-icon name="info" class="q-mr-sm" />
          Informe a quantidade de itens entregues
        </div>
        <q-list bordered separator>
          <q-item
            v-for="(item, index) in listProducts.value"
            :key="item.product_variant_id"
            class="q-py-md"
          >
            <q-item-section>
              <q-item-label class="text-weight-bold">{{ item.product_name }}</q-item-label>
              <q-item-label caption>
                SKU: {{ item.product_sku || '-' }} | Código: {{ item.product_code ?? '-' }}
              </q-item-label>
              <q-item-label caption>
                Cor: {{ item.color_name ?? '-' }}
                <q-badge :style="{ backgroundColor: item.color }" class="q-ml-xs" />
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="row items-center q-gutter-md">
                <div class="text-center">
                  <div class="text-caption">Vendido</div>
                  <div class="text-subtitle2">{{ item.quantity }}</div>
                </div>

                <q-input
                  v-if="partialDeliveryData[index]"
                  v-model.number="partialDeliveryData[index].quantityDelivered"
                  label="Entregue"
                  outlined
                  dense
                  style="width: 100px"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right" class="q-mt-lg">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            :loading="hasLoading"
            unelevated
            no-caps
          />
          <q-btn
            color="primary"
            label="Salvar"
            size="md"
            @click="save"
            :loading="hasLoading"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
