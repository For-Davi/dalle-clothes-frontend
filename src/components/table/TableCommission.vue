<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { columnsCommissions } from 'src/utils/columns';
import { useCommissionStore } from 'src/stores/commission-store';
import { formatToReal } from 'src/composables/Money';
import type { QTableProps } from 'quasar';

defineOptions({
  name: 'TableCategoryTransaction',
});

const props = defineProps<{
  saleID: number | null;
}>();

const { loadingCommission, listCommission } = storeToRefs(useCommissionStore());

const filter = ref<string>('');

const fetchCommissions = async () => {
  if (props.saleID) {
    await useCommissionStore().getComissionsSelect(props.saleID);
  }
};
const filterMethod: QTableProps['filterMethod'] = (rows, terms) => {
  const search = String(terms).toLowerCase();

  return rows.filter((row: ICommission) => {
    const formattedDate = row.created_at.toLowerCase();

    return (
      formattedDate.includes(search) ||
      row.status.toLowerCase().includes(search) ||
      row.type.toLowerCase().includes(search) ||
      row.product_name.toLowerCase().includes(search) ||
      row.seller_name.toLowerCase().includes(search) ||
      row.seller_email?.toLowerCase().includes(search) ||
      String(row.percentage ?? '').includes(search) ||
      String(row.commission_value ?? '').includes(search)
    );
  });
};

onMounted(async () => {
  await fetchCommissions();
});
</script>
<template>
  <section style="min-height: 300px">
    <q-table
      v-show="!loadingCommission"
      :rows="loadingCommission ? [] : listCommission"
      :columns="columnsCommissions"
      :filter="filter"
      :filter-method="filterMethod"
      :loading="loadingCommission"
      :pagination="{
        sortBy: 'created_at',
        descending: true,
      }"
      title="Lista de comissões"
      row-key="created_at"
      no-data-label="Nenhuma comissão para mostrar"
      virtual-scroll
      :rows-per-page-options="[6]"
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
          <span class="text-body1">Lista de comissões</span>
          <q-space />
          <q-input
            v-show="listCommission.length > 0"
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
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="created_at" :props="props" class="text-left">
            {{ props.row.created_at }}
          </q-td>
          <q-td key="status" :props="props" class="text-left">
            <q-icon
              :name="props.row.status === 'Ativa' ? 'check_circle' : 'close'"
              :color="props.row.status === 'Ativa' ? 'green' : 'red'"
              class="cursor-pointer"
              size="17px"
            >
              <q-tooltip class="bg-grey-3 text-bold text-black">{{ props.row.status }}</q-tooltip>
            </q-icon>
          </q-td>
          <q-td key="type" :props="props" class="text-left">
            {{ props.row.type }}
          </q-td>
          <q-td key="return_code" :props="props" class="text-left">
            {{ props.row.return_id ?? '-' }}
          </q-td>
          <q-td key="product_name" :props="props" class="text-left">
            {{ props.row.product_name }}
          </q-td>
          <q-td key="seller_name" :props="props" class="text-left">
            {{ props.row.seller_name }}
          </q-td>
          <q-td key="seller_email" :props="props" class="text-left">
            {{ props.row.seller_email ? props.row.seller_email : '-' }}
          </q-td>
          <q-td key="percentage" :props="props" class="text-left">
            {{ props.row.percentage }}%
          </q-td>
          <q-td key="commission_value" :props="props" class="text-left">
            {{ formatToReal(props.row.commission_value) }}
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Modals -->
    <Loading :show="loadingCommission" />
  </section>
</template>
