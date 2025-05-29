<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, onMounted, ref } from 'vue';
import TableDepartment from '../table/TableDepartment.vue';

defineOptions({
  name: 'DepartmentManage',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const tab = ref<'list' | 'form'>('list')
const searchDepartment = ref<string>('');
const clickRootCreate = ref<string | null>(null);
const departmentEdit = ref<IDepartment | null>(null);
const dataExcludeId = ref<string | null>(null);

const clear = () => {
  clickRootCreate.value = '';
  departmentEdit.value = null;
  searchDepartment.value = '';
  dataExcludeId.value = null;
};

const makeForm = (rootCreate: string | null, dataEdit: IDepartment | null) => {
  clickRootCreate.value = rootCreate
  departmentEdit.value = dataEdit
  tab.value = 'form'
}

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
        <TitlePage title="Gerenciamento de departamentos" icon="group_work"/>
      </q-card-section>
      <q-card-section>
        <q-scroll-area class="main-scroll">
            <q-tabs v-model="tab" dense align="center" inline-label :breakpoint="0" no-caps>
                <q-tab
                    name="list"
                    :class="tab == 'list' ? 'text-primary' : 'text-grey'"
                    icon="list"
                    @click.prevent.stop
                />
                <q-tab
                    name="form"
                    :class="tab == 'form' ? 'text-primary' : 'text-grey'"
                    icon="assignment"
                    @click.prevent.stop
                />
            </q-tabs>
            <q-tab-panels v-model="tab" animated class="q-pa-none">
            <q-tab-panel name="list" class="q-px-md q-py-sm border-top-grey-light bg-grey-1">
              <TableDepartment :mode="tab" @open:form-department="makeForm"/>
            </q-tab-panel>
            <q-tab-panel name="form" class="q-px-md q-py-sm border-top-grey-light bg-grey-1">
              <FormDepartment />
            </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
