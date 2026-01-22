<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { columnsUser } from 'src/utils/columns';
import { storeToRefs } from 'pinia';
import { useUserStore } from 'src/stores/user-store';
import ConfirmAction from '../confirm/ConfirmAction.vue';

defineOptions({
  name: 'ListUserSystem',
});

const props = withDefaults(
  defineProps<{
    filter?: string;
  }>(),
  {
    filter: '',
  },
);

const emit = defineEmits<{
  'show:showFormUser': [number];
}>();

const { loadingUser, listUserSystem } = storeToRefs(useUserStore());

const showConfirmAction = ref<boolean>(false);
const userMonitoring = ref<number | null>(null);

const clear = (): void => {
  userMonitoring.value = null;
};

const closeConfirmActionOk = async (deleteEmployee: number) => {
  showConfirmAction.value = false;
  await useUserStore().deleteUser(userMonitoring.value ?? 0, deleteEmployee);
  clear();
};

const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};

const openConfirmAction = (id: number): void => {
  userMonitoring.value = id;
  showConfirmAction.value = true;
};

const startEdit = (id: number) => {
  emit('show:showFormUser', id);
};

const startExclude = (id: number) => {
  openConfirmAction(id);
};

const fetchUsers = async (): Promise<void> => {
  await useUserStore().getUsers();
};

onMounted(async () => {
  await fetchUsers();
});
</script>
<template>
  <section class="q-py-sm">
    <q-table
      grid
      :rows="loadingUser ? [] : listUserSystem"
      :columns="columnsUser"
      :filter="props.filter"
      :loading="loadingUser"
      row-key="id"
      card-container-class="row q-col-gutter-md"
      no-data-label="Nenhum usuário para mostrar"
      :rows-per-page-options="[0]"
    >
      <template v-slot:item="props">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-card class="user-card" flat bordered>
            <span class="q-focus-helper"></span>

            <q-card-section class="text-center q-pb-none">
              <q-avatar
                size="80px"
                font-size="32px"
                color="primary"
                text-color="white"
                class="shadow-2"
              >
                {{ props.row.name.charAt(0).toUpperCase() }}
              </q-avatar>

              <div class="text-h6 q-mt-md">{{ props.row.name }}</div>
              <div class="text-caption text-grey-7">{{ props.row.email }}</div>
            </q-card-section>

            <q-card-section>
              <div class="row items-center q-mb-xs">
                <q-icon name="badge" color="primary" size="xs" class="q-mr-sm" />
                <div class="text-weight-medium">{{ props.row.role_name }}</div>
              </div>

              <div class="row items-center q-mb-sm">
                <q-icon name="business" color="secondary" size="xs" class="q-mr-sm" />
                <div class="text-grey-8">{{ props.row.department_name ?? 'Não informado' }}</div>
              </div>

              <q-separator inset class="q-my-sm" />

              <div class="row justify-between items-center">
                <q-chip
                  dense
                  :color="props.row.active === 1 ? 'green-1' : 'red-1'"
                  :text-color="props.row.active === 1 ? 'green-9' : 'red-9'"
                  :icon="props.row.active === 1 ? 'check_circle' : 'do_not_disturb_on'"
                >
                  {{ props.row.active === 1 ? 'Ativo' : 'Inativo' }}
                </q-chip>

                <div class="row">
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="edit"
                    size="sm"
                    @click="startEdit(props.row.id)"
                  >
                    <q-tooltip>Editar Usuário</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete"
                    size="sm"
                    @click="startExclude(props.row.id)"
                  >
                    <q-tooltip>Excluir Usuário</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>

    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão"
      message="Essa ação é irreversível e excluirá o usuário permanentemente."
      :check-show="true"
      check-label="Excluir também da lista de funcionários?"
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
  </section>
</template>

<style scoped lang="scss">
.user-card {
  border-radius: 12px;
}
</style>
