<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { reactive, ref } from 'vue';
import DepartmentManage from 'src/components/manage/DepartmentManage.vue';
import TableUserSystem from 'src/components/table/TableUserSystem.vue';
import FormUser from 'src/components/form/FormUser.vue';

defineOptions({
  name: 'User',
});

const filterUser = ref<string>('');
const showManageDepartment = ref<boolean>(false);
const showFormUser = reactive<{
  open: boolean;
  userId: number | null;
}>({
  open: false,
  userId: null,
});

const changeShowDepartmentManage = (): void => {
  showManageDepartment.value = !showManageDepartment.value;
};
const changeShowFormUser = (show: boolean, userId: number | null = null): void => {
  showFormUser.userId = userId;
  showFormUser.open = show;
};
const startEditUser = (id: number): void => {
  changeShowFormUser(true, id);
};
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
          @click="changeShowDepartmentManage"
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
            v-model="filterUser"
            dense
            style="width: 200px"
            class="bg-white rounded-borders"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="20px" color="black" />
            </template>
          </q-input>
          <q-btn round color="primary" icon="filter_alt" unelevated size="13px">
            <q-badge floating color="red" rounded />
          </q-btn>
        </div>
      </q-banner>
      <TableUserSystem :filter="filterUser" @show:show-form-user="startEditUser" />
    </section>
    <DepartmentManage :open="showManageDepartment" @update:open="changeShowDepartmentManage" />
    <FormUser :data="showFormUser" @update:open="changeShowFormUser(false)" />
  </main>
</template>
