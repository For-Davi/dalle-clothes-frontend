<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { columnsDashboardQuantityRegister } from 'src/utils/columns';
import { useDashboardStore } from 'src/stores/dashboard-store';

defineOptions({
  name: 'TableDashboardQuantityRegister',
});

const props = defineProps<{
  records: IRecordsData[];
}>();

const { loadingDashboard } = storeToRefs(useDashboardStore());

const filter = ref<string>('');
</script>
<template>
  <section style="min-height: 300px">
    <q-table
      v-show="!loadingDashboard"
      :rows="loadingDashboard ? [] : props.records"
      :columns="columnsDashboardQuantityRegister"
      :filter="filter"
      :loading="loadingDashboard"
      title="Lista de registros"
      row-key="index"
      no-data-label="Nenhum registro para mostrar"
      virtual-scroll
      :rows-per-page-options="[0]"
      style="height: 400px; width: 400px"
      bordered
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-h5">
            <span class="text-body2 text-bold">{{ col.label }}</span>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:top>
        <div class="row justify-between items-center full-width">
          <span class="text-body1">Lista de registros</span>
          <q-space />
          <q-input
            v-model="filter"
            outlined
            dense
            label="Pesquisar"
            :class="!$q.screen.lt.md ? '' : 'q-mt-sm'"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>
    </q-table>
  </section>
</template>
