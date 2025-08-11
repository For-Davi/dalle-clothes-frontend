<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { checkDataProduct } from 'src/composables/CheckData';
import { useTagStore } from 'src/stores/tag-store';
import { useGridStore } from 'src/stores/grid-store';
import { useColorStore } from 'src/stores/color-store';
import { useProductStore } from 'src/stores/product-store';
import { useCategoryProductStore } from 'src/stores/category-product-store';
import ProductBasic from '../fragments/product/ProductBasic.vue';
import ProductVariant from '../fragments/product/ProductVariant.vue';
import ProductMedia from '../fragments/product/ProductMedia.vue';
import ProductTag from '../fragments/product/ProductTag.vue';
import ProductLog from '../fragments/product/ProductLog.vue';
import ProductAdvanced from '../fragments/product/ProductAdvanced.vue';
import Loading from '../shared/Loading.vue';
import ProductVariantEdit from '../fragments/product/ProductVariantEdit.vue';
import { storeToRefs } from 'pinia';

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
  'show:showFormVariant': [number];
}>();

const { loadingProduct } = storeToRefs(useProductStore());

const loading = ref<boolean>(false);
const tab = ref<IProductModalTabs>('basic');
const dataVariant = ref<IVModelProductVariant[]>([]);
const dataVariantEdit = ref<IVariant[]>([]);
const dataMedia = ref<IMediaItem[]>([]);
const dataTags = ref<ITag[]>([]);
const dataLog = ref<ILog[]>([]);
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
    description: '',
    type: { label: 'Produto', value: 'product' },
    category: { label: 'Nenhuma selecionada', value: null },
  });
  Object.assign(dataAdvanced, {
    active: 1,
    allowCoupon: 1,
    allowDiscount: 1,
    hasCommission: 1,
    commissionPercentage: '5',
    discountMaxPercentage: '10',
  });
  dataTags.value = [];
  dataVariant.value = [];
  dataVariantEdit.value = [];
  dataLog.value = [];
  dataMedia.value = [];
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
const fetchCategories = async () => {
  await useCategoryProductStore().getCategoriesProduct();
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

  const variants =
    dataVariant.value?.map((item: IVModelProductVariant) => {
      return {
        price: parseFloat(item.price),
        cost: parseFloat(item.cost),
        stockQuantity: Number(item.stockQuantity),
        minStockAlert: Number(item.minStockAlert),
        offer: parseFloat(item.cost),
        sku: item.sku.trim().length === 0 ? null : item.sku,
        active: Number(item.active),
        description: item.description.trim().length === 0 ? null : item.description,
        gridItemID: item.gridItem.id,
        location: item.location.trim().length === 0 ? null : item.location,
        colors: item.colors.map((color: IColor) => {
          return {
            id: color.id,
          };
        }),
      };
    }) || [];

  const tags =
    dataTags.value?.map((item) => {
      return {
        id: item.id,
      };
    }) || [];

  const images = dataMedia.value;

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
const mountData = async () => {
  if (props.data.productID) {
    const response = await useProductStore().showProduct(props.data.productID);
    if (response?.status === 200) {
      const product = response.data.product;

      // Dados básicos do produto
      Object.assign(dataBasic, {
        name: product.name,
        description: product.description ?? '',
        type: {
          label: product.type === 'product' ? 'Produto' : 'Serviço',
          value: product.type,
        },
        category: {
          label: product.category?.name ?? 'Nenhuma selecionada',
          value: product.category?.id ?? null,
        },
      });

      // Tags do produto
      dataTags.value = product.tags;

      // Imagens do produto
      dataMedia.value = product.images;

      // Variantes do produto
      dataVariantEdit.value = product.variants;
      selectedGrid.value =
        product.variants.length > 0
          ? {
              label: product.variants[0].grid_item?.grid_group.name ?? '',
              value: product.variants[0].grid_item?.grid_group_id ?? 0,
            }
          : {
              label: 'Nenhuma grade selecionada',
              value: null,
            };

      // Logs do produto
      dataLog.value = product.logs;

      // Configurações avançadas do produto
      Object.assign(dataAdvanced, {
        active: product.advanced.active,
        allowCoupon: product.advanced.allow_coupon,
        allowDiscount: product.advanced.allow_discount,
        hasCommission: product.advanced.has_commission,
        commissionPercentage: String(product.advanced.commission_percentage),
        discountMaxPercentage: String(product.advanced.discount_max_percentage),
      });
    }
  }
};
const makeShowFormVariant = (id: number): void => {
  emit('show:showFormVariant', id);
};
const updateBasic = async () => {
  const check = checkDataProduct(dataBasic);
  if (check.status) {
    const response = await useProductStore().updateProductBasic({
      id: productID.value ?? 0,
      name: dataBasic.name,
      description: dataBasic.description.trim().length === 0 ? null : dataBasic.description,
      type: dataBasic.type.value,
      category: dataBasic.category.value ?? null,
    });
    if (response?.status === 200) {
      Object.assign(dataBasic, {
        name: response.data.basic.name,
        description: response.data.basic.description ?? '',
        type: {
          label: response.data.basic.type === 'product' ? 'Produto' : 'Serviço',
          value: response.data.basic.type,
        },
        category: {
          label: response.data.basic.category?.name ?? 'Nenhuma selecionada',
          value: response.data.basic.category?.id ?? null,
        },
      });
    }
  } else {
    createErrorData(check.message || 'Erro ao atualizar dados do produto');
  }
};
const updateTag = async () => {
  const response = await useProductStore().updateProductTag(
    productID.value ?? 0,
    dataTags.value?.map((item) => {
      return {
        id: item.id,
      };
    }) || [],
  );
  if (response?.status === 200) {
    dataTags.value = response.data.tags;
  }
};
const updateAdvanced = async () => {
  const response = await useProductStore().updateProductAdvanced({
    id: productID.value ?? 0,
    active: Number(dataAdvanced.active),
    allowCoupon: Number(dataAdvanced.allowCoupon),
    allowDiscount: Number(dataAdvanced.allowDiscount),
    hasCommission: Number(dataAdvanced.hasCommission),
    commissionPercentage: Number(dataAdvanced.commissionPercentage),
    discountMaxPercentage: Number(dataAdvanced.discountMaxPercentage),
  });
  if (response?.status === 200) {
    Object.assign(dataAdvanced, {
      active: response.data.advanced.active,
      allowCoupon: response.data.advanced.allow_coupon,
      allowDiscount: response.data.advanced.allow_discount,
      hasCommission: response.data.advanced.has_commission,
      commissionPercentage: String(response.data.advanced.commission_percentage),
      discountMaxPercentage: String(response.data.advanced.discount_max_percentage),
    });
  }
};
const update = async (): Promise<void> => {
  if (tab.value === 'basic') {
    await updateBasic();
  } else if (tab.value === 'advanced') {
    await updateAdvanced();
  } else if (tab.value === 'tag') {
    await updateTag();
  }
};

const getLabelBtn = computed((): string => {
  switch (tab.value) {
    case 'advanced':
      return 'Atualizar dados avançados';
    case 'basic':
      return 'Atualizar dados básicos';
    case 'media':
      return 'Atualizar galeria';
    case 'tag':
      return 'Atualizar tags';
    default:
      return '';
  }
});
const productID = computed(() => props.data.productID);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
const showBtnUpdate = computed((): boolean => {
  return !!productID.value && tab.value !== 'variant' && tab.value !== 'log';
});
const isLoading = computed((): boolean => {
  return loading.value || loadingProduct.value;
});

watch(open, async () => {
  if (open.value) {
    clear();
    changeLoading(true);
    await fetchGrids();
    await fetchTags();
    await fetchColors();
    await fetchCategories();
    await mountData();
    changeLoading(false);
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="bg-grey-2 column justify-between"
      style="width: 900px; max-width: 98vw"
      :style="isLoading ? 'min-height: 350px' : ''"
    >
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="productID ? 'Atualização de produto' : 'Cadastro de produto'"
          icon="list_alt"
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-tabs v-model="tab" inline-label class="bg-grey-3 text-primary" align="left">
          <q-tab name="basic" icon="fa-solid fa-box" label="Básico" no-caps :disable="isLoading" />
          <q-tab name="variant" icon="list_alt" label="Variantes" no-caps :disable="isLoading" />
          <q-tab name="media" icon="perm_media" label="Galeria" no-caps :disable="isLoading" />
          <q-tab name="tag" icon="tag" label="Tags" no-caps :disable="isLoading" />
          <q-tab name="advanced" icon="settings" label="Avançado" no-caps :disable="isLoading" />
          <q-tab
            name="log"
            icon="history"
            label="Logs"
            no-caps
            :disable="!productID || isLoading"
          />
        </q-tabs>
        <q-tab-panels v-model="tab" animated class="bg-grey-2">
          <q-tab-panel name="basic" class="q-px-none">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <Loading :show="isLoading" />
              <ProductBasic v-model="dataBasic" :loading="isLoading" />
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="variant" class="q-px-none">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <Loading :show="isLoading" />
              <ProductVariant
                v-if="!props.data.productID"
                v-model:listVariants="dataVariant"
                v-model:gridModel="selectedGrid"
                :loading="isLoading"
                :gridGroupId="selectedGrid.value"
              />
              <ProductVariantEdit
                v-else
                v-model:listVariants="dataVariantEdit"
                v-model:gridModel="selectedGrid"
                :loading="isLoading"
                @show:show-form-variant="makeShowFormVariant"
              />
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="media" class="q-px-none">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <Loading :show="isLoading" />
              <ProductMedia v-model:listMedia="dataMedia" :loading="isLoading" />
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="tag" class="q-px-none">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <Loading :show="isLoading" />
              <ProductTag v-model:listTag="dataTags" :loading="isLoading" />
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="advanced" class="q-px-none">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <Loading :show="isLoading" />
              <ProductAdvanced v-model:dataAdvanced="dataAdvanced" :loading="isLoading" />
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="log" class="q-px-none">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <Loading :show="isLoading" />
              <ProductLog :loading="isLoading" :list-logs="dataLog" />
            </q-scroll-area>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-between items-center full-width q-gutter-x-sm">
          <div>
            <q-btn
              v-if="productID"
              color="red"
              label="Excluir produto"
              size="md"
              :disable="isLoading"
              unelevated
              no-caps
            />
          </div>
          <div>
            <q-btn
              color="red"
              label="Fechar"
              size="md"
              flat
              @click="open = false"
              unelevated
              no-caps
            />
            <q-btn
              @click="update"
              v-show="showBtnUpdate"
              color="primary"
              :label="getLabelBtn"
              size="md"
              :disable="loading"
              :loading="loadingProduct"
              unelevated
              no-caps
            />
            <q-btn
              v-show="!productID"
              @click="save"
              color="primary"
              label="Salvar"
              size="md"
              :disable="loading"
              :loading="loadingProduct"
              unelevated
              no-caps
            />
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
