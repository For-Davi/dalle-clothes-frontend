<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import TableDepartment from '../table/TableDepartment.vue';

defineOptions({
  name: 'DepartmentManage',
});

const $q = useQuasar();
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

onMounted(() => {
  clear();
});
</script>
<template>
  <section>
    <header
      :class="
        !$q.screen.lt.sm
          ? 'row justify-between no-wrap bg-grey-1'
          : 'column justify-between no-wrap bg-grey-1'
      "
    >
      <div :class="!$q.screen.lt.sm ? 'col-5' : 'col-12'">
        <TitlePage title="Gerenciamento de departamentos" icon="group_work"/>
      </div>
    </header>
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
  </section>
</template>

<style>
.teste {
  border: 1px solid black;
}
</style>
