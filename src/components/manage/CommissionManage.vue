<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed } from 'vue';
import Loading from '../shared/Loading.vue';
import Empty from '../info/Empty.vue';
import { storeToRefs } from 'pinia';
import { useCommissionStore } from 'src/stores/commission-store';
import TableCommission from '../table/TableCommission.vue';

defineOptions({
  name: 'CommissionsManage',
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

const { loadingCommission, listCommission } = storeToRefs(useCommissionStore());

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 sub-page column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Comissões" icon="redeem" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingCommission">
          <TableCommission :sale-i-d="props.data.saleID" />
          <Empty
            v-show="listCommission.length <= 0"
            message="Sem comissões realizadas"
            color="bg-red-3"
          />
        </div>
        <Loading v-show="loadingCommission" :show="loadingCommission" />
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
  </q-dialog>
</template>
