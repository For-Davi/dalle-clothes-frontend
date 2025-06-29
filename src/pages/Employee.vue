<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import DepartmentManage from 'src/components/manage/DepartmentManage.vue';
import { computed, reactive, ref } from 'vue';
import { useEmployeeStore } from 'src/stores/employee-store';
import FormEmployee from 'src/components/form/FormEmployee.vue';
import TableEmployee from 'src/components/table/TableEmployee.vue';
import FormAccessLogin from 'src/components/form/FormAccessLogin.vue';

defineOptions({
  name: 'Employee',
});

const filterEmployee = ref<string>('');
const showDepartmentManage = ref<boolean>(false);
const showFilterEmployee = ref<boolean>(false);
const showFormEmployee = reactive({
  open: false as boolean,
  employeeId: null as number | null,
});
const showFormAccessLogin = reactive({
  open: false as boolean,
  employeeId: null as number | null,
});
const filter = reactive<IFilterEmployee>({
  name: null,
  email: null,
  cpf: null,
  cnpj: null,
  sex: null,
  active: null,
  hasAccessLogin: null,
  departmentId: null,
});

const changeShowFormAccessLogin = (open: boolean, employeeId: number | null = null): void => {
  Object.assign(showFormAccessLogin, {
    open,
    employeeId,
  });
};
const changeShowFormEmployee = (open: boolean, employeeId: number | null = null): void => {
  Object.assign(showFormEmployee, {
    open,
    employeeId,
  });
};
const changeShowFilterEmployee = (): void => {
  showFilterEmployee.value = !showFilterEmployee.value;
};
const actionFilter = async (data: 'close' | IFilterEmployee): Promise<void> => {
  changeShowFilterEmployee();

  if (data !== 'close') {
    Object.assign(filter, {
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      cnpj: data.cnpj,
      sex: data.sex,
      active: data.active,
      hasAccessLogin: data.hasAccessLogin,
      departmentId: data.departmentId,
    });
    await useEmployeeStore().getEmployees(filter);
  }
};
const makeEdit = (id: number): void => {
  changeShowFormEmployee(true, id);
};
const makeCreateAccessLogin = (id: number): void => {
  changeShowFormAccessLogin(true, id);
};
const changeShowDepartmentManage = (): void => {
  showDepartmentManage.value = !showDepartmentManage.value;
};

const hasFilter = computed(() => {
  return (
    filter.name !== '' ||
    filter.email != '' ||
    filter.cpf != '' ||
    filter.cnpj != '' ||
    filter.sex !== null ||
    filter.active !== null ||
    filter.hasAccessLogin !== null ||
    filter.hasAccessLogin !== null
  );
});
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Funcionários" icon="badge" />
      <div>
        <q-btn
          color="white"
          text-color="black"
          label="Permissões"
          icon-right="rule"
          no-caps
          class="q-mr-sm"
        />
        <q-btn
          @click="changeShowDepartmentManage"
          color="white"
          text-color="black"
          label="Departamentos"
          icon-right="group_work"
          no-caps
          class="q-mr-sm"
        />
        <q-btn
          @click="changeShowFormEmployee(true)"
          color="white"
          text-color="black"
          label="Novo funcionário"
          icon-right="add"
          no-caps
          class="q-mr-sm"
        />
      </div>
    </section>
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm justify-end items-center">
          <q-input
            label="Pesquise"
            outlined
            v-model="filterEmployee"
            dense
            style="width: 200px"
            class="bg-white rounded-borders"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="20px" color="black" />
            </template>
          </q-input>
          <q-btn
            @click="changeShowFilterEmployee"
            round
            color="primary"
            icon="filter_alt"
            unelevated
            size="13px"
          >
            <q-badge v-show="hasFilter" floating color="red" rounded />
          </q-btn>
        </div>
      </q-banner>
      <TableEmployee
        :filter="filterEmployee"
        @show:show-form-employee="makeEdit"
        @show:show-form-access-login="makeCreateAccessLogin"
      />
    </section>

    <!-- Modals -->
    <DepartmentManage :open="showDepartmentManage" @update:open="changeShowDepartmentManage" />
    <FormEmployee :data="showFormEmployee" @update:open="changeShowFormEmployee(false)" />
    <FormAccessLogin :data="showFormAccessLogin" @update:open="changeShowFormAccessLogin(false)" />
    <FilterEmployee :open="showFilterEmployee" :filters="filter" @update:open="actionFilter" />
  </main>
</template>
