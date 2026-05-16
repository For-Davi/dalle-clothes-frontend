<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSellerStore } from 'src/stores/DalleAdm/seller-store';
import DashboardCard from 'src/components/card/DashboardCard.vue';
import { onMounted } from 'vue';
import TableCommission from 'src/components/table/Seller/TableCommission.vue';
import { ref, reactive, computed } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import FilterCommission from 'src/components/filter/Seller/FilterCommission.vue';

defineOptions({
  name: 'Dashboard',
});

const { seller } = storeToRefs(useSellerStore());

const search = ref<string>('');
const showFilterDashboard = ref<boolean>(false);
const filter = reactive<ISellerFilterDashboard>({
  startPeriod: '',
  endPeriod: '',
});

const changeShowFilterDashboard = () => {
  showFilterDashboard.value = !showFilterDashboard.value;
};
const getDashboard = async () => {
  await useSellerStore().getDashboard();
};
const actionFilter = async (data: 'close' | ISellerFilterDashboard): Promise<void> => {
  changeShowFilterDashboard();

  if (data !== 'close') {
    Object.assign(filter, {
      startPeriod: data.startPeriod,
      endPeriod: data.endPeriod,
    });
    await useSellerStore().getDashboard(filter);
  }
};

const hasFilter = computed(() => {
  return filter.startPeriod !== '' || filter.endPeriod != '';
});

onMounted(async () => {
  await getDashboard();
});
</script>

<template>
  <main class="dashboard-page q-pa-md">
    <div>
      <TitlePage class="col-7" title="Dashboard" icon="person" />
      <section class="q-mb-lg">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-lg-3">
            <DashboardCard
              title="Porcentagem de Comissão"
              icon="payments"
              :data="`${seller?.commission ?? '0'} %`"
            />
          </div>
          <div class="col-12 col-sm-6 col-lg-3">
            <DashboardCard
              title="Código de Vendedor"
              icon="badge"
              :data="`${seller?.code ?? ''}`"
            />
          </div>
        </div>
      </section>
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm justify-end items-center">
          <q-input
            label="Pesquise"
            outlined
            v-model="search"
            dense
            class="search-input bg-white rounded-borders"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="20px" color="black" />
            </template>
          </q-input>
          <q-btn
            @click="changeShowFilterDashboard"
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
      <TableCommission :filter="search" />
    </div>
    <!-- Modals -->
    <FilterCommission :filters="filter" :open="showFilterDashboard" @update:open="actionFilter" />
  </main>
</template>
