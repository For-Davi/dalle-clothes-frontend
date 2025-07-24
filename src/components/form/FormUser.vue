<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { useUserStore } from 'src/stores/user-store';
import { useRoleStore } from 'src/stores/role-store';
import { useDepartmentStore } from 'src/stores/department-store';
import { storeToRefs } from 'pinia';
import { checkDataUserSystem } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';
import Loading from '../shared/Loading.vue';
import DepartmentChoose from '../shared/DepartmentChoose.vue';

defineOptions({
  name: 'FormUser',
});

const props = defineProps<{
  data: {
    open: boolean;
    userId: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingUser } = storeToRefs(useUserStore());
const { loadingDepartment, listDepartment } = storeToRefs(useDepartmentStore());
const { loadingRole, listRoleSelect } = storeToRefs(useRoleStore());

const loading = ref<boolean>(false);
const userEdit = ref<IUser | null>(null);
const isPwd = ref<boolean>(true);
const isPwd2 = ref<boolean>(true);
const showDepartmentChoose = ref<boolean>(false);
const createEmployee = ref<boolean>(false);
const dataUser = reactive({
  name: '' as string,
  email: '' as string,
  password: '' as string,
  confirmPassword: '' as string,
});
const dataDepartment = reactive({
  id: null as number | null,
  name: '' as string,
});
const selectedDepartment = ref<IQuasarSelect<number | null>>({
  label: 'Sem departamento',
  value: null,
});
const selectedRole = ref<IQuasarSelect<number>>({
  label: '',
  value: 0,
});
const selectedStatus = ref<IQuasarSelect<number>>({
  label: 'Ativo',
  value: 1,
});

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

const clear = (): void => {
  Object.assign(dataUser, {
    name: '',
    email: '',
    active: 1,
    password: '',
    confirmPassword: '',
  });

  Object.assign(dataDepartment, {
    id: null,
    name: '',
  });

  userEdit.value = null;

  selectedDepartment.value = {
    label: '',
    value: null,
  };
  selectedRole.value = {
    label: '',
    value: 0,
  };
  selectedStatus.value = {
    label: 'Ativo',
    value: 1,
  };

  createEmployee.value = true;
};
const save = async () => {
  const check = checkDataUserSystem(dataUser, 'create');
  if (check.status) {
    const response = await useUserStore().createUser(
      dataUser.name,
      dataUser.password,
      dataUser.email,
      selectedRole.value.value,
      dataDepartment.id,
      createEmployee.value,
    );
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados do usuário');
  }
};
const update = async () => {
  const check = checkDataUserSystem(dataUser, 'update');
  if (check.status) {
    const response = await useUserStore().updateUser(
      userId.value ?? 0,
      dataUser.name,
      dataUser.email,
      selectedRole.value.value,
      dataDepartment.id,
      selectedStatus.value.value,
    );
    if (response?.status === 200) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados do usuário');
  }
};
const checkDataEdit = async () => {
  if (userId.value !== null) {
    const response = await useUserStore().showUser(userId.value);
    if (response?.status === 200) {
      const user = response.data.user;

      Object.assign(dataUser, {
        name: user.name,
        email: user.email,
        active: user.active,
      });

      const selectedRoleItem = listRoleSelect.value.find((item) => item.id === user.role_id);
      selectedRole.value = selectedRoleItem
        ? { label: selectedRoleItem?.name, value: selectedRoleItem?.id }
        : { label: '', value: 0 };

      const selectedDepartmentItem = listDepartment.value.find(
        (item) => item.id === user.department_id,
      );
      selectedDepartment.value = selectedDepartmentItem
        ? { label: selectedDepartmentItem?.name, value: selectedDepartmentItem?.id }
        : { label: '', value: null };

      Object.assign(dataDepartment, {
        id: selectedDepartment.value.value,
        name: selectedDepartment.value.label,
      });
    }
  }
};
const changeViewDepartmentChoose = (): void => {
  showDepartmentChoose.value = !showDepartmentChoose.value;
};
const handleChooseDepartment = (tree: { id: number; label: string } | null): void => {
  selectedDepartment.value = {
    label: tree === null ? '' : tree.label,
    value: tree === null ? null : tree.id,
  };
  dataDepartment.id = tree === null ? null : tree.id;
  dataDepartment.name = tree === null ? '' : tree.label;
  changeViewDepartmentChoose();
};
const fetchRoles = async () => {
  await useRoleStore().getRolesSelect();
  const selectedItem = listRoleSelect.value.find((item) => item.name.toLowerCase() === 'master');
  selectedRole.value = {
    label: selectedItem?.name ?? '',
    value: selectedItem?.id ?? 0,
  };
};
const fetchDepartments = async () => {
  await useDepartmentStore().getDepartments();
};
const changeLoading = (): void => {
  loading.value = !loading.value;
};

const optionsRoles = computed(() => {
  return listRoleSelect.value.map((item) => ({
    label: item.name,
    value: item.id,
  }));
});
const optionsStatus = computed(() => {
  return [
    {
      label: 'Ativo',
      value: 1,
    },
    {
      label: 'Inativo',
      value: 0,
    },
  ];
});
const userId = computed(() => props.data.userId);
const isLoading = computed((): boolean => {
  return loading.value || loadingDepartment.value || loadingUser.value || loadingRole.value;
});

watch(open, async () => {
  if (open.value) {
    clear();
    changeLoading();
    await fetchRoles();
    await fetchDepartments();
    await checkDataEdit();
    changeLoading();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="userId ? 'Atualização de usuário' : 'Cadastro de usuário'"
          icon="person"
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <Loading :show="isLoading" />
        <q-form v-show="!isLoading" class="q-gutter-y-sm">
          <q-input
            v-model="dataUser.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome do usuário"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataUser.email"
            bg-color="white"
            label-color="black"
            outlined
            label="E-mail do usuário"
            dense
            input-class="text-black"
            autocomplete="new-email"
          >
            <template v-slot:prepend>
              <q-icon name="mail" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            outlined
            v-model="selectedRole"
            label="Selecione a permissão"
            :options="optionsRoles"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="supervisor_account" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-model="dataDepartment.name"
            bg-color="white"
            label-color="black"
            outlined
            type="text"
            label="Escolha o departamento"
            readonly
            clearable
            dense
          >
            <template v-slot:prepend>
              <q-icon name="groups" color="black" size="20px" />
            </template>
            <template v-slot:append>
              <q-icon name="search" class="cursor-pointer" @click="changeViewDepartmentChoose" />
            </template>
          </q-input>
          <DepartmentChoose
            :open="showDepartmentChoose"
            @update:open="changeViewDepartmentChoose"
            @update:choose-department="handleChooseDepartment"
          />
          <q-input
            v-show="userId === null"
            v-model="dataUser.password"
            bg-color="white"
            label-color="black"
            outlined
            label="Senha do usuário"
            dense
            input-class="text-black"
            :type="isPwd ? 'password' : 'text'"
            autocomplete="new-password"
          >
            <template v-slot:append>
              <q-icon
                @click="isPwd = !isPwd"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                size="20px"
              />
            </template>
            <template v-slot:prepend>
              <q-icon name="lock" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-show="userId === null"
            v-model="dataUser.confirmPassword"
            bg-color="white"
            label-color="black"
            outlined
            label="Confirme a senha"
            dense
            input-class="text-black"
            :type="isPwd2 ? 'password' : 'text'"
            autocomplete="new-password"
          >
            <template v-slot:append>
              <q-icon
                @click="isPwd2 = !isPwd2"
                :name="isPwd2 ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                size="20px"
              />
            </template>
            <template v-slot:prepend>
              <q-icon name="lock" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-show="userId !== null"
            outlined
            v-model="selectedStatus"
            label="Status do usuário"
            :options="optionsStatus"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="check" color="black" size="20px" />
            </template>
          </q-select>
          <q-checkbox
            v-if="userId === null"
            v-model="createEmployee"
            size="sm"
            label="Cadastrar usuário na lista de funcionários"
          />
        </q-form>
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
          <q-btn
            v-if="userId === null"
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="isLoading"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="isLoading"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
