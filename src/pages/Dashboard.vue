<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import DashboardCard from 'src/components/card/DashboardCard.vue';
import GraphicBar from 'src/components/graphic/GraphicBar.vue';
import GraphicDoughnut from 'src/components/graphic/GraphicDoughnut.vue';
import TableDashboardQuantityRegister from 'src/components/table/TableDashboardQuantityRegister.vue';
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useDashboardStore } from 'src/stores/dashboard-store';
import { formatToReal } from 'src/composables/Money';
import { PaymentTypeLabels } from 'src/enums/payment-enum';
import type { PaymentType } from 'src/enums/payment-enum';
import type { ChartDataset } from 'chart.js';
import Loading from 'src/components/shared/Loading.vue';
import FilterDashboard from 'src/components/filter/FilterDashboard.vue';
import { checkDashboardFilter } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';

defineOptions({ name: 'Dashboard' });

const { dashboardInfo, loadingDashboard } = storeToRefs(useDashboardStore());

const screenWidth = ref(window.innerWidth);
const showFilterDashboard = ref(false);

const filter = reactive<IFilterDashboard>({
  startDate: '',
  endDate: '',
  seller: null,
  category: null,
  product: null,
  typeReceipt: null,
});

const getDashboardInfo = async () => {
  await useDashboardStore().getDashboardInfo();
};

const changeShowFilterDashboard = () => {
  showFilterDashboard.value = !showFilterDashboard.value;
};

const actionFilter = async (data: 'close' | IFilterDashboard) => {
  changeShowFilterDashboard();

  if (data !== 'close') {
    const check = checkDashboardFilter(data);
    if (check.status) {
      Object.assign(filter, data);
      const isEmptyFilter =
        !filter.startDate &&
        !filter.endDate &&
        !filter.seller &&
        !filter.category &&
        !filter.product &&
        !filter.typeReceipt;
      await useDashboardStore().getDashboardInfo(isEmptyFilter ? null : filter);
    } else {
      createErrorData(check.message || 'Erro ao validar dados da filtragem');
    }
  }
};

const updateWidth = () => {
  screenWidth.value = window.innerWidth;
};

const monitorWidth = computed(() => screenWidth.value);

const hasFilter = computed(() =>
  Object.values(filter).some((value) => value !== null && value !== ''),
);

const sortLabelsAndValuesDesc = (labels: string[], values: number[]) => {
  return labels
    .map((label, index) => ({
      label,
      value: values[index],
    }))
    .sort((a, b) => b.value - a.value);
};

const categoriesLabel = computed(() =>
  dashboardInfo.value.categories_most_sold?.length
    ? dashboardInfo.value.categories_most_sold.map((cat) => cat.name)
    : ['...'],
);

const categoriesData = computed(() =>
  dashboardInfo.value.categories_most_sold?.length
    ? dashboardInfo.value.categories_most_sold.map((cat) => cat.total_quantity)
    : [1],
);

const typeReceiptLabel = computed(() => {
  const receipts = dashboardInfo.value?.receipts_value;
  if (!receipts || Object.keys(receipts).length === 0) return ['...'];

  return Object.values(receipts).map(
    (receipt) => PaymentTypeLabels[receipt.name as PaymentType] ?? receipt.name,
  );
});

const typeReceiptData = computed(() => {
  const receipts = dashboardInfo.value?.receipts_value;
  if (!receipts || Object.keys(receipts).length === 0) return [1];

  return Object.values(receipts).map((receipt) => receipt.total_quantity);
});

const allSalesPeriodsDatasets = computed<ChartDataset<'bar' | 'line'>[]>(() => {
  const info = dashboardInfo.value.sales_months_info;
  const hasData = info && info.total && Object.values(info.total).length > 0;

  if (!hasData) {
    return [
      {
        type: 'bar',
        label: 'Valor das vendas em ... (R$)',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        stack: 'total',
      },
    ];
  }

  return Object.values(info.total ?? {}).map((item) => ({
    type: 'bar',
    label: `Valor das vendas em ${item.label} (R$)`,
    data: item.data,
    stack: 'total',
  }));
});

