<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import DepartmentManage from 'src/components/manage/DepartmentManage.vue';
import { computed, reactive, ref } from 'vue';
import { useEmployeeStore } from 'src/stores/employee-store';
import FormEmployee from 'src/components/form/FormEmployee.vue';
import TableEmployee from 'src/components/table/TableEmployee.vue';
import FormAccessLogin from 'src/components/form/FormAccessLogin.vue';
import FilterEmployee from 'src/components/filter/FilterEmployee.vue';
import { storeToRefs } from 'pinia';
import SubscriptionBanner from 'src/components/banner/SubscriptionBanner.vue';
import { checkRegisterLimit } from 'src/composables/Plans';

defineOptions({
  name: 'Employee',
});

const { listEmployee } = storeToRefs(useEmployeeStore());

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
  name: '',
  email: '',
  cpf: '',
  cnpj: '',
  sex: null,
  active: null,
  hasLoginAccess: null,
  department: null,
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
      hasLoginAccess: data.hasLoginAccess,
      department: data.department,
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

const planValidation = computed(() => {
  return checkRegisterLimit('employees', listEmployee.value.length);
});
const hasFilter = computed(() => {
  return (
    filter.name !== '' ||
    filter.email != '' ||
    filter.cpf != '' ||
    filter.cnpj != '' ||
    filter.sex !== null ||
    filter.active !== null ||
    filter.hasLoginAccess !== null ||
    filter.department !== null
  );
});
</script>
<template>
  <main class="q-pa-lg">
    <section class="page-header q-mb-xs">
      <TitlePage title="Funcionários" icon="badge" />
      <div class="page-header-actions">
        <q-btn
          v-if="hasPermission('department.view')"
          @click="changeShowDepartmentManage"
          color="white"
          text-color="black"
          label="Departamentos"
          icon-right="group_work"
          no-caps
        />
        <q-btn
          v-if="hasPermission('employee.create') && planValidation.canAdd"
          @click="changeShowFormEmployee(true)"
          color="white"
          text-color="black"
          label="Novo funcionário"
          icon-right="add"
          no-caps
        />
      </div>
    </section>
    <SubscriptionBanner v-if="planValidation.showUpgradeBanner" resource-name="funcionários" />
    <section class="q-mt-sm">
      <q-banner rounded class="bg-grey-4 q-mb-sm">
        <div class="row q-gutter-x-sm justify-end items-center">
          <q-input
            label="Pesquise"
            outlined
            v-model="filterEmployee"
            dense
            class="search-input bg-white rounded-borders"
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
