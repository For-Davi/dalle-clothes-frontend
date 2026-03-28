<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref } from 'vue';
import ListCommissionResult from 'src/components/list/ListCommissionResult.vue';

defineOptions({
  name: 'Result',
});

const filter = reactive<IFilterCommission>({
  startDate: '',
  endDate: '',
  sellerID: null,
});
const showFilterCommission = ref<boolean>(false);
const showDetailsComssion = reactive({
  open: false as boolean,
  sellerID: null as number | null,
  period: null as string | null,
});

const changeShowFilterCommision = (): void => {
  showFilterCommission.value = !showFilterCommission.value;
};
// const actionFilter = async (data: 'close' | IFilterCommission): Promise<void> => {
//   changeShowFilterCommision();

//   if (data !== 'close') {
//     Object.assign(filter, {
//       startDate: data.startDate,
//       endDate: data.endDate,
//       sellerID: data.sellerID,
//     });
//     await useCommissionStore().getComissions(filter);
//   }
// };
const changeShowDetails = (sellerID: number, period: string) => {
  if (showDetailsComssion.open) {
    Object.assign(showDetailsComssion, {
      open: false,
      sellerID: null,
      period: null,
    });
  } else {
    Object.assign(showDetailsComssion, {
      open: true,
      sellerID: sellerID,
      period: period,
    });
  }
};

const hasFilter = computed(() => {
  return filter.startDate !== '' || filter.endDate != '' || filter.sellerID;
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
    <!-- <FormClient :data="showFormClient" @update:open="changeShowFormClient(false)" />
    <FilterClient :open="showFilterClient" :filters="filter" @update:open="actionFilter" /> -->
  </main>
</template>
