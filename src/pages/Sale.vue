<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import TableSale from 'src/components/table/TableSale.vue';
import { ref } from 'vue';

defineOptions({
  name: 'Sale',
});

const search = ref<string>('');
const hasFilter = ref<boolean>(true);

const changeShowFilterSale = () => {
  console.log('abrir filtro');
};
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
            style="width: 200px"
            class="bg-white rounded-borders"
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
  </main>
</template>
