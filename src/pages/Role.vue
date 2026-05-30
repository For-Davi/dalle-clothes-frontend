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

const { loadingRole, listRole, listRoleSelect } = storeToRefs(useRoleStore());

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
  newRoleId: number | null;
  roleName: string;
}>({
  open: false,
  roleId: null,
  newRoleId: null,
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

const rolesSelectFiltered = computed((): IRoleSelect[] =>
  listRoleSelect.value.filter((r) => r.id !== confirmDelete.roleId),
);

const openDeleteConfirm = async (role: IRole): Promise<void> => {
  confirmDelete.roleId = role.id;
  confirmDelete.roleName = role.name;
  confirmDelete.open = true;
  await useRoleStore().getRolesSelect();
};

const closeDeleteConfirm = (): void => {
  confirmDelete.open = false;
  confirmDelete.roleId = null;
  confirmDelete.newRoleId = null;
  confirmDelete.roleName = '';
};

const confirmDeleteRole = async (): Promise<void> => {
  if (confirmDelete.roleId && confirmDelete.newRoleId) {
    await useRoleStore().deleteRole(confirmDelete.roleId, confirmDelete.newRoleId);
  }
  closeDeleteConfirm();
};

const onFormClose = () => {
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
    <section class="page-header q-mb-xs">
      <TitlePage title="Permissões" icon="admin_panel_settings" />
      <div class="page-header-actions">
        <q-btn
          v-if="hasPermission('role.create')"
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
            class="search-input bg-white rounded-borders"
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
                    v-if="hasPermission('role.update')"
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
                    v-if="hasPermission('role.delete')"
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
                class="text-caption text-grey-7 q-mt-xs ellipsis"
                style="white-space: pre-line; max-width: 100%"
              >
                {{ role.description }}
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                  class="bg-grey-9"
                >
                  {{ role.description }}
                </q-tooltip>
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
    <q-dialog v-model="confirmDelete.open" persistent>
      <q-card style="min-width: 360px">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">
            Deseja excluir a permissão <strong>{{ confirmDelete.roleName }}</strong
            >?
          </span>
        </q-card-section>
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">
            Selecione a permissão que será atribuída aos usuários que possuem esta permissão:
          </div>
          <q-select
            v-model="confirmDelete.newRoleId"
            :options="rolesSelectFiltered"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            outlined
            dense
            label="Nova permissão"
            :loading="loadingRole"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="closeDeleteConfirm" no-caps />
          <q-btn
            unelevated
            label="Excluir"
            color="negative"
            @click="confirmDeleteRole"
            :loading="loadingRole"
            :disable="!confirmDelete.newRoleId"
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </main>
</template>
