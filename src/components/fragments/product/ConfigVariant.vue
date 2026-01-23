<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, ref, watch } from 'vue';
import { useColorStore } from 'src/stores/color-store';
import { storeToRefs } from 'pinia';
import { useProductStore } from 'src/stores/product-store';
import { Notify } from 'quasar';

defineOptions({
  name: 'ConfigVariant',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const listVariants = defineModel<IVModelProductVariant[]>('listVariants', { required: true });

const { listColor } = storeToRefs(useColorStore());

const loadingValidCode = ref<boolean>(false);

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
const onUpdateColors = (selectedIds: number[], item: IVModelProductVariant) => {
  item.colors = selectedIds.map((id) => {
    const existing = item.colors.find((c: IProductColor) => c.id === id);
    const color = listColor.value.find((c) => c.id === id);

    return (
      existing ?? {
        id,
        name: color?.name ?? '',
        hexColorCode: color?.hex_color_code ?? '#000000',
        stock: 0,
        min_alert: 0,
        code: '',
        sku: '',
      }
    );
  });
};
const checkCodesAndSkus = async () => {
  loadingValidCode.value = true;

  const codes: string[] = [];
  const skus: string[] = [];

  listVariants.value.forEach((variant) => {
    if (variant.colors && variant.colors.length > 0) {
      variant.colors.forEach((color) => {
        if (color.code && color.code.trim() !== '') {
          codes.push(color.code.trim());
        }

        if (color.sku && color.sku.trim() !== '') {
          skus.push(color.sku.trim());
        }
      });
    } else {
      if (variant.code && variant.code.trim() !== '') {
        codes.push(variant.code.trim());
      }

      if (variant.sku && variant.sku.trim() !== '') {
        skus.push(variant.sku.trim());
      }
    }
  });

  const uniqueCodes = new Set(codes);
  if (uniqueCodes.size !== codes.length) {
    Notify.create({
      type: 'negative',
      message:
        'Existem códigos duplicados. Remova ou altere os códigos repetidos antes de validar.',
    });

    loadingValidCode.value = false;
    return;
  }

  const uniqueSkus = new Set(skus);
  if (uniqueSkus.size !== skus.length) {
    Notify.create({
      type: 'negative',
      message: 'Existem SKUs duplicados. Remova ou altere os SKUs repetidos antes de validar.',
    });

    loadingValidCode.value = false;
    return;
  }

  const response = await useProductStore().checkCodesAndSkus({
    codes: codes,
    skus: skus,
  });

  if (response?.status === 200) {
    if (response.data.available) {
      Notify.create({
        type: 'positive',
        message: response.data.message,
      });
    } else {
      const usedCodes = response.data.used_codes ?? [];
      const usedSkus = response.data.used_skus ?? [];

      let message = '';

      if (usedCodes.length > 0) {
        message += `Códigos em uso: ${usedCodes.join(', ')}`;
      }

      if (usedSkus.length > 0) {
        if (message !== '') message += ' | ';
        message += `SKUs em uso: ${usedSkus.join(', ')}`;
      }

      Notify.create({
        type: 'negative',
        message: message || response.data.message,
        timeout: 7000,
        multiLine: true,
      });
    }
  } else {
    Notify.create({
      type: 'negative',
      message: 'Erro ao validar os códigos e SKUs',
    });
  }

  loadingValidCode.value = false;
};

const hasItemColor = computed(() => {
  return listVariants.value.some((variant) => variant.colors && variant.colors.length > 0);
});
const showCheckCode = computed(() => {
  return listVariants.value.some((variant) => {
    const hasVariantCode = typeof variant.code === 'string' && variant.code.trim() !== '';

    const hasColorCode =
      Array.isArray(variant.colors) &&
      variant.colors.some((color) => typeof color.code === 'string' && color.code.trim() !== '');

    return hasVariantCode || hasColorCode;
  });
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(
  () => hasItemColor.value,
  (hasItemColor) => {
    if (hasItemColor) {
      listVariants.value.forEach((item) => {
        if (item.colors && item.colors.length > 0) {
          item.stockQuantity = '0';
          item.minStockAlert = '0';
          item.code = '';
          item.sku = '';
        }
      });
    }
  },
  { immediate: true },
);
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2" style="width: 800px; max-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Configuração de variantes" icon="arrow_split" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-scroll-area style="height: 500px" class="full-width row justify-center items-center">
          <q-list bordered separator>
            showCheckCode {{ showCheckCode }}
            <q-item v-for="(item, index) in listVariants" :key="index">
              <q-form class="q-gutter-y-sm column full-width">
                <q-banner dense class="text-white bg-grey-9 q-px-md" rounded>
                  <div class="row justify-between items-center">
                    <span
                      >Tamanho: <span class="text-bold">{{ item.gridItem.size }}</span></span
                    >
                    <q-toggle
                      v-model="item.active"
                      checked-icon="check"
                      color="green"
                      :label="item.active ? 'Variante ativa' : 'Variante inativa'"
                      unchecked-icon="clear"
                      :true-value="1"
                      :false-value="0"
                    />
                  </div>
                </q-banner>
                <div class="row justify-between items-center">
                  <q-input
                    v-model="item.cost"
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
                    v-model="item.price"
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
                    v-model="item.stockQuantity"
                    :disable="item.colors && item.colors.length > 0"
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
                    v-model="item.minStockAlert"
                    :disable="item.colors && item.colors.length > 0"
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
                    v-model="item.offer"
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
                    v-model="item.location"
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
                  v-model="item.sku"
                  @update:model-value="
                    (val: string | number | null) => (item.sku = String(val).toUpperCase())
                  "
                  :disable="item.colors && item.colors.length > 0"
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
                  v-model="item.code"
                  @update:model-value="
                    (val: string | number | null) => (item.code = String(val).toUpperCase())
                  "
                  :disable="item.colors && item.colors.length > 0"
                  bg-color="white"
                  label-color="black"
                  outlined
                  label="Código"
                  dense
                  input-class="text-black no-resize"
                >
                  <template v-slot:prepend>
                    <q-icon size="20px" color="black" name="grid_4x4" />
                  </template>
                </q-input>
                <q-select
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
                  emit-value
                  map-options
                  :model-value="item.colors.map((c: IProductColor) => c.id)"
                  @update:model-value="(val) => onUpdateColors(val, item)"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar> <q-icon :name="scope.opt.icon" /> </q-item-section>
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
                <div v-if="item.colors.length" class="q-mt-md column q-gutter-sm">
                  <q-card
                    v-for="color in item.colors"
                    :key="color.id"
                    flat
                    bordered
                    class="q-pa-sm"
                  >
                    <!-- Cabeçalho da cor -->
                    <div class="row items-center q-gutter-sm q-mb-sm">
                      <div
                        class="rounded-borders"
                        style="width: 20px; height: 20px"
                        :style="{ backgroundColor: color.hexColorCode }"
                      />

                      <div class="text-subtitle2 text-weight-medium">
                        {{ color.name }}
                      </div>

                      <q-space />

                      <!-- Status de estoque -->
                      <q-badge v-if="color.stock <= color.min_alert" color="red" outline>
                        Estoque baixo
                      </q-badge>

                      <q-badge v-else color="green" outline> OK </q-badge>
                    </div>

                    <!-- Campos -->
                    <div class="row q-col-gutter-sm">
                      <!-- Estoque -->
                      <div class="col-12 col-sm-3">
                        <q-input
                          v-model.number="color.stock"
                          type="number"
                          dense
                          outlined
                          label="Estoque"
                          input-class="text-black no-spinners"
                        />
                      </div>

                      <!-- Alerta mínimo -->
                      <div class="col-12 col-sm-3">
                        <q-input
                          v-model.number="color.min_alert"
                          type="number"
                          dense
                          outlined
                          label="Alerta mínimo"
                          input-class="text-black no-spinners"
                        />
                      </div>

                      <!-- Código -->
                      <div class="col-12 col-sm-3">
                        <q-input
                          v-model="color.code"
                          @update:model-value="
                            (val: string | number | null) =>
                              (color.code = String(val).toUpperCase())
                          "
                          outlined
                          dense
                          label="Código"
                          input-class="text-black"
                        >
                          <template #prepend>
                            <q-icon name="grid_4x4" size="18px" />
                          </template>
                        </q-input>
                      </div>

                      <!-- SKU -->
                      <div class="col-12 col-sm-3">
                        <q-input
                          v-model="color.sku"
                          @update:model-value="
                            (val: string | number | null) => (color.sku = String(val).toUpperCase())
                          "
                          outlined
                          dense
                          label="SKU"
                          input-class="text-black"
                        >
                          <template #prepend>
                            <q-icon name="dialpad" size="18px" />
                          </template>
                        </q-input>
                      </div>
                    </div>
                  </q-card>
                </div>

                <q-input
                  v-model="item.description"
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
                <!-- <div class="row justify-between">
              <q-select
                v-model="model.type"
                :options="optionsType"
                label="Selecione o tipo"
                outlined
                dense
                options-dense
                bg-color="white"
                label-color="black"
                class="input-divider"
              >
                <template v-slot:prepend>
                  <q-icon name="info" color="black" size="20px" />
                </template>
              </q-select>
              <q-select
                v-model="model.category"
                :options="optionsCategory"
                label="Selecione a categoria"
                outlined
                dense
                options-dense
                bg-color="white"
                label-color="black"
                class="input-divider"
              >
                <template v-slot:prepend>
                  <q-icon name="info" color="black" size="20px" />
                </template>
              </q-select>
            </div> -->
              </q-form>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            @click="open = false"
            color="red"
            label="Fechar"
            flat
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-if="showCheckCode"
            @click="checkCodesAndSkus()"
            :loading="loadingValidCode"
            color="primary"
            label="Validar códigos"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
