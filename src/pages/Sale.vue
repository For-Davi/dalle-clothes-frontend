<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import TableSale from 'src/components/table/TableSale.vue';
import { ref, reactive, computed } from 'vue';
import FilterSale from 'src/components/filter/FilterSale.vue';
import { useSaleStore } from 'src/stores/sale-store';

defineOptions({
  name: 'Sale',
});

const search = ref<string>('');
const showFilterSale = ref<boolean>(false);
const filter = reactive<IFilterSale>({
  startDate: null,
  endDate: null,
  status: null,
  client: null,
  seller: null,
  product: null,
  paymentType: null,
  receipt: null,
  minTotal: null,
  maxTotal: null,
});

const changeShowFilterSale = () => {
  showFilterSale.value = !showFilterSale.value;
};
const actionFilter = async (data: 'close' | IFilterSale): Promise<void> => {
  changeShowFilterSale();

  if (data !== 'close') {
    Object.assign(filter, {
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      client: data.client,
      seller: data.seller,
      product: data.product,
      paymentType: data.paymentType,
      receipt: data.receipt,
      minTotal: data.minTotal,
      maxTotal: data.maxTotal,
    });
    await useSaleStore().getSales(filter);
  }
};

const hasFilter = computed(() => {
  return Object.values(filter).some((value) => value !== null && value !== '');
});
</script>
<template>
  <main class="q-pa-lg">
    <section>
      <TitlePage title="Vendas" icon="paid" />
    </section>
    <section>
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm justify-end items-center">
          <q-input
            label="Pesquise"
            outlined
            v-model="search"
            dense
            class="search-input bg-white rounded-borders"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="20px" color="black" />
            </template>
          </q-input>
          <q-btn
            @click="changeShowFilterSale"
            round
            color="primary"
            icon="filter_alt"
            unelevated
            size="13px"
          >
            <q-badge v-show="hasFilter" floating color="red" rounded />
          </q-btn>
        </div>
      </q-banner>
      <TableSale :filter="search" />
    </section>
    <!-- Modals -->
    <FilterSale :open="showFilterSale" :filters="filter" @update:open="actionFilter" />
  </main>
</template>
