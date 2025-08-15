<script setup lang="ts">
import { onMounted, ref } from 'vue';
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
}>();

const { loadingSchedule, listSchedule } = storeToRefs(useScheduleStore());

const showConfirmAction = ref<boolean>(false);
const showConfirmDateDifferent = ref<boolean>(false)
const showConfirmFinish = ref<boolean>(false)
const scheduleMonitoring = ref<number | null>(null);

const clear = (): void => {
  scheduleMonitoring.value = null;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useScheduleStore().deleteSchedule(scheduleMonitoring.value ?? 0);
  clear();
};
const closeConfirmDateDifferent = () => {
  showConfirmDateDifferent.value = false;
  clear()
}
const closeConfirmFinish = ():void => {
  showConfirmFinish.value = false;
  clear()
}
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  scheduleMonitoring.value = id;
  showConfirmAction.value = true;
};
const startFinishSchedule = (id: number,date:string): void => {
  scheduleMonitoring.value = id

  const today = new Date()
  const [day, month, year] = date.split('-')
  const scheduleDate = new Date(`${year}-${month}-${day}T00:00:00`)

  if(today.getMonth() === scheduleDate.getMonth() && today.getFullYear() === scheduleDate.getFullYear() ) {
    showConfirmFinish.value = true
  } else {
    showConfirmDateDifferent.value = true
  }
}
const startEdit = (id: number) => {
  emit('show:showFormSchedule', id);
};
const startExclude = (id: number) => {
  openConfirmAction(id);
};
const fetchSchedules = async (): Promise<void> => {
  await useScheduleStore().getSchedules();
};
const finishSchedule = async (close: 'date_schedule' | 'date_now') => {
  if(scheduleMonitoring.value) {
    const response = await useScheduleStore().showSchedule(scheduleMonitoring.value)

    if(response?.status === 200) {
      const schedule = response.data.schedule
      const formattedDate = schedule.date.replace(/-/g, '/');

      await useScheduleStore().finishSchedule({
        id: schedule.id,
        type: schedule.type,
        transactionCategoryID: schedule.transaction_category_id,
        description: schedule.description || null,
        date: formattedDate,
        value: schedule.value,
        close: close
      })

      showConfirmFinish.value = false;
      showConfirmDateDifferent.value = false;
      clear();
    }
  }
}

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
            @click="startFinishSchedule(props.row.id, props.row.date)"
            :disable="scheduleMonitoring === props.row.id"
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
     <ConfirmAction
      :open="showConfirmFinish"
      label-action="Continuar"
      title="Confirmação de finalização de agendamento"
      message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e finalizará o agendamento permanentemente."
      @update:open="closeConfirmFinish"
      @update:ok="finishSchedule('date_schedule')"
    />
      <ConfirmDateDifferentSchedule
      :open="showConfirmDateDifferent"
      label-action="Continuar"
      title="Confirmação de finalização de agendamento"
      message="O mês e ano atual difere do mês ou ano do agendamento, você deseja finalizar o agendamento com o mês e ano atual ou finalizar com a data padrão do agendamento?"
      @update:open="closeConfirmDateDifferent"
      @update:dateDefault="finishSchedule('date_schedule')"
      @update:dateChange="finishSchedule('date_now')"
    />
  </section>
</template>
