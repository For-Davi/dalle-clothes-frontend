<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { createErrorData } from 'src/composables/CreateNotify';
import { useCatalogSupplierStore } from 'src/stores/catalog-supplier-store';

defineOptions({
  name: 'FormCategoryTransaction',
});

const props = defineProps<{
 data: {
  open: boolean,
  catalog: IDataSupplierCatalog 
 }
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingLinkedProducts } = storeToRefs(useCatalogSupplierStore());


const dataCatalog = reactive({
  price: '0.00' as string,
  description: '' as string
});

const clear = (): void => {
  Object.assign(dataCatalog, {
    price: '0.00',
    description: ''
  });
};
const save = async () => {
    const response = await useCatalogSupplierStore().createLinkedProductSupplier(
      supplierID.value,
      variantID.value,
      dataCatalog.price,   
      dataCatalog.description || ''
    );
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  }
const update = async () => {
  if (variantID.value && supplierID.value) {
  
    
    const response = await useCatalogSupplierStore().updateLinkedProductSupplier(
      supplierID.value,
      variantID.value,
      dataCatalog.price,
      dataCatalog.description || ''
    );

    if (response?.status === 200) {
      clear();
      emit('update:open');
    } else {
      createErrorData(response?.data?.message || 'Erro ao atualizar catálogo');
    }
  }
};
const checkDataEdit = () => {
  if (props.data.catalog) {
    dataCatalog.price = props.data.catalog.price;
    dataCatalog.description = props.data?.catalog?.description || '';
  }
};

const variantID = computed(() => props.data.catalog?.variant_id);
const supplierID = computed(() => props.data.catalog?.supplier_id);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    if (!variantID.value && !supplierID.value) { 
      clear();
    }
    checkDataEdit(); 
  }
});

</script>
<template>
  <q-dialog v-model="open">
    <q-card
      class="bg-grey-2 column justify-between"
      style="width: 350px"
      :style="loadingLinkedProducts ? 'min-height: 350px' : ''"
    >
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="variantID && supplierID ? 'Atualização de catálogo' : 'Cadastro de catálogo'"
          icon="list_alt"
        />
      </q-card-section>
      <Loading :show="loadingLinkedProducts" />
      <q-card-section class="q-pa-sm" v-show="!loadingLinkedProducts">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataCatalog.price"
            bg-color="white"
            label-color="black"
            outlined
            label="(R$)Preço do produto"
            mask="#.##"
            fill-mask="0"
            reverse-fill-mask
            dense
            input-class="text-black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" color="black" size="20px" />
            </template>
          </q-input>
           <q-input
           type="textarea"
            v-model="dataCatalog.description"
            bg-color="white"
            label-color="black"
            outlined
            label="Descrição do produto"
            dense
            input-class="text-black no-resize"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="category" color="black" size="20px" />
            </template>
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" v-show="!loadingLinkedProducts">
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
          <q-btn
            v-if="!variantID && !supplierID"
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingLinkedProducts"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingLinkedProducts"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
