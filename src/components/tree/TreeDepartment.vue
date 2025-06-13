<script setup lang="ts">
import { useDepartmentStore } from 'src/stores/department-store';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import { watch } from 'vue';
import Loading from '../shared/Loading.vue';
import Banner from '../shared/Banner.vue';

defineOptions({
  name: 'TreeDepartment',
});

const props = defineProps<{
  mode: 'form' | 'list';
}>();
const emit = defineEmits<{
  'open:form-department': [number | null, IDepartment | null];
}>();

const { loadingDepartment, treeDepartment } = storeToRefs(useDepartmentStore());

const searchDepartment = ref<string>('');
const departmentEdit = ref<IDepartment | null>(null);
const showConfirmAction = ref<boolean>(false);
const clickRootCreate = ref<number | null>(null);
const dataExcludeId = ref<number | null>(null);

const clear = () => {
  clickRootCreate.value = null;
  departmentEdit.value = null;
  searchDepartment.value = '';
  dataExcludeId.value = null;
};
const openFormDepartment = (key = null): void => {
  if (key) {
    clickRootCreate.value = key;
  }
  emit('open:form-department', clickRootCreate.value, departmentEdit.value);
};
const handleEdit = (department: IDepartment) => {
  departmentEdit.value = department;
  openFormDepartment();
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await useDepartmentStore().deleteDepartment(dataExcludeId.value ?? 0);
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: number): void => {
  dataExcludeId.value = id;
  showConfirmAction.value = true;
};

watch(
  () => props.mode,
  async (mode) => {
    if (mode === 'list') {
      await useDepartmentStore().getDepartments();
    }
  },
  { immediate: true },
);
</script>
<template>
  <main style="min-height: 300px">
    <div class="row items-center justify-center">
      <div
        v-show="treeDepartment.length > 0 && !loadingDepartment"
        class="row items-center justify-end full-width"
      >
        <q-input
          label="Pesquise"
          outlined
          v-model="searchDepartment"
          dense
          style="width: 200px"
          class="rounded-borders"
          :disable="loadingDepartment"
        >
          <template v-slot:prepend>
            <q-icon name="search" size="20px" color="black" />
          </template>
        </q-input>
      </div>
      <div
        v-show="treeDepartment.length > 0 && !loadingDepartment"
        style="width: 100%; overflow-x: auto"
        class="q-pa-sm q-mt-sm border-grey-light"
      >
        <q-tree
          :nodes="treeDepartment"
          :filter="searchDepartment"
          node-key="id"
          class="full-width"
          style="min-width: max-content"
        >
          <template v-slot:default-header="prop">
            <div class="row full-width wrap justify-between content-start">
              <div class="row items-center justify-center">
                <q-icon name="groups" color="black" size="16px" class="q-mr-sm" />
                <span>{{ prop.node.label }}</span>
              </div>
              <q-separator />
              <div class="row items-center justify-center">
                <q-btn
                  @click="openFormDepartment(prop.key)"
                  :disable="loadingDepartment"
                  size="sm"
                  round
                  color="primary"
                  flat
                  icon="add"
                  unelevated
                >
                  <q-tooltip>Sub-departamento</q-tooltip>
                </q-btn>
                <q-btn
                  @click="handleEdit(prop.node)"
                  :disable="loadingDepartment"
                  size="10px"
                  flat
                  round
                  icon="edit"
                />
                <q-btn
                  @click="openConfirmAction(prop.node.id)"
                  :disable="loadingDepartment"
                  size="10px"
                  flat
                  round
                  color="negative"
                  icon="delete"
                />
              </div>
            </div>
          </template>
        </q-tree>
      </div>
      <div v-show="treeDepartment.length == 0 && !loadingDepartment" class="q-pa-md full-width">
        <Banner
          text="Não há departamentos registrados. Por favor, adicione um novo departamento."
        />
      </div>
    </div>
    <Loading :show="loadingDepartment" />
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
