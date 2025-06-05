<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { columnsUser } from 'src/utils/columns';
import { storeToRefs } from 'pinia';
import { useUserStore } from 'src/stores/user-store';

defineOptions({
  name: 'TableUserSystem',
});

const { loadingUser, listUserSystem } = storeToRefs(useUserStore());
const { getUsers, deleteUser } = useUserStore();

const filterUser = ref<string>('');

const fetchUsers = async (): Promise<void> => {
  await getUsers();
};

onMounted(async () => {
  await fetchUsers();
});
</script>
<template>
  <q-table
    :rows="listUserSystem"
    :columns="columnsUser"
    :filter="filterUser"
    :loading="loadingUser"
    title="Lista de usuários"
    row-key="index"
    no-data-label="Nenhum usuário para mostrar"
    virtual-scroll
    :rows-per-page-options="[10]"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-h5">
          <span class="text-body2 text-bold">{{ col.label }}</span>
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props" class="cursor-pointer">
        <q-td key="name" :props="props" class="text-left">
          {{ props.row.name }}
        </q-td>
        <q-td key="email" :props="props" class="text-left">
          {{ props.row.email }}
        </q-td>
        <q-td key="role_name" :props="props" class="text-left">
          {{ props.row.role_name }}
        </q-td>
        <q-td key="department_name" :props="props" class="text-left">
          {{ props.row.department_name }}
        </q-td>
        <q-td key="active" :props="props" class="text-left">
          <q-icon
            :name="props.row.active === 1 ? 'check_circle' : 'close'"
            :color="props.row.active === 1 ? 'green' : 'red'"
            size="17px"
          />
        </q-td>
        <q-td key="action" :props="props">
          <q-btn :disable="false" size="sm" flat round color="black" icon="edit" />
          <q-btn :disable="false" size="sm" flat round color="red" icon="delete" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>
