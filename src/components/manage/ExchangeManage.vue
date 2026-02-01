<script setup lang="ts">
import { computed } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useExchangeStore } from 'src/stores/exchange-store';
import Empty from '../info/Empty.vue';
import Loading from '../shared/Loading.vue';
import TableExchange from '../table/TableExchange.vue';

defineOptions({
  name: 'ExchangeManage',
});

const props = defineProps<{
  data: {
    open: boolean;
    saleID: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { listExchanges, loadingExchange } = storeToRefs(useExchangeStore());

// const showFormReturn = reactive({
//   open: false as boolean,
//   returnID: null as number | null,
// });

// const changeShowFormReturn = (
//   open: boolean,
//   returnID: number | null = null,
// ) => {
//   Object.assign(showFormReturn, {
//     open,
//     returnID,
//   });
// };

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card
      style="min-width: 70vw"
      :class="loadingExchange ? 'bg-grey-2 sub-page column justify-between' : 'bg-grey-2 sub-page'"
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Estornos" icon="fa-solid fa-box" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingExchange">
          <TableExchange :sale-i-d="props.data.saleID" v-show="listExchanges.length > 0" />
          <Empty
            v-show="listExchanges.length <= 0 && !loadingExchange"
            message="Sem estornos"
            color="bg-red-3"
          />
        </div>
        <Loading :show="loadingExchange" />
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
      <!-- Modals -->
      <!-- <FormReturn :data="showFormReturn" @update:open="changeShowFormReturn(false)" /> -->
    </q-card>
  </q-dialog>
</template>
