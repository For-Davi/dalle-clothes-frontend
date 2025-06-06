<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { useUserStore } from 'src/stores/user-store';
import { useRoleStore } from 'src/stores/role-store';
import { useDepartmentStore } from 'src/stores/department-store';
import { storeToRefs } from 'pinia';
import { checkDataUserSystem } from 'src/composables/CheckData';
import { createSuccess } from 'src/composables/CreateNotify';

defineOptions({
  name: 'FormUser',
});

const props = defineProps<{
  open: boolean;
  userId: number | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingUser } = storeToRefs(useUserStore());
const { loadingDepartment, listDepartmentSelect } = storeToRefs(useDepartmentStore());
const { loadingRole, listRoleSelect } = storeToRefs(useRoleStore());

const loading = ref<boolean>(false);
const userEdit = ref<IUser | null>(null);
const isPwd = ref<boolean>(true);
const isPwd2 = ref<boolean>(true);
const showDepartmentChoose = ref<boolean>(false);
const dataUser = reactive({
  name: '' as string,
  email: '' as string,
  active: 1 as number,
  password: '' as string,
  confirmPassword: '' as string,
});
const dataDeparment = reactive({
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

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const clear = (): void => {
  Object.assign(dataUser, {
    name: '',
    email: '',
    active: 1,
  });

  userEdit.value = null;

  selectedDepartment.value = {
    label: 'Sem departamento',
    value: null,
  };
  selectedRole.value = {
    label: '',
    value: 0,
  };
};
const save = async () => {
  const check = checkDataUserSystem(dataUser);
  if (check.status) {
    const response = await useUserStore().createUser(
      dataUser.name,
      dataUser.password,
      dataUser.email,
      selectedRole.value.value,
      selectedDepartment.value.value,
    );
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    createSuccess(check.message || 'Erro ao processar dados do usuário');
  }
};
const update = async () => {
  const check = checkDataUserSystem(dataUser);
  if (check.status) {
    const response = await useUserStore().updateUser(
      props.userId ?? 0,
      dataUser.name,
      dataUser.email,
      selectedRole.value.value,
      selectedDepartment.value.value,
      dataUser.active,
    );
    if (response?.status === 200) {
      clear();
      emit('update:open');
    }
  } else {
    createSuccess(check.message || 'Erro ao processar dados do usuário');
  }
};
const checkDataEdit = async () => {
  if (props.userId !== null) {
    const response = await useUserStore().showUser(props.userId);
    if (response?.status === 200) {
      const user = response.data.user;

      Object.assign(dataUser, {
        name: user.name,
        email: user.email,
        active: user.active,
      });

      const selectedRoleItem = listRoleSelect.value.find((item) => item.id === props.userId);
      selectedRole.value = selectedRoleItem
        ? { label: selectedRoleItem?.name, value: selectedRoleItem?.id }
        : { label: '', value: 0 };

      const selectedDepartmentItem = listDepartmentSelect.value.find(
        (item) => item.id === props.userId,
      );
      selectedDepartment.value = selectedDepartmentItem
        ? { label: selectedDepartmentItem?.name, value: selectedDepartmentItem?.id }
        : { label: 'Sem departamento', value: null };
    }
  }
};
const changeViewDepartmentChoose = (): void => {
  showDepartmentChoose.value = !showDepartmentChoose.value;
};
const handleChooseDepartment = (tree: { id: string; label: string } | null): void => {
  dataUser.department = tree === null ? null : tree.id;
  dataUser.departmentName = tree === null ? null : tree.label;
  closeDepartmentChoose();
};
const fetchRoles = async () => {
  await useRoleStore().getRolesSelect();
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
const optionsDepartments = computed(() => {
  return listDepartmentSelect.value.map((item) => ({
    label: item.name,
    value: item.id,
  }));
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
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="props.userId ? 'Atualização de usuário' : 'Cadastro de usuário'"
          icon="person"
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataUser.name"
            bg-color="white"
            label-color="black"
            filled
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
            filled
            label="Digite o e-mail do usuário"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="mail" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            filled
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
          <q-select
            filled
            v-model="selectedDepartment"
            label="Selecione o departamento"
            :options="optionsDepartments"
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
            v-model="dataDeparment.name"
            bg-color="white"
            label-color="black"
            filled
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
            v-show="props.userId === null"
            v-model="dataUser.password"
            bg-color="white"
            label-color="black"
            filled
            label="Senha do usuário"
            dense
            input-class="text-black"
            :type="isPwd ? 'password' : 'text'"
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
            v-show="props.userId === null"
            v-model="dataUser.confirmPassword"
            bg-color="white"
            label-color="black"
            filled
            label="Confirme a senha"
            dense
            input-class="text-black"
            :type="isPwd2 ? 'password' : 'text'"
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
            :disable="false"
            unelevated
            no-caps
          />
          <q-btn
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingDepartment || loadingRole || loading"
            unelevated
            no-caps
          />
          <q-btn
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingDepartment || loadingRole || loading"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
