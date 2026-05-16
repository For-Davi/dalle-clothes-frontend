<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { checkDataAccessLogin } from 'src/composables/CheckData';
import { useEmployeeStore } from 'src/stores/employee-store';
import { createErrorData } from 'src/composables/CreateNotify';
import { useRoleStore } from 'src/stores/role-store';

defineOptions({
  name: 'FormAccessLogin',
});

const props = defineProps<{
  data: {
    open: boolean;
    employeeId: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingEmployee } = storeToRefs(useEmployeeStore());
const { loadingRole, listRoleSelect } = storeToRefs(useRoleStore());

const isPwd = ref<boolean>(true);
const isPwd2 = ref<boolean>(true);
const dataAccessLogin = reactive({
  name: '' as string,
  email: '' as string,
  password: '' as string,
  confirmPassword: '' as string,
});
const selectedRole = ref<IQuasarSelect<number>>({
  label: '',
  value: 0,
});

const clear = (): void => {
  Object.assign(dataAccessLogin, {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  isPwd.value = true;
  isPwd2.value = true;

  selectedRole.value = {
    label: '',
    value: 0,
  };
};
const save = async () => {
  const check = checkDataAccessLogin(dataAccessLogin);
  if (check.status) {
    const response = await useEmployeeStore().createAccessLogin(
      employeeId.value!,
      dataAccessLogin.password,
      selectedRole.value.value,
    );
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao criar acesso ao sistema');
  }
};
const mountData = async () => {
  const response = await useEmployeeStore().showEmployee(employeeId.value!);
  if (response?.status === 200) {
    const employee = response.data.employee;

    Object.assign(dataAccessLogin, {
      name: employee.name ?? '',
      email: employee.email ?? '',
    });
  }
};
const fetchRoles = async () => {
  await useRoleStore().getRolesSelect();
  const selectedItem = listRoleSelect.value.find((item) => item.name.toLowerCase() === 'master');
  selectedRole.value = {
    label: selectedItem?.name ?? '',
    value: selectedItem?.id ?? 0,
  };
};

const isLoading = computed((): boolean => {
  return loadingEmployee.value || loadingRole.value;
});
const employeeId = computed(() => props.data.employeeId);
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
const optionsRoles = computed(() => {
  return listRoleSelect.value.map((item) => ({
    label: item.name,
    value: item.id,
  }));
});

watch(open, async () => {
  clear();
  if (open.value) {
    await fetchRoles();
    await mountData();
  }
});
</script>
<template>
  <q-dialog v-model="open" :maximized="$q.screen.lt.sm">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Acesso ao sistema" icon="app_registration" />
      </q-card-section>
      <Loading :show="isLoading" />
      <q-card-section class="q-pa-sm" v-show="!isLoading">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataAccessLogin.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome do funcionário"
            disable
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataAccessLogin.email"
            bg-color="white"
            label-color="black"
            outlined
            label="E-mail do funcionário"
            dense
            input-class="text-black"
            autocomplete="new-email"
            disable
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
            v-model="dataAccessLogin.password"
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
            v-model="dataAccessLogin.confirmPassword"
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
        </q-form>
      </q-card-section>
      <q-card-actions align="right" v-show="!isLoading">
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
            @click="save"
            color="primary"
            label="Salvar"
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
