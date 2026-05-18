<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductStore } from 'src/stores/product-store';
import Loading from '../shared/Loading.vue';

defineOptions({
  name: 'FormVariant',
});

const props = defineProps<{
  data: {
    open: boolean;
    variantID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
  'update:openFormProduct': [number];
}>();

const { loadingProduct } = storeToRefs(useProductStore());

const productID = ref<number | null>(null);
const dataVariant = reactive({
  price: '',
  offer: '',
  cost: '',
  stockQuantity: '',
  minStockAlert: '',
  sku: '',
  code: '',
  active: 1,
  description: '',
  location: '',
});
const selectedColor = ref<IColor | null>(null);

const clear = (): void => {
  Object.assign(dataVariant, {
    price: '',
    offer: '',
    cost: '',
    stockQuantity: '',
    minStockAlert: '',
    sku: '',
    code: '',
    active: 1,
    description: '',
    location: '',
  });

  productID.value = null;
  selectedColor.value = null;
};
const mountData = async () => {
  const response = await useProductStore().getProductVariant(props.data.variantID!);
  if (response?.status === 200) {
    const variant = response.data.variant;

    Object.assign(dataVariant, {
      sku: variant.sku ?? '',
      code: variant.code ?? '',
      active: variant.active,
      price: variant.price,
      cost: variant.cost,
      offer: variant.offer,
      stockQuantity: String(variant.stock_quantity),
      minStockAlert: String(variant.min_stock_alert),
      description: variant.description ?? '',
      location: variant.location ?? '',
    });

    selectedColor.value = variant.color_id ? variant.color : null;
    productID.value = variant.product_id;
  }
};
const update = async (): Promise<void> => {
  const response = await useProductStore().updateVariant({
    id: variantID.value ?? 0,
    price: parseFloat(dataVariant.price),
    cost: parseFloat(dataVariant.cost),
    minStockAlert: Number(dataVariant.minStockAlert),
    offer: parseFloat(dataVariant.offer),
    sku: dataVariant.sku.trim().length === 0 ? null : dataVariant.sku,
    active: Number(dataVariant.active),
    description: dataVariant.description.trim().length === 0 ? null : dataVariant.description,
    location: dataVariant.location.trim().length === 0 ? null : dataVariant.location,
    colorID: selectedColor.value?.id ?? null,
  });
  if (response?.status === 200) {
    clear();
    emit('update:open');
  }
};
const goFormProduct = (): void => {
  emit('update:openFormProduct', productID.value ?? 0);
  emit('update:open');
};

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
const isLoading = computed(() => {
  return loadingProduct.value;
});
const getlabelColor = computed((): string => {
  return selectedColor.value !== null ? 'Cor' : 'Sem cor definida';
});
const variantID = computed(() => props.data.variantID);

watch(open, async () => {
  if (open.value) {
    clear();
    await mountData();
  }
});
</script>
<template>
  <q-dialog v-model="open" :maximized="$q.screen.lt.sm">
    <q-card
      class="bg-grey-2 form-basic column justify-between"
      style="width: 800px; max-width: 98vw"
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Atualização de variante" icon="settings" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading :show="isLoading" />
        <q-form class="q-gutter-y-sm column full-width" v-show="!isLoading">
          <div class="row justify-between items-center">
            <q-input
              v-model="dataVariant.cost"
              bg-color="white"
              label-color="black"
              outlined
              label="R$ Valor de custo"
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
              v-model="dataVariant.price"
              bg-color="white"
              label-color="black"
              outlined
              label="R$ Valor de venda"
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
          <div class="row justify-between items-center">
            <q-input
              v-model="dataVariant.stockQuantity"
              bg-color="white"
              label-color="black"
              outlined
              label="Estoque atual"
              dense
              input-class="text-black no-spinners"
              mask="###############"
              class="input-divider"
              disable
            >
              <template v-slot:prepend>
                <q-icon name="pin" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataVariant.minStockAlert"
              bg-color="white"
              label-color="black"
              outlined
              label="Alerta minímo"
              dense
              input-class="text-black no-spinners"
              mask="###############"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="pin" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <div class="row justify-between items-center">
            <q-input
              v-model="dataVariant.offer"
              bg-color="white"
              label-color="black"
              outlined
              label="R$ Valor de oferta"
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
              v-model="dataVariant.location"
              bg-color="white"
              label-color="black"
              outlined
              label="Localização"
              dense
              input-class="text-black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="location_on" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="dataVariant.sku"
            @update:model-value="
              (val: string | number | null) => (dataVariant.sku = String(val).toUpperCase())
            "
            bg-color="white"
            label-color="black"
            outlined
            label="SKU"
            dense
            input-class="text-black no-resize"
          >
            <template v-slot:prepend>
              <q-icon name="dialpad" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataVariant.code"
            @update:model-value="
              (val: string | number | null) => (dataVariant.code = String(val).toUpperCase())
            "
            bg-color="white"
            label-color="black"
            outlined
            label="Código"
            dense
            disable
            input-class="text-black no-resize"
          >
            <template v-slot:prepend>
              <q-icon name="grid_4x4" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="selectedColor"
            outlined
            bg-color="white"
            label-color="black"
            :options="[]"
            option-label="name"
            option-value="id"
            :label="getlabelColor"
            disable
            dense
            options-selected-class="bg-green-1 text-black"
          >
          </q-select>
          <q-input
            v-model="dataVariant.description"
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
      <q-card-actions align="right">
        <div class="row justify-between items-center full-width">
          <div>
            <q-btn
              @click="goFormProduct"
              color="secondary"
              label="Ir ao produto"
              size="md"
              :loading="isLoading"
              unelevated
              no-caps
            />
          </div>
          <div>
            <q-btn
              @click="open = false"
              flat
              color="red"
              label="Fechar"
              size="md"
              unelevated
              no-caps
            />
            <q-btn
              @click="update"
              color="primary"
              label="Atualizar"
              size="md"
              :loading="isLoading"
              unelevated
              no-caps
            />
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
