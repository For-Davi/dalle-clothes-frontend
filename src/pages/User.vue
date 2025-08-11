<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, ref } from 'vue';
import DepartmentManage from 'src/components/manage/DepartmentManage.vue';
import TableUserSystem from 'src/components/table/TableUserSystem.vue';
import FormUser from 'src/components/form/FormUser.vue';
import FilterUser from 'src/components/filter/FilterUser.vue';
import { useUserStore } from 'src/stores/user-store';

defineOptions({
  name: 'User',
});

const search = ref<string>('');
const filter = reactive<IFilterUser>({
  name: '',
  email: '',
  role: null as number | null,
  department: null as number | null,
  active: null as number | null,
});
const showManageDepartment = ref<boolean>(false);
const showFilterUser = ref<boolean>(false);
const showFormUser = reactive<{
  open: boolean;
  userId: number | null;
}>({
  open: false,
  userId: null,
});

const changeShowDepartmentManage = (): void => {
  showManageDepartment.value = !showManageDepartment.value;
  console.log('chegou')
};
const changeShowFilterUser = (): void => {
  showFilterUser.value = !showFilterUser.value;
};
const changeShowFormUser = (show: boolean, userId: number | null = null): void => {
  showFormUser.userId = userId;
  showFormUser.open = show;
};
const startEditUser = (id: number): void => {
  changeShowFormUser(true, id);
};
const actionFilter = async (data: 'close' | IFilterUser): Promise<void> => {
  changeShowFilterUser();

  if (data !== 'close') {
    Object.assign(filter, {
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      active: data.active,
    });
    await useUserStore().getUsers(filter);
  }
};

const hasFilter = computed((): boolean => {
  return (
    filter.name !== '' ||
    filter.email != '' ||
    filter.department !== null ||
    filter.role !== null ||
    filter.active !== null
  );
});
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Usuários" icon="person" />
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
          @click="showManageDepartment = true"
          color="white"
          text-color="black"
          label="Departamentos"
          icon-right="group_work"
          no-caps
          class="q-mr-sm"
        />
        <q-btn
          @click="changeShowFormUser(true)"
          color="white"
          text-color="black"
          label="Novo usuário"
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
            v-model="search"
            dense
            style="width: 200px"
            class="bg-white rounded-borders"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="20px" color="black" />
            </template>
          </q-input>
          <q-btn
            @click="changeShowFilterUser"
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
      <TableUserSystem :filter="search" @show:show-form-user="startEditUser" />
    </section>

    <!-- Modals -->
    <DepartmentManage :open="showManageDepartment" @update:open="changeShowDepartmentManage" />
    <FormUser :data="showFormUser" @update:open="changeShowFormUser(false)" />
    <FilterUser :open="showFilterUser" :filters="filter" @update:open="actionFilter" />
  </main>
</template>
