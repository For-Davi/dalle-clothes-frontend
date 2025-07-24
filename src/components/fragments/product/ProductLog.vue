<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import TableProductLog from 'src/components/table/TableProductLog.vue';

defineOptions({
  name: 'ProductLog',
});

const props = defineProps<{
  loading: boolean;
  listLogs: [];
}>();
</script>
<template>
  <q-card class="bg-grey-2 column justify-between" bordered flat>
    <q-card-section class="q-pa-none">
      <TitlePage title="Registro de logs" icon="list_alt" />
    </q-card-section>
    <q-card-section class="q-pa-sm" v-show="!props.loading">
      <TableProductLog :list-log="props.listLogs" :loading="props.loading" />
    </q-card-section>
  </q-card>
</template>
