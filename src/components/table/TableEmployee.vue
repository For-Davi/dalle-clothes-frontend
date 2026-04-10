<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { columnsEmployee } from 'src/utils/columns';
import { storeToRefs } from 'pinia';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import { useEmployeeStore } from 'src/stores/employee-store';

defineOptions({
  name: 'TableEmployee',
});
const props = withDefaults(
  defineProps<{
    filter?: string;
  }>(),
  {
    filter: '',
  },
);
const emit = defineEmits<{
  'show:showFormEmployee': [number];
  'show:showFormAccessLogin': [number];
}>();

const { loadingEmployee, listEmployee } = storeToRefs(useEmployeeStore());

const showConfirmAction = ref<boolean>(false);
const employeeMonitoring = ref<number | null>(null);
const dataConfirmAction = reactive({
  labelAction: '' as string,
  title: '' as string,
  message: '' as string,
  mode: null as string | null,
});

const clear = (): void => {
  employeeMonitoring.value = null;
  Object.assign(dataConfirmAction, {
    labelAction: '',
    title: '',
    message: '',
    mode: null,
  });
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  if (dataConfirmAction.mode === 'excludeUser') {
    await useEmployeeStore().deleteEmployee(employeeMonitoring.value ?? 0);
  }
  if (dataConfirmAction.mode === 'removeAccessLogin') {
    await useEmployeeStore().removeAccessLogin(employeeMonitoring.value ?? 0);
  }
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  employeeMonitoring.value = id;
  showConfirmAction.value = true;
};
const openFormCreateAccessLogin = (id: number): void => {
  emit('show:showFormAccessLogin', id);
};
const startEdit = (id: number) => {
  emit('show:showFormEmployee', id);
};
const startRemoveAccessLogin = (id: number) => {
  Object.assign(dataConfirmAction, {
    labelAction: 'Continuar',
    title: 'Confirmação de remoção de acesso ao sistema',
    message:
      "Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá o acesso do funcionário ao sistema.",
    mode: 'removeAccessLogin',
  });
  openConfirmAction(id);
};
const startExclude = (id: number) => {
  Object.assign(dataConfirmAction, {
    labelAction: 'Continuar',
    title: 'Confirmação de exclusão de funcionário',
    message:
      "Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá o funcionário permanentemente.",
    mode: 'excludeUser',
  });
  openConfirmAction(id);
};
const fetchEmployees = async (): Promise<void> => {
  await useEmployeeStore().getEmployees();
};

onMounted(async () => {
  await fetchEmployees();
});
</script>
<template>
  <section class="q-py-sm">
    <q-table
      grid
      :rows="loadingEmployee ? [] : listEmployee"
      :columns="columnsEmployee"
      :filter="props.filter"
      :loading="loadingEmployee"
      row-key="id"
      card-container-class="row q-col-gutter-md"
      no-data-label="Nenhum funcionário para mostrar"
      :rows-per-page-options="[0]"
    >
      <template v-slot:item="props">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-card class="employee-card" flat bordered>
            <q-card-section class="text-center q-pb-none">
              <q-avatar
                size="80px"
                font-size="32px"
                color="primary"
                text-color="white"
                class="shadow-2"
              >
                {{ props.row.name.charAt(0).toUpperCase() }}
              </q-avatar>

              <div class="text-h6 q-mt-md">{{ props.row.name }}</div>
              <div class="text-caption text-grey-7">{{ props.row.email }}</div>
            </q-card-section>

            <q-card-section>
              <div class="row items-center q-mb-xs">
                <q-icon name="group_work" color="primary" size="xs" class="q-mr-sm" />
                <div class="text-grey-8">{{ props.row.department_name ?? 'Sem departamento' }}</div>
              </div>

              <q-separator inset class="q-my-sm" />

              <div class="row justify-between items-center">
                <q-chip
                  dense
                  :color="props.row.has_login_access === 1 ? 'blue-1' : 'grey-3'"
                  :text-color="props.row.has_login_access === 1 ? 'blue-9' : 'grey-7'"
                  :icon="props.row.has_login_access === 1 ? 'key' : 'key_off'"
                >
                  {{ props.row.has_login_access === 1 ? 'Com acesso' : 'Sem acesso' }}
                </q-chip>

                <div class="row">
                  <q-btn
                    v-if="props.row.has_login_access === 1"
                    flat
                    round
                    color="orange"
                    icon="key_off"
                    size="sm"
                    :disable="employeeMonitoring === props.row.id"
                    @click="startRemoveAccessLogin(props.row.id)"
                  >
                    <q-tooltip>Remover acesso do sistema</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-else
                    flat
                    round
                    color="green"
                    icon="key"
                    size="sm"
                    :disable="employeeMonitoring === props.row.id"
                    @click="openFormCreateAccessLogin(props.row.id)"
                  >
                    <q-tooltip>Criar acesso do sistema</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="edit"
                    size="sm"
                    :disable="employeeMonitoring === props.row.id"
                    @click="startEdit(props.row.id)"
                  >
                    <q-tooltip>Editar Funcionário</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete"
                    size="sm"
                    :disable="employeeMonitoring === props.row.id"
                    @click="startExclude(props.row.id)"
                  >
                    <q-tooltip>Excluir Funcionário</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>

    <ConfirmAction
      :open="showConfirmAction"
      :label-action="dataConfirmAction.labelAction"
      :title="dataConfirmAction.title"
      :message="dataConfirmAction.message"
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>

<style scoped lang="scss">
.employee-card {
  border-radius: 12px;
}
</style>
