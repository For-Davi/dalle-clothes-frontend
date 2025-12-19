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

defineOptions({
  name: 'Dashboard',
});

const { dashboardInfo, loadingDashboard } = storeToRefs(useDashboardStore());

const screenWidth = ref(window.innerWidth);
const showFilterDashboard = ref<boolean>(false);
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
const changeShowFilterDashboard = (): void => {
  showFilterDashboard.value = !showFilterDashboard.value;
};
const actionFilter = async (data: 'close' | IFilterDashboard): Promise<void> => {
  changeShowFilterDashboard();

  if (data !== 'close') {
    Object.assign(filter, {
      startDate: data.startDate,
      endDate: data.endDate,
      seller: data.seller,
      category: data.category,
      product: data.product,
      typeReceipt: data.typeReceipt,
    });
    await useDashboardStore().getDashboardInfo(filter);
  }
};
const updateWidth = () => {
  screenWidth.value = window.innerWidth;
};

const hasFilter = computed(() => {
  return (
    filter.startDate !== '' ||
    filter.endDate !== '' ||
    filter.seller !== null ||
    filter.category !== null ||
    filter.product !== null ||
    filter.typeReceipt !== null
  );
});
const monitorWidth = computed(() => screenWidth.value);
const categoriesLabel = computed(() => {
  return dashboardInfo.value.categories_most_sold?.length
    ? dashboardInfo.value.categories_most_sold.map((cat) => cat.name)
    : ['...'];
});
const categoriesData = computed(() => {
  return dashboardInfo.value.categories_most_sold?.length
    ? dashboardInfo.value.categories_most_sold.map((cat) => cat.total_quantity)
    : [1];
});
const typeReceiptLabel = computed(() => {
  const receipts = dashboardInfo.value?.receipts_value;
  if (!receipts || Object.keys(receipts).length === 0) {
    return ['...'];
  }
  return Object.values(receipts).map(
    (receipt) => PaymentTypeLabels[receipt.name as PaymentType] ?? receipt.name,
  );
});

const typeReceiptData = computed(() => {
  const receipts = dashboardInfo.value?.receipts_value;
  if (!receipts || Object.keys(receipts).length === 0) {
    return [1];
  }
  return Object.values(receipts).map((receipt) => receipt.total_quantity);
});
const allSalesPeriodsDatasets = computed<ChartDataset<'bar' | 'line'>[]>(() => {
  const info = dashboardInfo.value.sales_months_info;

  if (!info)
    return [
      {
        type: 'bar',
        label: `Valor das vendas em ... (R$)`,
        data: [0],
        stack: 'total',
      },
      {
        type: 'bar',
        label: `Qtd das vendas em ...`,
        data: [0],
      },
    ];

  const datasets: ChartDataset<'bar' | 'line'>[] = [];

  Object.values(info.total ?? {}).forEach((item) => {
    datasets.push({
      type: 'bar',
      label: `Valor das vendas em ${item.label} (R$)`,
      data: item.data,
      stack: 'total',
    });
  });
  Object.values(info.quantity ?? {}).forEach((item) => {
    datasets.push({
      type: 'line',
      label: `Qtd das vendas em ${item.label}`,
      data: item.data,
    });
  });

  return datasets;
});
const allSalesProductsDatasets = computed<ChartDataset<'bar' | 'line'>[]>(() => {
  const products = dashboardInfo.value.products;
  if (!products?.labels?.length)
    return [
      {
        type: 'bar',
        label: 'Valor total (R$)',
        data: [0],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        type: 'line',
        label: 'Unidades vendidas',
        data: [0],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(2, 62, 138, 1)',
      },
    ];

  return [
    {
      type: 'bar',
      label: 'Valor total (R$)',
      data: products.value,
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
    },
    {
      type: 'line',
      label: 'Unidades vendidas',
      data: products.quantity,
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderColor: 'rgba(2, 62, 138, 1)',
      tension: 0.4,
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
        data: [0],
        backgroundColor: 'rgba(20, 184, 166, 0.8)',
      },
      {
        type: 'bar',
        label: 'Quantidade de vendas',
        data: [0],
        backgroundColor: 'rgba(51, 45, 86, 0.8)',
        tension: 0.4,
      },
    ];

  return [
    {
      type: 'bar',
      label: 'Valor das vendas (R$)',
      data: sellers.value,
      backgroundColor: 'rgba(20, 184, 166, 0.8)',
    },
    {
      type: 'bar',
      label: 'Quantidade de vendas',
      data: sellers.quantity,
      backgroundColor: 'rgba(51, 45, 86, 0.8)',
      tension: 0.4,
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
  <main class="q-pa-lg">
    <section>
      <TitlePage title="Dashboard" icon="equalizer" />
    </section>
    <div class="full-width">
      <section>
        <q-banner rounded class="bg-grey-4 q-mb-sm">
          <div class="row q-gutter-x-sm justify-end items-center">
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
        </q-banner>
      </section>
      <div>
        <div v-if="loadingDashboard" class="fixed-center q-mt-lg">
          <Loading :show="loadingDashboard" size="170px" />
        </div>

        <div v-else>
          <div class="row justify-between full-width q-mt-sm">
            <DashboardCard
              title="Total de Vendas"
              :data="
                dashboardInfo.sales_value ? formatToReal(dashboardInfo.sales_value) : 'R$ 0,00'
              "
              class="q-pa-xs"
            />
            <DashboardCard
              title="Quantidade de Vendas"
              :data="dashboardInfo.sales_made"
              class="q-pa-xs"
            />
            <DashboardCard
              title="Movimentações"
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
              class="q-pa-xs"
            />
            <DashboardCard
              title="Ticket Médio"
              :data="
                dashboardInfo.medium_ticket ? formatToReal(dashboardInfo.medium_ticket) : 'R$ 0,00'
              "
              class="q-pa-xs"
            />
          </div>

          <div class="row justify-between full-width q-mt-lg">
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
              :responsive="false"
              position="top"
              title="Vendas X Categorias TOP 5"
              width="400"
              height="400"
            />
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
              :responsive="false"
              position="top"
              title="Vendas X Tipos de Recebimentos"
              width="400"
              height="400"
            />
            <TableDashboardQuantityRegister
              :records="dashboardInfo.records ? dashboardInfo.records : []"
            />
          </div>

          <div class="row q-mt-lg q-gutter-y-xl">
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
              title="Vendas X Período"
              :width="monitorWidth - 100"
              height="500"
              class="q-mb-md"
            />
            <GraphicBar
              :labels="dashboardInfo.products ? dashboardInfo.products.labels : ['...']"
              :datasets="allSalesProductsDatasets"
              :responsive="false"
              indexAxis="y"
              position="bottom"
              title="Vendas UND X Produto"
              :width="monitorWidth - 100"
              height="500px"
              class="q-mb-md"
            />
            <GraphicBar
              :labels="dashboardInfo.sellers ? dashboardInfo.sellers.labels : ['...']"
              :datasets="allSalesSellerDatasets"
              :responsive="false"
              indexAxis="y"
              position="bottom"
              title="Vendas X Vendedores"
              :width="monitorWidth - 100"
              height="500px"
              class="q-mb-md"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Modals -->
    <FilterDashboard :open="showFilterDashboard" :filters="filter" @update:open="actionFilter" />
  </main>
</template>
