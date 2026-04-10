<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref } from 'vue';
import ListCommissionResult from 'src/components/list/ListCommissionResult.vue';
import FilterResult from 'src/components/filter/FilterResult.vue';
import { useCommissionStore } from 'src/stores/commission-store';
import { checkCommissionFilter } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';

defineOptions({
  name: 'Result',
});

const filter = reactive<IFilterCommission>({
  startPeriod: '',
  endPeriod: '',
  sellerID: null,
});
const showFilterResult = ref<boolean>(false);
const showDetailsResult = reactive({
  open: false as boolean,
  sellerID: null as number | null,
  period: null as string | null,
});

const changeShowFilterCommision = (): void => {
  showFilterResult.value = !showFilterResult.value;
};
const actionFilter = async (data: 'close' | IFilterCommission): Promise<void> => {
  changeShowFilterCommision();

  if (data !== 'close') {
    Object.assign(filter, {
      startPeriod: data.startPeriod,
      endPeriod: data.endPeriod,
      sellerID: data.sellerID,
    });
    const check = checkCommissionFilter(filter);
    if (check.status) {
      await useCommissionStore().getComissions(filter);
    } else {
      createErrorData(check.message || 'Erro ao processar dados do filtro');
    }
  }
};
const changeShowDetails = (sellerID: number, period: string) => {
  if (showDetailsResult.open) {
    Object.assign(showDetailsResult, {
      open: false,
      sellerID: null,
      period: null,
    });
  } else {
    Object.assign(showDetailsResult, {
      open: true,
      sellerID: sellerID,
      period: period,
    });
  }
};

const hasFilter = computed(() => {
  return filter.startPeriod !== '' || filter.endPeriod !== '' || filter.sellerID;
});
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Resultados" icon="analytics" />
    </section>
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm justify-end items-center">
          <q-btn
            @click="changeShowFilterCommision"
            round
            color="primary"
            icon="filter_alt"
            unelevated
            size="13px"
          >
            <q-badge v-show="hasFilter" floating color="red" rounded />
          </q-btn>
        </div>
      </q-banner>
      <ListCommissionResult :filters="filter" @show:show-details-commission="changeShowDetails" />
    </section>

    <!-- Modals -->
    <FilterResult :open="showFilterResult" :filters="filter" @update:open="actionFilter" />
  </main>
</template>
