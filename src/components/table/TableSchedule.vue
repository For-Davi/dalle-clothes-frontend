<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import { columnsSchedule } from 'src/utils/columns';
import { useScheduleStore } from 'src/stores/schedule-store';
import { formatToReal } from 'src/composables/Money';

defineOptions({
  name: 'TableMovement',
});

const props = defineProps<{
  title: string;
}>();
const emit = defineEmits<{
  'show:showFormSchedule': [number];
  'show:showDescription': [string];
}>();

const { loadingSchedule, listSchedule } = storeToRefs(useScheduleStore());

const showConfirmAction = ref<boolean>(false);
const scheduleMonitoring = ref<number | null>(null);

const clear = (): void => {
  scheduleMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useScheduleStore().deleteSchedule(scheduleMonitoring.value ?? 0);
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  scheduleMonitoring.value = id;
  showConfirmAction.value = true;
};
const startEdit = (id: number) => {
  emit('show:showFormSchedule', id);
};
const startExclude = (id: number) => {
  openConfirmAction(id);
};
const fetchSchedules = async (): Promise<void> => {
  await useScheduleStore().getSchedules();
};

onMounted(async () => {
  await fetchSchedules();
});
</script>
<template>
  <section>
    <q-table
      :rows="loadingSchedule ? [] : listSchedule"
      :columns="columnsSchedule"
      :loading="loadingSchedule"
      :title="props.title"
      title-class="bg-primary q-px-sm rounded-borders text-white"
      row-key="index"
      no-data-label="Nenhum agendamento para mostrar"
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
            {{ props.row.date.replace(/-/g, '/') }}
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
              :disable="scheduleMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="primary"
              icon="fa-solid fa-file-lines"
            >
              <q-tooltip>Descrição</q-tooltip>
            </q-btn>
            <q-btn
            size="sm"
            flat
            round
            color="black"
            icon="check">
             <q-tooltip>Finalizar agendamento</q-tooltip>
            </q-btn>
            <q-btn
              @click="startEdit(props.row.id)"
              :disable="scheduleMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="black"
              icon="edit"
            />
            <q-btn
              @click="startExclude(props.row.id)"
              :disable="scheduleMonitoring === props.row.id"
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
      title="Confirmação de exclusão de agendamento"
      message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá o agendamento permanentemente."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