const allSalesProductsDatasets = computed<ChartDataset<'bar' | 'line'>[]>(() => {
  const products = dashboardInfo.value.products;

  if (!products?.labels?.length)
    return [
      {
        type: 'bar',
        label: 'Valor total (R$)',
        data: [],
        backgroundColor: 'rgba(187, 220, 229, 0.8)',
      },
    ];

  const sorted = sortLabelsAndValuesDesc(products.labels, products.value);

  return [
    {
      type: 'bar',
      label: 'Valor total (R$)',
      data: sorted.map((item) => item.value),
      backgroundColor: 'rgba(187, 220, 229, 0.8)',
    },
  ];
});

const allSalesSellerDatasets = computed<ChartDataset<'bar' | 'line'>[]>(() => {
  const sellers = dashboardInfo.value.sellers;

  if (!sellers?.labels?.length)
    return [
      {
        type: 'bar',
        label: 'Valor das vendas (R$)',
        data: [],
        backgroundColor: 'rgba(145, 200, 228, 0.8)',
      },
    ];

  const sorted = sortLabelsAndValuesDesc(sellers.labels, sellers.value);

  return [
    {
      type: 'bar',
      label: 'Valor das vendas (R$)',
      data: sorted.map((item) => item.value),
      backgroundColor: 'rgba(145, 200, 228, 0.8)',
    },
  ];
});

onMounted(async () => {
  await getDashboardInfo();
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});
</script>

