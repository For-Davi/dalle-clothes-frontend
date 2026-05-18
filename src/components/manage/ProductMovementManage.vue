<script setup lang="ts">
import { useProductStore } from 'src/stores/product-store';
import { storeToRefs } from 'pinia';
import TableProductMovement from '../table/TableProductMovement.vue';
import TitlePage from '../shared/TitlePage.vue';
import { computed, reactive } from 'vue';
import Loading from '../shared/Loading.vue';
import Empty from '../info/Empty.vue';
import ProductMovementDetails from '../details/ProductMovementDetails.vue';

defineOptions({
  name: 'ProductMovementManage',
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

const { loadingProductMovement, listProductMovement } = storeToRefs(useProductStore());

const showProductMovementDetails = reactive({
  open: false as boolean,
  productMovementID: null as number | null,
});

const changeShowProductMovementDetails = (
  open: boolean,
  productMovementID: number | null = null,
) => {
  Object.assign(showProductMovementDetails, {
    open: open,
    productMovementID: productMovementID,
  });
};
const startOpenChangeShowProductDetails = (id: number) => {
  changeShowProductMovementDetails(true, id);
  console.log('show', showProductMovementDetails);
};

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
</script>

<template>
  <q-dialog v-model="open" :maximized="$q.screen.lt.sm">
    <q-card
      style="min-width: 75vw"
      :class="
        loadingProductMovement ? 'bg-grey-2 sub-page column justify-between' : 'bg-grey-2 sub-page'
      "
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Lista de movimentações do produto" icon="sync_alt" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingProductMovement">
          <TableProductMovement
            :product-variant-i-d="data.variantID"
            v-show="listProductMovement.length > 0"
            @show:movement-product-details="startOpenChangeShowProductDetails"
          />
          <Empty
            v-show="listProductMovement.length <= 0"
            message="Nenhuma movimentação de produto"
            color="bg-red-3"
          />
        </div>
        <Loading v-show="loadingProductMovement" :show="loadingProductMovement" />
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
    <ProductMovementDetails
      :data="showProductMovementDetails"
      @update:open="changeShowProductMovementDetails(false)"
    />
  </q-dialog>
</template>
