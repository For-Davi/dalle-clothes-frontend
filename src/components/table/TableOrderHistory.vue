<script setup lang="ts">
import { getLabelStatus } from 'src/composables/Label';
import { formatToBrazilianDate } from 'src/composables/FormatData';
import { columnsOrderHistory } from 'src/utils/columns';

defineOptions({
  name: 'TableOrderHistory',
});

const props = defineProps<{
  items: IOrderHistory[];
}>();
</script>
<template>
  <section>
    <q-table
      flat
      bordered
      :rows="props.items"
      :columns="columnsOrderHistory"
      row-key="index"
      no-data-label="Nenhum histórico para mostrar"
      :rows-per-page-options="[0]"
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
          <q-td key="status" :props="props" class="text-left">
            {{ getLabelStatus(props.row.status).text }}
          </q-td>
          <q-td key="changed" :props="props" class="text-left">
            {{ props.row.changed.name }} - {{ props.row.changed.email }}
          </q-td>
          <q-td key="created_at" :props="props" class="text-left">
            {{ formatToBrazilianDate(props.row.created_at) }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>
