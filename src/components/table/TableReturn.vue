<script setup lang="ts">
import { columnsReturn } from 'src/utils/columns';
import { ref, reactive } from 'vue';
import FormReturn from '../form/FormReturn.vue';

defineOptions({
  name: 'TableReturn',
});

const props = defineProps<{
  saleID?: number | null;
}>();

const filter = ref<string>('');
const showFormReturn = reactive({
  open: false as boolean,
  saleID: null as number | null,
  returnID: null as number | null,
});

const changeShowFormReturn = (
  open: boolean,
  saleID: number | null = null,
  returnID: number | null = null,
) => {
  Object.assign(showFormReturn, {
    open,
    saleID,
    returnID,
  });
};
</script>

<template>
  <section>
    <q-table
      :rows="[
        {
          id: 1,
          date: '14/01/2026 14:56:01',
          status: 'Aprovada',
          created_by: 'Roberto Miranda',
          updated_by: 'Vitor Magalhães',
        },
        {
          id: 2,
          date: '14/01/2026 14:56:01',
          status: 'Aprovada',
          created_by: 'Roberto Miranda',
          updated_by: 'Vitor Magalhães',
        },
      ]"
      :columns="columnsReturn"
      :filter="filter"
      :loading="false"
      title="Lista de devolução"
      row-key="index"
      no-data-label="Nenhuma devolução para mostrar"
      virtual-scroll
      :rows-per-page-options="[10]"
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
          <q-td key="date" :props="props" class="text-left">
            {{ props.row.date }}
          </q-td>
          <q-td key="status" :props="props" class="items-center">
            {{ props.row.status }}
          </q-td>
          <q-td key="created_by" :props="props" class="text-left">
            {{ props.row.created_by }}
          </q-td>
          <q-td key="updated_by" :props="props" class="text-left">
            {{ props.row.updated_by }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              @click="changeShowFormReturn(true, saleID, props.row.id)"
              size="sm"
              flat
              round
              color="black"
              icon="arrow_circle_right"
            />
            <q-btn
              @click="console.log(true, props.row.id)"
              size="sm"
              flat
              round
              color="primary"
              icon="visibility"
            />
            <q-btn
              @click="console.log('ajksahd', props.row.id)"
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
  <!-- Modals -->
  <FormReturn :data="showFormReturn" @update:open="changeShowFormReturn(false)" />
</template>
