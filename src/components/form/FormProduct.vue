<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
// import { createErrorData } from 'src/composables/CreateNotify';
// import { checkDataTag } from 'src/composables/CheckData';
import { useTagStore } from 'src/stores/tag-store';
import { useGridStore } from 'src/stores/grid-store';
import { useColorStore } from 'src/stores/color-store';
import ProductBasic from '../fragments/product/ProductBasic.vue';
import ProductVariant from '../fragments/product/ProductVariant.vue';
import ProductMedia from '../fragments/product/ProductMedia.vue';
import ProductTag from '../fragments/product/ProductTag.vue';

defineOptions({
  name: 'FormProduct',
});

const props = defineProps<{
  data: {
    open: boolean;
    product: ITag | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingTag } = storeToRefs(useTagStore());

const tab = ref<IProductModalTabs>('basic');
const dataVariant = ref<IVModelProductVariant[]>([]);
const dataMedia = ref<File[]>([]);
const dataTags = ref<ITag[]>([]);
const dataBasic = reactive<IVModelProductBasic>({
  name: '',
  type: { label: 'Produto', value: 'product' },
  category: { label: 'Nenhuma selecionada', value: null },
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
// const save = async () => {
//   const check = checkDataTag(dataTag);
//   if (check.status) {
//     const response = await useTagStore().createTag(dataTag.name);
//     if (response?.status === 201) {
//       clear();
//       emit('update:open');
//     }
//   } else {
//     createErrorData(check.message || 'Erro ao processar dados da tag');
//   }
// };
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

const tagID = computed(() => props.data.product?.id);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchGrids();
    await fetchTags();
    await fetchColors();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="bg-grey-2 column justify-between"
      style="width: 900px; max-width: 98vw"
      :style="loadingTag ? 'min-height: 350px' : ''"
    >
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="tagID ? 'Atualização de produto' : 'Cadastro de produto'"
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
          <q-tab name="log" icon="history" label="Logs" no-caps />
        </q-tabs>
        <q-tab-panels v-model="tab" animated class="bg-grey-2">
          <q-tab-panel name="basic" class="q-px-none">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <ProductBasic v-model="dataBasic" :loading="false" />
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="variant">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <ProductVariant
                v-model:listVariants="dataVariant"
                v-model:gridModel="selectedGrid"
                :loading="false"
                :gridGroupId="selectedGrid.value"
              />
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="media">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <ProductMedia v-model:listMedia="dataMedia" :loading="false" />
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="tag">
            <q-scroll-area style="height: 400px" class="full-width row justify-center items-center">
              <ProductTag v-model:listTag="dataTags" :loading="false" />
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="advanced">
            <div class="text-h6">Avançado</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
          <q-tab-panel name="log">
            <div class="text-h6">Log</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions align="right" v-show="!loadingTag">
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
            v-if="tagID"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingTag"
            unelevated
            no-caps
          />
          <!-- @click="update" -->
          <q-btn
            v-else
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingTag"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
