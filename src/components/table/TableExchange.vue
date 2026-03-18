<script setup lang="ts">
import { columnsExchanges } from 'src/utils/columns';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useExchangeStore } from 'src/stores/exchange-store';
import { formatToReal } from 'src/composables/Money';

defineOptions({
  name: 'TableExchange',
});

const props = defineProps<{
  saleID: number | null;
}>();
const emit = defineEmits<{
  'show:payment-form': [IExchange];
  'show:exchange-details': [number];
}>();

const { listExchanges, loadingExchanges } = storeToRefs(useExchangeStore());

const filter = ref<string>('');

const fetchExchanges = async () => {
  if (props.saleID) {
    await useExchangeStore().getExchanges(props.saleID);
  }
};

onMounted(async () => {
  await fetchExchanges();
});
</script>

<template>
  <section style="min-height: 300px">
    <q-table
      v-show="!loadingExchanges"
      :rows="loadingExchanges ? [] : listExchanges"
      :columns="columnsExchanges"
      :filter="filter"
      :loading="loadingExchanges"
      :pagination="{ sortBy: 'created_at', descending: true }"
      title="Lista de estorno e diferenças"
      row-key="index"
      no-data-label="Nenhum estorno ou diferença para mostrar"
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
          <span class="text-body1">Lista de estorno e diferenças</span>
          <q-space />
          <q-input
            v-show="listExchanges.length > 0"
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
          <q-td key="status" :props="props" class="items-center">
            <q-icon
              :name="props.row.status === 'Ativo' ? 'check_circle' : 'close'"
              :color="props.row.status === 'Ativo' ? 'green' : 'red'"
              class="cursor-pointer q-px-xs"
              size="17px"
            >
              <q-tooltip class="bg-grey-3 text-bold text-black">{{
                props.row.status === 'Ativo' ? 'Ativo' : 'Cancelado'
              }}</q-tooltip>
            </q-icon>
          </q-td>
          <q-td key="return_id" :props="props" class="text-left">
            {{ props.row.return_id }}
          </q-td>
          <q-td key="difference_value" :props="props" class="text-left text-green-6">
            {{ formatToReal(props.row.difference_value) }}
          </q-td>
          <q-td key="exchange_value" :props="props" class="text-left text-red-6">
            {{ formatToReal(props.row.exchange_value) }}
          </q-td>
          <q-td key="created_by_name" :props="props" class="text-left">
            {{ props.row.created_by_name }}
          </q-td>
          <q-td key="updated_by_name" :props="props" class="text-left">
            {{ props.row.updated_by_name === null ? '-' : props.row.updated_by_name }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              @click="emit('show:exchange-details', props.row.id)"
              size="sm"
              flat
              round
              color="primary"
              icon="visibility"
            >
              <q-tooltip> Detalhes </q-tooltip>
            </q-btn>
            <q-btn
              v-if="
                props.row.exchange_payment_method.length === 0 &&
                props.row.difference_payment_method.length === 0
              "
              @click="emit('show:payment-form', props.row)"
              size="sm"
              flat
              round
              color="teal"
              icon="payments"
            >
              <q-tooltip> Realizar pagamento </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>
