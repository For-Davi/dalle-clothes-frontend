<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import { columnsSchedule } from 'src/utils/columns';
import { useScheduleStore } from 'src/stores/schedule-store';
import { formatToReal } from 'src/composables/Money';
import ConfirmDateDifferentSchedule from '../confirm/ConfirmDateDifferentSchedule.vue';

defineOptions({
  name: 'TableMovement',
});

const props = defineProps<{
  title: string;
}>();
const emit = defineEmits<{
  'show:showFormSchedule': [number];
  'show:showDescription': [string];
  newRequest: [void];
}>();

const { loadingSchedule, listSchedule } = storeToRefs(useScheduleStore());

const mode = ref<'finish' | 'exclude'>('finish');
const scheduleIsPeriodActual = ref<boolean>(false);
const showConfirmAction = ref<boolean>(false);
const showConfirmDateDifferent = ref<boolean>(false);
const scheduleMonitoring = ref<number | null>(null);

const clear = (): void => {
  scheduleMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  if (mode.value === 'exclude') {
    await useScheduleStore().deleteSchedule(scheduleMonitoring.value ?? 0);
    clear();
  } else {
    await finishSchedule(scheduleIsPeriodActual.value ? 'dateNow' : 'dateSchedule');
  }
  emit('newRequest');
};
const closeConfirmDateDifferent = () => {
  showConfirmDateDifferent.value = false;
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
const startFinishSchedule = (id: number, date: string): void => {
  scheduleMonitoring.value = id;
  mode.value = 'finish';

  const today = new Date();
  const [day, month, year] = date.split('-');
  const scheduleDate = new Date(`${year}-${month}-${day}T00:00:00`);

  const isPeriodActual =
    today.getMonth() === scheduleDate.getMonth() &&
    today.getFullYear() === scheduleDate.getFullYear();

  if (isPeriodActual) {
    showConfirmAction.value = true;
    scheduleIsPeriodActual.value = true;
  } else {
    showConfirmDateDifferent.value = true;
    scheduleIsPeriodActual.value = false;
  }
};
const startEdit = (id: number) => {
  emit('show:showFormSchedule', id);
};
const startExclude = (id: number) => {
  mode.value = 'exclude';
  openConfirmAction(id);
};
const fetchSchedules = async (): Promise<void> => {
  await useScheduleStore().getSchedules();
};
const finishSchedule = async (close: 'dateSchedule' | 'dateNow') => {
  showConfirmAction.value = false;
  showConfirmDateDifferent.value = false;

  if (scheduleMonitoring.value) {
    const response = await useScheduleStore().showSchedule(scheduleMonitoring.value);

    if (response?.status === 200) {
      const schedule = response.data.schedule;
      await useScheduleStore().finishSchedule({
        scheduleID: schedule.id,
        close: close,
      });
      clear();
      emit('newRequest');
    }
  }
};

const getTitleConfirmAction = computed((): string => {
  return mode.value === 'exclude'
    ? 'Confirmação de exclusão de agendamento'
    : 'Confirmação de finalização de agendamento';
});
const getMessageConfirmAction = computed((): string => {
  return mode.value === 'exclude'
    ? "Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá o agendamento permanentemente"
    : "Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e finalizará o agendamento permanentemente.";
});

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
              v-if="hasPermission('transaction.update')"
              @click="startFinishSchedule(props.row.id, props.row.date)"
              :disable="scheduleMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="green"
              icon="check_circle"
            >
              <q-tooltip>Finalizar agendamento</q-tooltip>
            </q-btn>
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
              v-if="hasPermission('transaction.update')"
              @click="startEdit(props.row.id)"
              :disable="scheduleMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="black"
              icon="edit"
            />
            <q-btn
              v-if="hasPermission('transaction.delete')"
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
      :title="getTitleConfirmAction"
      :message="getMessageConfirmAction"
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
    <ConfirmDateDifferentSchedule
      :open="showConfirmDateDifferent"
      label-action="Continuar"
      title="Confirmação de finalização de agendamento"
      message="O mês e ano atual difere do mês ou ano do agendamento, você deseja finalizar o agendamento com o mês e ano atual ou finalizar com a data do agendamento?"
      @update:open="closeConfirmDateDifferent"
      @update:dateDefault="finishSchedule('dateSchedule')"
      @update:dateChange="finishSchedule('dateNow')"
    />
  </section>
</template>
