<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import { columnsMovement } from 'src/utils/columns';
import { useMovementStore } from 'src/stores/movement-store';
import { formatToReal } from 'src/composables/Money';

defineOptions({
  name: 'TableMovement',
});

const props = defineProps<{
  title: string;
}>();
const emit = defineEmits<{
  'show:showFormMovement': [number];
  'show:showDescription': [string];
  newRequest: [void];
}>();

const { loadingMovement, listMovement } = storeToRefs(useMovementStore());

const showConfirmAction = ref<boolean>(false);
const movementMonitoring = ref<number | null>(null);

const clear = (): void => {
  movementMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useMovementStore().deleteMovement(movementMonitoring.value ?? 0);
  clear();
  emit('newRequest');
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  movementMonitoring.value = id;
  showConfirmAction.value = true;
};
const startEdit = (id: number) => {
  emit('show:showFormMovement', id);
};
const startExclude = (id: number) => {
  openConfirmAction(id);
};
const fetchMovements = async (): Promise<void> => {
  await useMovementStore().getMovements();
};
const formatDateToBR = (date: string): string => {
  if (!date) return '';

  const [year, month, day] = date.replace(/-/g, '/').split('/');

  return `${day}/${month}/${year}`;
};

onMounted(async () => {
  await fetchMovements();
});
</script>
<template>
  <section>
    <q-table
      :rows="loadingMovement ? [] : listMovement"
      :columns="columnsMovement"
      :loading="loadingMovement"
      :title="props.title"
      title-class="bg-primary q-px-sm rounded-borders text-white"
      row-key="index"
      no-data-label="Nenhuma movimentação para mostrar"
      virtual-scroll
      :rows-per-page-options="[10]"
      dense
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
            {{ formatDateToBR(props.row.date.replace(/-/g, '/')) }}
          </q-td>
          <q-td
            key="type"
            :props="props"
            class="text-left text-bold"
            :class="props.row.type === 'entry' ? 'text-green' : 'text-red'"
          >
            {{ props.row.type === 'entry' ? 'Entrada' : 'Saída' }}
          </q-td>
          <q-td key="value" :props="props" class="text-left">
            {{ formatToReal(props.row.value) }}
          </q-td>
          <q-td key="category" :props="props" class="text-left">
            {{ props.row.category?.name ?? 'Sem categoria' }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              v-show="props.row.description"
              @click="emit('show:showDescription', props.row.description)"
              :disable="movementMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="primary"
              icon="fa-solid fa-file-lines"
            >
              <q-tooltip>Descrição</q-tooltip>
            </q-btn>
            <q-btn
              v-if="hasPermission('transaction.update')"
              @click="startEdit(props.row.id)"
              :disable="movementMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="black"
              icon="edit"
            />
            <q-btn
              v-if="hasPermission('transaction.delete')"
              @click="startExclude(props.row.id)"
              :disable="movementMonitoring === props.row.id"
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
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão de movimentação"
      message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá a movimentação permanentemente."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