<template>
  <main class="dashboard-page q-pa-md">
    <!-- Header -->
    <section class="q-mb-md">
      <div class="row items-center no-wrap">
        <div class="col">
          <TitlePage title="Dashboard" icon="equalizer" />
        </div>
        <div class="col-auto q-pr-xs">
          <q-btn
            round
            color="primary"
            icon="filter_alt"
            unelevated
            size="13px"
            @click="changeShowFilterDashboard"
          >
            <q-badge v-show="hasFilter" floating color="red" rounded />
          </q-btn>
        </div>
      </div>
    </section>

    <!-- Loading state -->
    <div v-if="loadingDashboard" class="flex flex-center" style="min-height: 60vh">
      <Loading :show="loadingDashboard" size="170px" />
    </div>

    <div v-else>
      <!-- KPI Cards -->
      <section class="q-mb-lg">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-lg-3">
            <DashboardCard
              title="Total de Vendas"
              icon="payments"
              :data="
                dashboardInfo.sales_value ? formatToReal(dashboardInfo.sales_value) : 'R$ 0,00'
              "
            />
          </div>
          <div class="col-12 col-sm-6 col-lg-3">
            <DashboardCard
              title="Quantidade de Vendas"
              icon="shopping_cart"
              :data="dashboardInfo.sales_made"
            />
          </div>
          <div class="col-12 col-sm-6 col-lg-3">
            <DashboardCard
              title="Movimentações"
              icon="compare_arrows"
              :data="
                dashboardInfo.movements_entry_value
                  ? formatToReal(dashboardInfo.movements_entry_value)
                  : 'R$ 0,00'
              "
              :data2="
                dashboardInfo.movements_out_value
                  ? formatToReal(dashboardInfo.movements_out_value)
                  : 'R$ 0,00'
              "
              tooltip="Entrada"
              tooltip2="Saída"
              dataClass="text-h5 text-weight-bold text-green-8"
              dataClass2="text-h5 text-weight-bold text-red-8"
            />
          </div>
          <div class="col-12 col-sm-6 col-lg-3">
            <DashboardCard
              title="Ticket Médio"
              icon="receipt_long"
              :data="
                dashboardInfo.medium_ticket ? formatToReal(dashboardInfo.medium_ticket) : 'R$ 0,00'
              "
            />
          </div>
        </div>
      </section>

      <!-- Doughnuts + Table -->
      <section class="q-mb-lg">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-card flat bordered class="dashboard-card full-height">
              <q-card-section class="q-pb-none">
                <div class="chart-section-title">Vendas X Categorias TOP 5</div>
              </q-card-section>
              <q-card-section class="flex justify-center">
                <div class="doughnut-wrapper">
                  <GraphicDoughnut
                    :label="categoriesLabel"
                    :labelTooltip="
                      dashboardInfo.categories_most_sold?.length
                        ? 'Quantidades vendidas'
                        : 'Nenhuma quantidade para mostrar'
                    "
                    :data="categoriesData"
                    :backgroundColor="['#0046FF', '#FAB12F', '#0BA6DF', '#D96F32', '#9ECAD6']"
                    :hoverOffset="4"
                    :responsive="true"
                    position="top"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card flat bordered class="dashboard-card full-height">
              <q-card-section class="q-pb-none">
                <div class="chart-section-title">Vendas X Tipos de Recebimentos</div>
              </q-card-section>
              <q-card-section class="flex justify-center">
                <div class="doughnut-wrapper">
                  <GraphicDoughnut
                    :label="typeReceiptLabel"
                    :labelTooltip="
                      typeReceiptLabel[0] === '...'
                        ? 'Nenhuma quantidade arrecadada'
                        : 'Quantidade arrecadada em R$'
                    "
                    :data="typeReceiptData"
                    :backgroundColor="['#03A6A1', '#0046FF', '#E67514', '#06923E']"
                    :hoverOffset="4"
                    :responsive="true"
                    position="top"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card flat bordered class="dashboard-card full-height">
              <TableDashboardQuantityRegister
                :records="dashboardInfo.records ? dashboardInfo.records : []"
              />
            </q-card>
          </div>
        </div>
      </section>

      <!-- Bar Charts -->
      <section>
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-card flat bordered class="dashboard-card">
              <q-card-section class="q-pb-none">
                <div class="chart-section-title">Vendas X Período</div>
              </q-card-section>
              <q-card-section class="chart-scroll-x">
                <GraphicBar
                  :labels="[
                    'Janeiro',
                    'Fevereiro',
                    'Março',
                    'Abril',
                    'Maio',
                    'Junho',
                    'Julho',
                    'Agosto',
                    'Setembro',
                    'Outubro',
                    'Novembro',
                    'Dezembro',
                  ]"
                  :datasets="allSalesPeriodsDatasets"
                  :responsive="false"
                  indexAxis="x"
                  :width="monitorWidth - 100"
                  height="400"
                />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12">
            <q-card flat bordered class="dashboard-card">
              <q-card-section class="q-pb-none">
                <div class="chart-section-title">Vendas UND X Produto</div>
              </q-card-section>
              <q-card-section class="chart-scroll-x">
                <GraphicBar
                  :labels="dashboardInfo.products ? dashboardInfo.products.labels : ['...']"
                  :datasets="allSalesProductsDatasets"
                  :responsive="false"
                  indexAxis="y"
                  :width="monitorWidth - 100"
                  height="500px"
                />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12">
            <q-card flat bordered class="dashboard-card">
              <q-card-section class="q-pb-none">
                <div class="chart-section-title">Vendas X Vendedores</div>
              </q-card-section>
              <q-card-section class="chart-scroll-x">
                <GraphicBar
                  :labels="dashboardInfo.sellers ? dashboardInfo.sellers.labels : ['...']"
                  :datasets="allSalesSellerDatasets"
                  :responsive="false"
                  indexAxis="y"
                  :width="monitorWidth - 100"
                  height="500px"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </section>
    </div>

    <!-- Modals -->
    <FilterDashboard :open="showFilterDashboard" :filters="filter" @update:open="actionFilter" />
  </main>
</template>

<style scoped>
.dashboard-page {
  background: #f4f6f9;
  min-height: 100vh;
}

.dashboard-card {
  border-radius: 12px !important;
}

.chart-section-title {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #78909c;
}

.doughnut-wrapper {
  width: 100%;
  max-width: 360px;
  position: relative;
}

.chart-scroll-x {
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
