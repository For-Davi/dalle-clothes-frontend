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
  <section>
    <q-table
      class="q-mt-sm"
      :rows="loadingEmployee ? [] : listEmployee"
      :columns="columnsEmployee"
      :filter="props.filter"
      :loading="loadingEmployee"
      title="Lista de funcionários"
      row-key="index"
      no-data-label="Nenhum fornecedor para mostrar"
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
          <q-td key="name" :props="props" class="text-left">
            {{ props.row.name }}
          </q-td>
          <q-td key="email" :props="props" class="text-left">
            {{ props.row.email }}
          </q-td>
          <q-td key="department_name" :props="props" class="text-left">
            {{ props.row.department_name }}
          </q-td>
          <q-td key="has_login_access" :props="props" class="text-left">
            <q-icon
              :name="props.row.has_login_access === 1 ? 'check_circle' : 'close'"
              :color="props.row.has_login_access === 1 ? 'green' : 'red'"
              size="17px"
            />
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              v-if="props.row.has_login_access === 1"
              @click="startRemoveAccessLogin(props.row.id)"
              :disable="employeeMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="red"
              icon="key_off"
            >
              <q-tooltip>Remover acesso do sistema</q-tooltip>
            </q-btn>
            <q-btn
              v-else
              @click="openFormCreateAccessLogin(props.row.id)"
              :disable="employeeMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="green"
              icon="key"
            >
              <q-tooltip>Criar acesso do sistema</q-tooltip>
            </q-btn>
            <q-btn
              @click="startEdit(props.row.id)"
              :disable="employeeMonitoring === props.row.id"
              size="sm"
              flat
              round
              color="black"
              icon="edit"
            />
            <q-btn
              @click="startExclude(props.row.id)"
              :disable="employeeMonitoring === props.row.id"
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
      :label-action="dataConfirmAction.labelAction"
      :title="dataConfirmAction.title"
      :message="dataConfirmAction.message"
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>
