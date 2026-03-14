<script setup lang="ts">
import { columnsReturn } from 'src/utils/columns';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useReturnStore } from 'src/stores/return-store';

defineOptions({
  name: 'TableReturn',
});

const props = defineProps<{
  saleID: number | null;
  saleStatus: string | null;
}>();
const emit = defineEmits<{
  'open:form-linked-return': [number, number];
  'open:return-details': [number];
  'edit:return': [number, number, string];
  'exclude:return': [number];
}>();

const { listReturns, loadingReturns } = storeToRefs(useReturnStore());

const filter = ref<string>('');

const fetchReturns = async () => {
  if (props.saleID) {
    await useReturnStore().getReturns(props.saleID);
  }
};
const startExclude = (id: number) => {
  emit('exclude:return', id);
};

onMounted(async () => {
  await fetchReturns();
});
</script>

<template>
  <section style="min-height: 300px">
    <q-table
      v-show="!loadingReturns"
      :rows="loadingReturns ? [] : listReturns"
      :columns="columnsReturn"
      :filter="filter"
      :loading="loadingReturns"
      :pagination="{ sortBy: 'created_at', descending: true }"
      title="Lista de devolução"
      row-key="index"
      no-data-label="Nenhuma devolução para mostrar"
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
          <span class="text-body1">Lista de devolução</span>
          <q-space />
          <q-input
            v-show="listReturns.length > 0"
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
              :name="props.row.status === 'Ativa' ? 'check_circle' : 'close'"
              :color="props.row.status === 'Ativa' ? 'green' : 'red'"
              class="cursor-pointer q-px-xs"
              size="17px"
            >
              <q-tooltip class="bg-grey-3 text-bold text-black">{{
                props.row.status === 'Ativa' ? 'Ativa' : 'Cancelada'
              }}</q-tooltip>
            </q-icon>
          </q-td>
          <q-td key="code" :props="props" class="text-left">
            {{ props.row.id }}
          </q-td>
          <q-td key="linked_code" :props="props" class="text-left">
            {{ props.row.linked_return_id === null ? '-' : props.row.linked_return_id }}
          </q-td>
          <q-td key="created_by_name" :props="props" class="text-left">
            {{ props.row.created_by_name }}
          </q-td>
          <q-td key="created_by_email" :props="props" class="text-left">
            {{ props.row.created_by_email }}
          </q-td>
          <q-td key="updated_by_name" :props="props" class="text-left">
            {{ props.row.updated_by_name === null ? '-' : props.row.updated_by_name }}
          </q-td>
          <q-td key="updated_by_email" :props="props" class="text-left">
            {{ props.row.updated_by_email === null ? '-' : props.row.updated_by_email }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              v-if="props.row.return_exchange_items.length > 0 && saleStatus !== 'canceled'"
              @click="if (saleID) emit('open:form-linked-return', saleID, props.row.id);"
              size="sm"
              flat
              round
              color="black"
              icon="arrow_circle_right"
            >
              <q-tooltip> Vincular devolução </q-tooltip>
            </q-btn>
            <q-btn
              @click="emit('open:return-details', props.row.id)"
              size="sm"
              flat
              round
              color="primary"
              icon="visibility"
            >
              <q-tooltip> Detalhes </q-tooltip>
            </q-btn>
            <q-btn
              v-if="saleStatus !== 'canceled'"
              @click="emit('edit:return', props.row.id, saleID!, props.row.status)"
              size="sm"
              flat
              round
              color="black"
              icon="edit"
            />
            <q-btn
              v-if="saleStatus !== 'canceled'"
              @click="startExclude(props.row.id)"
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
  </section>
</template>
