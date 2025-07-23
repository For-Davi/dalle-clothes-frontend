<script setup lang="ts">
import { columnsProductLog } from 'src/utils/columns';

defineOptions({
  name: 'TableProductLog',
});

const props = defineProps<{
  loading: boolean;
  listLog: [];
}>();
// const emit = defineEmits<{
//   'show:showDetailsLog': [number];
// }>();
</script>
<template>
  <section style="min-height: 300px">
    <q-table
      v-show="!loading"
      :rows="loading ? [] : props.listLog"
      :columns="columnsProductLog"
      :loading="props.loading"
      title="Lista de registros"
      row-key="index"
      no-data-label="Nenhum registro para mostrar"
      virtual-scroll
      :rows-per-page-options="[10]"
      style="height: 460px"
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
          <q-td key="date" :props="props" class="text-left">
            {{ props.row.date }}
          </q-td>
          <q-td key="name" :props="props" class="text-left">
            {{ props.row.name }}
          </q-td>
          <q-td key="email" :props="props" class="text-left">
            {{ props.row.email }}
          </q-td>
          <q-td key="execution" :props="props" class="text-left">
            {{ props.row.execution }}
          </q-td>
          <q-td key="target" :props="props" class="text-left">
            {{ props.row.target }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn size="sm" flat round color="black" icon="visibility">
              <q-tooltip>Detalhes</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>
