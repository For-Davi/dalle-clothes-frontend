<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, ref, watch, reactive } from 'vue';
import TreeDepartment from '../tree/TreeDepartment.vue';
import FormDepartment from '../form/FormDepartment.vue';
import { useDepartmentStore } from 'src/stores/department-store';
import { storeToRefs } from 'pinia';
import Empty from '../info/Empty.vue';
import Loading from '../shared/Loading.vue';

defineOptions({
  name: 'DepartmentManage',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingDepartment, treeDepartment } = storeToRefs(useDepartmentStore())

const showFormDepartament = reactive<{
   open:boolean,
  departmentEdit: IDepartment | null,
  rootCreate: number | null,
  excludeId: number | null
}>({
  open: false,
  departmentEdit: null,
  rootCreate: null,
  excludeId: null
});

const searchDepartment = ref<string>('');
const clickRootCreate = ref<number | null>(null);

const clear = () => {
  clickRootCreate.value = null;
  searchDepartment.value = '';
};

const changeShowFormDepartament = (
  show:boolean,
  departmentEdit: IDepartment | null = null,
  rootCreate: number | null = null,
  excludeId: number | null = null
): void => {
  Object.assign(showFormDepartament, {
    open: show,
    departmentEdit: departmentEdit,
    rootCreate: rootCreate,
    excludeId: excludeId
  });

  reset()
}

 const startEdit = ( rootCreate: number | null,departmentEdit: IDepartment | null,excludeId: number | null) => {
   changeShowFormDepartament(true, departmentEdit, rootCreate, excludeId );
 };

 const reset = (): void => {
  clear();
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 sub-page column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de departamentos" icon="group_work" />
      </q-card-section>
     <q-card-section>
  <div v-show="!loadingDepartment">
    <TreeDepartment
      v-show="treeDepartment.length > 0"
      @open:form-department="startEdit"
    />
    <Empty
      v-show="treeDepartment.length <= 0 && !loadingDepartment"
      message="Sem departamentos cadastrados"
      color="bg-red-3"
    />
  </div>
  <Loading :show="loadingDepartment" />
</q-card-section>

      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
            <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            flat
            no-caps
          />
          <q-btn
            color="primary"
            label="Adicionar"
            size="md"
            @click="changeShowFormDepartament(true)"
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Modals -->
   <FormDepartment 
   :open="showFormDepartament.open"
   :key-root="showFormDepartament.rootCreate"
   :department-edit="showFormDepartament.departmentEdit"
    @update:back-list="changeShowFormDepartament(false)"
   />
</template>
