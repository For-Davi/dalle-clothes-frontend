<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref, watch } from 'vue';
import { useColorStore } from 'src/stores/color-store';
import { storeToRefs } from 'pinia';
import { useProductStore } from 'src/stores/product-store';

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
}>();

const { listColor, loadingColor } = storeToRefs(useColorStore());
const { loadingProduct } = storeToRefs(useProductStore());

const dataVariant = reactive({
  price: '',
  cost: '',
  stockQuantity: '',
  minStockAlert: '',
  sku: '',
  active: 1,
  description: '',
  location: '',
});
const selectedColor = ref<IQuasarSelect<number | null>>({
  label: 'Nenhuma cor',
  value: null,
});

const getColorStyle = (hexColor: string) => {
  return {
    backgroundColor: hexColor || 'transparent',
    width: '24px',
    height: '24px',
    border: '1px solid #ddd',
    borderRadius: '50%',
    display: 'inline-block',
    verticalAlign: 'middle',
  };
};
const fetchColors = async () => {
  await useColorStore().getColors();
};
const mountData = async () => {
  const response = await useProductStore().getProductVariant(props.data.variantID!);
  if (response?.status === 200) {
    const variant = response.data.variant;

    Object.assign(dataVariant, {
      sku: variant.sku ?? '',
      active: variant.active,
      price: variant.price,
      cost: variant.cost,
      stockQuantity: variant.stock_quantity,
      minStockAlert: variant.min_stock_quantity,
      description: variant.description ?? '',
      location: variant.location ?? '',
    });

    if (variant.color_id) {
      const selectedItem = listColor.value.find((item) => item.id === variant.color_id);
      selectedColor.value = {
        label: selectedItem?.name ?? 'Nenhuma cor',
        value: selectedItem?.id ?? null,
      };
    }
  }
};

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
const isLoading = computed(() => {
  return loadingProduct.value || loadingColor.value;
});

watch(open, async () => {
  if (open.value) {
    await fetchColors();
    await mountData();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2" style="width: 800px; max-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Configuração de variantes" icon="arrow_split" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm column full-width">
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
              label="Estoque inicial"
              dense
              input-class="text-black no-spinners"
              mask="###############"
              class="input-divider"
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
            @update:model-value="(val) => (dataVariant.sku = String(val).toUpperCase())"
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
          <q-select
            v-model="selectedColor"
            outlined
            bg-color="white"
            label-color="black"
            multiple
            :options="listColor"
            option-label="name"
            option-value="id"
            label="Cores"
            dense
            options-selected-class="bg-green-1 text-black"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-icon :name="scope.opt.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="row items-center q-gutter-x-sm">
                    <div
                      class="cursor-pointer"
                      :style="getColorStyle(scope.opt.hex_color_code)"
                    ></div>
                    <div>{{ scope.opt.name }}</div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
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
