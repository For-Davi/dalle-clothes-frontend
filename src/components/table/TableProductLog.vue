<script setup lang="ts">
import { columnsProductLog } from 'src/utils/columns';
import { formatToBrazilianDate } from 'src/composables/FormatData';

defineOptions({
  name: 'TableProductLog',
});

const props = defineProps<{
  loading: boolean;
  listLog: ILog[];
}>();
</script>
<template>
  <section style="min-height: 300px; max-height: 500px;">
    <q-table
      v-show="!loading"
      :rows="loading ? [] : props.listLog"
      :columns="columnsProductLog"
      :loading="props.loading"
      title="Lista de registros"
      row-key="index"
      no-data-label="Nenhum registro para mostrar"
      virtual-scroll
      :rows-per-page-options="[5]"
      bordered
      flat
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
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="created_at" :props="props" class="text-left">
            {{ formatToBrazilianDate(props.row.created_at) }}
          </q-td>
          <q-td key="execution" :props="props" class="text-left capitalize">
            {{ props.row.execution }}
          </q-td>
          <q-td key="description" :props="props" class="text-left">
            {{ props.row.description }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>
