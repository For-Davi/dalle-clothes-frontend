<script setup lang="ts">
import { useDepartmentStore } from 'src/stores/department-store';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import type { Department } from 'src/ts/Department';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import { watch } from 'vue';

defineOptions({
  name: 'TableDepartment',
});

const props = defineProps<{
  mode: 'form' | 'list';
}>();
const emit = defineEmits<{
  'open:form-department': [string | null, Department | null];
}>();

const { loadingDepartment, treeDepartment} = storeToRefs(useDepartmentStore())

const searchDepartment = ref<string>('')
const selectedDepartment = ref<string>('');
const departmentEdit = ref<Department | null>(null);
const showConfirmAction = ref<boolean>(false)
const clickRootCreate = ref<string | null>(null);
const dataExcludeId = ref<string | null>(null);

const clear = () => {
  clickRootCreate.value = '';
  selectedDepartment.value = '';
  departmentEdit.value = null;
  searchDepartment.value = '';
  dataExcludeId.value = null;
};
const openFormDepartment = (key = null): void => {
  if (key) {
    clickRootCreate.value = key;
  }
  emit(
    'open:form-department',
    clickRootCreate.value, 
    departmentEdit.value
  )
};
const handleEdit = (department: Department) => {
    departmentEdit.value = department;
    openFormDepartment();
}
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useDepartmentStore().deleteDepartment(dataExcludeId.value ?? '');
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: string): void => {
  dataExcludeId.value = id;
  showConfirmAction.value = true;
};

watch(() => props.mode, async (mode) => {
  if(mode === 'list'){
    await useDepartmentStore().getDepartments();
  }
}, {immediate: true})
</script>
<template>
  <main class="q-pa-sm q-mb-md">
    <div class="row q-col-gutter-sm">
      <q-tree
        v-show="treeDepartment.length > 0"
        v-model:selected="selectedDepartment"
        :nodes="treeDepartment"
        :filter="searchDepartment"
        node-key="id"
        class="full-width"
      >
        <template v-slot:default-header="prop">
          <div class="row full-width wrap justify-between content-start">
            <div class="row items-center justify-center">
              <q-icon name="groups" color="black" size="22px" class="q-mr-sm" />
              <q-btn
                size="sm"
                flat
                rounded
                color="black"
                :disable="loadingDepartment"
                @click="handleEdit(prop.node)"
              >
                <span class="text-subtitle2">{{ prop.node.label }}</span>
              </q-btn>
            </div>
            <q-separator />
            <div class="row items-center justify-center">
              <q-btn
                @click="openFormDepartment(prop.key)"
                :label="!$q.screen.lt.sm ? 'Adicionar um sub-departamento' : ''"
                :disable="loadingDepartment"
                size="sm"
                rounded
                flat
                icon="add"
                unelevated
              />
              <q-btn
                @click="openConfirmAction(prop.node.id)"
                :disable="loadingDepartment"
                size="sm"
                flat
                rounded
                color="negative"
                icon="delete"
              />
            </div>
          </div>
        </template>
      </q-tree>
      <div v-show="treeDepartment.length == 0 && !loadingDepartment" class="q-pa-md full-width">
        <q-banner dense inline-actions class="text-white bg-red" rounded>
          Não há departamentos registrados. Por favor, adicione um novo departamento.
        </q-banner>
      </div>
    </div>
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão de departamento"
      message="Caso haja subdepartamentos vinculados, eles também serão excluídos. Caso tenha certeza de que deseja excluir o departamento, clique em 'Continuar'."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </main>
</template>
