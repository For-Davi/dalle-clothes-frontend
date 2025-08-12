<!-- eslint-disable @typescript-eslint/no-redundant-type-constituents -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { watch, reactive, ref, computed } from 'vue';
import { checkDataDepartment } from 'src/composables/CheckData';
import { useDepartmentStore } from 'src/stores/department-store';
import { storeToRefs } from 'pinia';
import { createErrorData } from 'src/composables/CreateNotify';
import TitlePage from '../shared/TitlePage.vue';
import DepartmentChoose from '../shared/DepartmentChoose.vue';

defineOptions({
  name: 'FormDepartment',
});

const props = defineProps<{
  open: boolean;
  keyRoot: number | null;
  departmentEdit: IDepartment | { id: number; label: string } | null;
}>();
const emit = defineEmits<{
  'update:back-list': [void];
}>();

const { loadingDepartment, treeDepartment } = storeToRefs(useDepartmentStore());

const selectedBank = ref<string | null>(null);
const showDepartmentChoose = ref<boolean>(false);
const dataDepartment = reactive<IDataDepartment>({
  name: '' as string,
  parent: null as number | null,
  parentName: null,
});

const clear = (): void => {
  Object.assign(dataDepartment, {
    name: '',
    parent: null,
    parentName: null,
  });
};
const save = async () => {
  const check = checkDataDepartment(dataDepartment);
  if (check.status) {
    const response = await useDepartmentStore().createDepartment(
      dataDepartment.name,
      dataDepartment.parent ?? null,
    );

    if (response?.status === 201) {
      emit('update:back-list');
      clear();
    }
  } else {
    createErrorData(check.message!);
  }
};
const update = async (): Promise<void> => {
  const response = await useDepartmentStore().updateDepartment(
    props.departmentEdit?.id ?? 0,
    dataDepartment.name,
    dataDepartment.parent ?? null,
  );

  if (response?.status === 200) {
    emit('update:back-list');
    clear();
  }
};
const findItemById = (
  array: any[],
  id: number,
  parent: any = null,
): { item: any | null; parent: any | null } => {
  for (const item of array) {
    if (item.id === id) {
      return { item, parent };
    }
    if (item.children) {
      const found = findItemById(item.children, id, item);
      if (found.item) {
        return found;
      }
    }
  }
  return { item: null, parent: null };
};
const checkEditDepartment = () => {
  if (props.departmentEdit != null) {
    const { item, parent } = findItemById(treeDepartment.value, props.departmentEdit.id ?? 0);

    Object.assign(dataDepartment, {
      name: item.label,
      parent: parent ? parent.id : null,
      parentName: parent ? parent.label : null,
    });
  }
};
const checkCreateWithDepartment = () => {
  if (props.keyRoot != null) {
    const item = findItemById(treeDepartment.value, props.keyRoot);
    if (item && item.item) {
      dataDepartment.parent = item.item.id;
      dataDepartment.parentName = item.item.label;
    }
  }
};
const openDepartmentChoose = (): void => {
  showDepartmentChoose.value = true;
};
const closeDepartmentChoose = (): void => {
  showDepartmentChoose.value = false;
};
const handleChooseDepartment = (tree: { id: number; label: string } | null): void => {
  dataDepartment.parent = tree === null ? null : tree.id;
  dataDepartment.parentName = tree === null ? null : tree.label;
  closeDepartmentChoose();
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:back-list'),
});

watch(
  () => props.departmentEdit,
  (newVal) => {
    if (newVal) {
      checkEditDepartment();
    } else {
      clear();
    }
  },
  { immediate: true },
);
watch(
  () => props.keyRoot,
  (newVal) => {
    if (newVal) {
      checkCreateWithDepartment();
    }
  },
  { immediate: true },
);
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2" flat bordered style="width: 500px; max-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="
            props.departmentEdit === null ? 'Cadastre um departamento' : 'Atualize um departamento'
          "
          icon="group_work"
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataDepartment.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Digite o nome do departamento"
            dense
            input-class="text-black"
            :readonly="selectedBank !== null"
          >
            <template v-slot:prepend>
              <q-icon name="groups" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataDepartment.parentName"
            bg-color="white"
            label-color="black"
            outlined
            type="text"
            label="Escolher hierarquia"
            readonly
            clearable
          >
            <template v-slot:append>
              <q-icon name="search" class="cursor-pointer" @click="openDepartmentChoose" />
            </template>
          </q-input>
          <DepartmentChoose
            :open="showDepartmentChoose"
            @update:open="closeDepartmentChoose"
            @update:choose-department="handleChooseDepartment"
          />
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn @click="open = false" color="red" label="Fechar" size="md" flat no-caps />
          <q-btn
            v-if="props.departmentEdit === null"
            @click="save"
            :loading="loadingDepartment"
            color="primary"
            label="Salvar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            :loading="loadingDepartment"
            color="primary"
            label="Atualizar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <DepartmentChoose
    :open="showDepartmentChoose"
    @update:open="closeDepartmentChoose"
    @update:choose-department="handleChooseDepartment"
  />
</template>
