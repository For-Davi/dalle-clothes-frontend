<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { checkDataProduct } from 'src/composables/CheckData';
import { useTagStore } from 'src/stores/tag-store';
import { useGridStore } from 'src/stores/grid-store';
import { useColorStore } from 'src/stores/color-store';
import { useProductStore } from 'src/stores/product-store';
import ProductBasic from '../fragments/product/ProductBasic.vue';
import ProductVariant from '../fragments/product/ProductVariant.vue';
import ProductMedia from '../fragments/product/ProductMedia.vue';
import ProductTag from '../fragments/product/ProductTag.vue';
import ProductLog from '../fragments/product/ProductLog.vue';
import ProductAdvanced from '../fragments/product/ProductAdvanced.vue';
import Loading from '../shared/Loading.vue';

defineOptions({
  name: 'FormProduct',
});

const props = defineProps<{
  data: {
    open: boolean;
    productID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const loading = ref<boolean>(false);
const tab = ref<IProductModalTabs>('basic');
const dataVariant = ref<IVModelProductVariant[]>([]);
const dataMedia = ref<File[]>([]);
const dataTags = ref<ITag[]>([]);
const dataLog = ref<[]>([]);
const dataBasic = reactive<IVModelProductBasic>({
  name: '',
  description: '',
  type: { label: 'Produto', value: 'product' },
  category: { label: 'Nenhuma selecionada', value: null },
});
const dataAdvanced = reactive<IVModelProductAdvanced>({
  active: 1,
  allowCoupon: 1,
  allowDiscount: 1,
  hasCommission: 1,
  commissionPercentage: '5',
  discountMaxPercentage: '10',
});
const selectedGrid = ref<IQuasarSelect<number | null>>({
  label: 'Nenhuma grade selecionada',
  value: null,
});

const clear = (): void => {
  tab.value = 'basic';
  Object.assign(dataBasic, {
    name: '',
    type: { label: 'Produto', value: 'product' },
    category: { label: 'Nenhuma selecionada', value: null },
  });
  dataVariant.value = [];
  selectedGrid.value = {
    label: 'Nenhuma grade selecionada',
    value: null,
  };
};
const fetchGrids = async () => {
  await useGridStore().getGrids();
};
const fetchTags = async () => {
  await useTagStore().getTags();
};
const fetchColors = async () => {
  await useColorStore().getColors();
};
const changeLoading = (value: boolean): void => {
  loading.value = value;
};
const mountCreateDataProduct = (): IDataCreateProduct => {
  const basic = {
    name: dataBasic.name,
    description: dataBasic.description.trim().length === 0 ? null : dataBasic.description,
    type: dataBasic.type.value,
    categoryID: dataBasic.category.value,
  };

  const variants = dataVariant.value.map((item: IVModelProductVariant) => {
    return {
      price: parseFloat(item.price),
      cost: parseFloat(item.cost),
      stockQuantity: parseFloat(item.stockQuantity),
      minStockQuantity: parseFloat(item.stockQuantity),
      sku: item.sku.trim().length === 0 ? null : item.sku,
      active: Number(item.active),
      description: item.description.trim().length === 0 ? null : item.description,
      gridItemID: item.gridItem.id,
      location: item.location,
      colors: item.colors.map((color: IColor) => {
        return {
          id: color.id,
        };
      }),
    };
  });

  const images = dataMedia.value;

  const tags = dataTags.value.map((item) => {
    return {
      id: item.id,
    };
  });

  const advanced = {
    active: Number(dataAdvanced.active),
    allowCoupon: Number(dataAdvanced.allowCoupon),
    allowDiscount: Number(dataAdvanced.allowDiscount),
    hasCommission: Number(dataAdvanced.hasCommission),
    commissionPercentage: Number(dataAdvanced.commissionPercentage),
    discountMaxPercentage: Number(dataAdvanced.discountMaxPercentage),
  };

  return {
    basic,
    variants,
    images,
    tags,
    advanced,
  };
};
const save = async () => {
  const check = checkDataProduct(dataBasic);
  if (check.status) {
    const response = await useProductStore().createProduct(mountCreateDataProduct());
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados do produto');
  }
};
// const update = async () => {
//   const check = checkDataTag(dataTag);
//   if (check.status) {
//     const response = await useTagStore().updateTag(
//       tagID.value ?? 0,
//       dataTag.name,
//       dataTag.active === true ? 1 : 0,
//     );
//     if (response?.status === 200) {
//       clear();
//       emit('update:open');
//     }
//   } else {
//     createErrorData(check.message || 'Erro ao processar dados da tag');
//   }
// };
// const checkDataEdit = () => {
//   if (props.data.tag) {
//     Object.assign(dataTag, {
//       name: props.data.tag.name,
//       active: props.data.tag.active === 1 ? true : false,
//     });
//   }
// };
// const transformUppercaseName = (): void => {
//   if (dataTag.name.trim().length > 0) {
//     dataTag.name = dataTag.name.toUpperCase();
//   }
// };

const productID = computed(() => props.data.productID);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  if (open.value) {
    clear();
    changeLoading(true);
    await fetchGrids();
    await fetchTags();
    await fetchColors();
    changeLoading(false);
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="bg-grey-2 column justify-between"
      style="width: 900px; max-width: 98vw"
      :style="loading ? 'min-height: 350px' : ''"
    >
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="productID ? 'Atualização de produto' : 'Cadastro de produto'"
          icon="list_alt"
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-tabs v-model="tab" inline-label class="bg-grey-3 text-primary" align="left">
          <q-tab name="basic" icon="fa-solid fa-box" label="Básico" no-caps />
          <q-tab name="variant" icon="list_alt" label="Variantes" no-caps />
          <q-tab name="media" icon="perm_media" label="Galeria" no-caps />
          <q-tab name="tag" icon="tag" label="Tags" no-caps />
          <q-tab name="advanced" icon="settings" label="Avançado" no-caps />
          <q-tab name="log" icon="history" label="Logs" no-caps :disable="!productID" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated class="bg-grey-2">
          <q-tab-panel name="basic" class="q-px-none">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <Loading :show="loading" />
              <ProductBasic v-model="dataBasic" :loading="loading" />
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="variant" class="q-px-none">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <Loading :show="loading" />
              <ProductVariant
                v-model:listVariants="dataVariant"
                v-model:gridModel="selectedGrid"
                :loading="loading"
                :gridGroupId="selectedGrid.value"
              />
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="media" class="q-px-none">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <Loading :show="loading" />
              <ProductMedia v-model:listMedia="dataMedia" :loading="loading" />
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="tag" class="q-px-none">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <Loading :show="loading" />
              <ProductTag v-model:listTag="dataTags" :loading="loading" />
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="advanced" class="q-px-none">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <Loading :show="loading" />
              <ProductAdvanced v-model:dataAdvanced="dataAdvanced" :loading="loading" />
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="log" class="q-px-none">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <Loading :show="loading" />
              <ProductLog :loading="loading" :list-logs="dataLog" />
            </q-scroll-area>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            unelevated
            no-caps
          />
          <!-- @click="save" -->
          <q-btn
            v-if="productID"
            color="primary"
            label="Atualizar"
            size="md"
            :disable="loading"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :disable="loading"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
