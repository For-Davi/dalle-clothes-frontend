<script setup lang="ts">
import { useSellerStore } from 'src/stores/DalleAdm/seller-store';
import { storeToRefs } from 'pinia';
import { columnsSellerDashboardCommission } from 'src/utils/columns';
import { formatToReal } from 'src/composables/Money';

defineOptions({
  name: 'TableCommission',
});

const props = defineProps<{
  filter: string;
}>();

const { loadingDashboard, dashboard } = storeToRefs(useSellerStore());
</script>

<template>
  <section>
    <q-table
      :rows="loadingDashboard ? [] : dashboard"
      :columns="columnsSellerDashboardCommission"
      :filter="props.filter"
      :loading="loadingDashboard"
      title="Lista de comissão"
      row-key="index"
      no-data-label="Nenhuma comissão para mostrar"
      virtual-scroll
      :rows-per-page-options="[10]"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-h5">
            <span class="text-body2 text-bold">{{ col.label }}</span>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="period" :props="props" class="text-left">
            {{ props.row.period }}
          </q-td>
          <q-td key="sales_count" :props="props" class="text-left">
            {{ props.row.sales_count }}
          </q-td>
          <q-td key="total_commission" :props="props" class="text-left">
            {{ formatToReal(props.row.total_commission) }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>
