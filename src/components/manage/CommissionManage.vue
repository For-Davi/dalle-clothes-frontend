<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, ref } from 'vue';
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

const filter = ref<string>('');

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      style="min-width: 90vw"
      :class="
        loadingCommission ? 'bg-grey-2 sub-page column justify-between' : 'bg-grey-2 sub-page'
      "
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Comissões" icon="redeem" />
      </q-card-section>
      <q-card-section>
        <div v-show="!loadingCommission">
          <q-banner rounded class="bg-grey-4 q-mb-sm">
            <div class="row q-gutter-x-sm justify-end items-center">
              <q-input
                label="Pesquise"
                outlined
                v-model="filter"
                dense
                style="width: 200px"
                class="bg-white rounded-borders"
              >
                <template v-slot:prepend>
                  <q-icon name="search" size="20px" color="black" />
                </template>
              </q-input>
              <q-btn
                @click="console.log('abrindo filtro')"
                round
                color="primary"
                icon="filter_alt"
                unelevated
                size="13px"
              >
                <!-- <q-badge v-show="hasFilter" floating color="red" rounded /> -->
              </q-btn>
            </div>
          </q-banner>
          <TableCommission
            :filter="filter"
            :sale-i-d="props.data.saleID"
            v-show="listCommission.length > 0"
          />
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
