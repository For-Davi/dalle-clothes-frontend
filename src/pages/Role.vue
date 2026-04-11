<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoleStore } from 'src/stores/role-store';
import { storeToRefs } from 'pinia';
import FormRole from 'src/components/form/FormRole.vue';
import Loading from 'src/components/shared/Loading.vue';
import Empty from 'src/components/info/Empty.vue';

defineOptions({
  name: 'Role',
});

const { loadingRole, listRole } = storeToRefs(useRoleStore());

const search = ref<string>('');
const showFormRole = reactive<{
  open: boolean;
  roleId: number | null;
}>({
  open: false,
  roleId: null,
});
const confirmDelete = reactive<{
  open: boolean;
  roleId: number | null;
  roleName: string;
}>({
  open: false,
  roleId: null,
  roleName: '',
});

const filteredRoles = computed((): IRole[] => {
  if (!search.value.trim()) return listRole.value;
  const term = search.value.toLowerCase();
  return listRole.value.filter(
    (r) =>
      r.name.toLowerCase().includes(term) || (r.description ?? '').toLowerCase().includes(term),
  );
});

const changeShowFormRole = (show: boolean, roleId: number | null = null): void => {
  showFormRole.roleId = roleId;
  showFormRole.open = show;
};

const openDeleteConfirm = (role: IRole): void => {
  confirmDelete.roleId = role.id;
  confirmDelete.roleName = role.name;
  confirmDelete.open = true;
};

const closeDeleteConfirm = (): void => {
  confirmDelete.open = false;
  confirmDelete.roleId = null;
  confirmDelete.roleName = '';
};

const confirmDeleteRole = async (): Promise<void> => {
  if (confirmDelete.roleId) {
    await useRoleStore().deleteRole(confirmDelete.roleId);
  }
  closeDeleteConfirm();
};

const onFormClose = async (): Promise<void> => {
  changeShowFormRole(false);
};
const fetcheRoles = async (): Promise<void> => {
  await useRoleStore().getRoles();
};

onMounted(async () => {
  await fetcheRoles();
});
</script>
<template>
  <main class="q-pa-lg">
    <section class="row items-center justify-between">
      <TitlePage class="col-7" title="Permissões" icon="admin_panel_settings" />
      <div>
        <q-btn
          @click="changeShowFormRole(true)"
          color="primary"
          label="Nova permissão"
          icon-right="add"
          no-caps
          unelevated
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
        </div>
      </q-banner>

      <Loading :show="loadingRole" />

      <div v-show="!loadingRole">
        <Empty
          v-if="filteredRoles.length === 0"
          message="Sem permissões cadastradas"
          color="bg-red-3"
        />

        <div v-else class="row q-gutter-md">
          <q-card
            v-for="role in filteredRoles"
            :key="role.id"
            class="col-12 col-sm-5 col-md-3 bg-white"
            flat
            bordered
          >
            <q-card-section class="q-pb-xs">
              <div class="row items-center justify-between no-wrap">
                <div class="text-subtitle1 text-weight-bold ellipsis" style="max-width: 80%">
                  {{ role.name }}
                </div>
                <div class="row q-gutter-x-xs">
                  <q-btn
                    flat
                    round
                    dense
                    icon="edit"
                    color="primary"
                    size="sm"
                    @click="changeShowFormRole(true, role.id)"
                  >
                    <q-tooltip>Editar</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    color="negative"
                    size="sm"
                    @click="openDeleteConfirm(role)"
                  >
                    <q-tooltip>Excluir</q-tooltip>
                  </q-btn>
                </div>
              </div>
              <div
                v-if="role.description"
                class="text-caption text-grey-7 q-mt-xs"
                style="white-space: pre-line"
              >
                {{ role.description }}
              </div>
            </q-card-section>
            <q-card-section class="q-pt-xs">
              <div class="text-caption text-grey-6">
                {{ role.permissions.length }}
                {{ role.permissions.length === 1 ? 'permissão' : 'permissões' }} atribuída{{
                  role.permissions.length === 1 ? '' : 's'
                }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Form modal -->
    <FormRole :data="showFormRole" @update:open="onFormClose" />

    <!-- Confirm delete dialog -->
    <q-dialog v-model="confirmDelete.open">
      <q-card style="min-width: 320px">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">
            Deseja excluir a permissão <strong>{{ confirmDelete.roleName }}</strong
            >?
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="closeDeleteConfirm" no-caps />
          <q-btn
            unelevated
            label="Excluir"
            color="negative"
            @click="confirmDeleteRole"
            :loading="loadingRole"
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </main>
</template>
