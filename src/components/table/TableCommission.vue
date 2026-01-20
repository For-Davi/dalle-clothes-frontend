<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { columnsCommissions } from 'src/utils/columns';
import { useCommissionStore } from 'src/stores/commission-store';
import { formatToReal } from 'src/composables/Money';

defineOptions({
  name: 'TableCategoryTransaction',
});

const props = defineProps<{
  saleID: number | null;
}>();
const emit = defineEmits<{
  'show:showFormCategoryTransaction': [ICategoryTransaction];
}>();

const { loadingCommission, listCommission } = storeToRefs(useCommissionStore());

const filter = ref<string>('');

const fetchCategories = async (): Promise<void> => {
  if (props.saleID) {
    await useCommissionStore().getComissionsSelect(props.saleID);
  }
};

onMounted(async () => {
  await fetchCategories();
});
</script>
<template>
  <section style="min-height: 300px">
    <q-table
      v-show="!loadingCommission"
      :rows="loadingCommission ? [] : listCommission"
      :columns="columnsCommissions"
      :filter="filter"
      :loading="loadingCommission"
      title="Lista de comissões"
      row-key="index"
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
          <q-td key="date" :props="props" class="text-left">
            {{ props.row.date }}
          </q-td>
          <q-td key="status" :props="props" class="text-left"> teste </q-td>
          <q-td key="type" :props="props" class="text-left">
            {{ props.row.type }}
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
          <q-td key="actions" :props="props">
            <q-btn @click="console.log(props.row)" size="sm" flat round color="black" icon="edit" />
            <q-btn
              @click="console.log(props.row.id)"
              size="sm"
              flat
              round
              color="red"
              icon="delete"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Modals -->
    <Loading :show="loadingCommission" />
  </section>
</template>
