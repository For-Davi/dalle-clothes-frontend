<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, onMounted, ref } from 'vue';
import TreeDepartment from '../tree/TreeDepartment.vue';
import FormDepartment from '../form/FormDepartment.vue';

defineOptions({
  name: 'DepartmentManage',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const tab = ref<'list' | 'form'>('list');
const searchDepartment = ref<string>('');
const clickRootCreate = ref<number | null>(null);
const departmentEdit = ref<IDepartment | null>(null);
const dataExcludeId = ref<number | null>(null);

const clear = () => {
  clickRootCreate.value = null;
  departmentEdit.value = null;
  searchDepartment.value = '';
  dataExcludeId.value = null;
};

const makeForm = (rootCreate: number | null, dataEdit: IDepartment | null) => {
  clickRootCreate.value = rootCreate;
  departmentEdit.value = dataEdit;
  tab.value = 'form';
};
const reset = (): void => {
  clear();
  tab.value = 'list';
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

onMounted(() => {
  clear();
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 sub-page">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de departamentos" icon="group_work" />
      </q-card-section>
      <q-card-section>
        <q-scroll-area style="height: 400px">
          <q-tabs v-model="tab" dense align="left" inline-label :breakpoint="0" no-caps>
            <q-tab
              label="Departamentos"
              name="list"
              :class="tab == 'list' ? 'text-primary' : 'text-grey'"
              icon="list"
              @click.prevent.stop
            />
            <q-tab
              label="Formulário"
              name="form"
              :class="tab == 'form' ? 'text-primary' : 'text-grey'"
              icon="assignment"
              @click.prevent.stop
            />
          </q-tabs>
          <q-tab-panels v-model="tab" animated class="q-pa-none">
            <q-tab-panel name="list" class="q-px-none q-py-sm border-top-grey-light bg-grey-2">
              <TreeDepartment :mode="tab" @open:form-department="makeForm" />
            </q-tab-panel>
            <q-tab-panel name="form" class="q-px-none q-py-sm border-top-grey-light bg-grey-2">
              <FormDepartment
                :mode="tab"
                :department-edit="departmentEdit"
                :key-root="clickRootCreate"
                @update:back-list="reset"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn color="red" label="Fechar" size="md" @click="open = false" unelevated no-caps />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
