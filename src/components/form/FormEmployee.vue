<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { searchCep } from 'src/services/cep-service';
import { useEmployeeStore } from 'src/stores/employee-store';
import { useDepartmentStore } from 'src/stores/department-store';
import Loading from '../shared/Loading.vue';
import DepartmentChoose from '../shared/DepartmentChoose.vue';
import { checkDataEmployee } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';
import { useRoleStore } from 'src/stores/role-store';

defineOptions({
  name: 'FormEmployee',
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

const { loadingDepartment, listDepartment } = storeToRefs(useDepartmentStore());
const { loadingEmployee } = storeToRefs(useEmployeeStore());
const { loadingRole, listRoleSelect } = storeToRefs(useRoleStore());

const isPwd = ref<boolean>(true);
const isPwd2 = ref<boolean>(true);
const loading = ref<boolean>(false);
const showDepartmentChoose = ref<boolean>(false);
const hasLoginAccess = ref<boolean>(false);
const dataEmployee = reactive({
  name: '' as string,
  email: '' as string,
  cpf: '' as string,
  cnpj: '' as string,
  stateRegistration: '' as string,
  municipalRegistration: '' as string,
  phone: '' as string,
  country: '' as string,
  state: '' as string,
  city: '' as string,
  cep: '' as string,
  neighborhood: '' as string,
  address: '' as string,
  number: '' as string,
  complement: '' as string,
  description: '' as string,
  dateBirthday: '' as string,
  password: '' as string,
  confirmPassword: '' as string,
});
const selectedIdentifier = ref<string>('CNPJ');
const optionsIdentifier = reactive<string[]>(['CNPJ', 'CPF']);
const allowSearchCep = ref<boolean>(false);
const selectedDepartment = ref<IQuasarSelect<number | null>>({
  label: 'Sem departamento',
  value: null,
});
const selectedSex = ref<IQuasarSelect<string | null>>({
  label: 'Não selecionado',
  value: null,
});
const selectedRole = ref<IQuasarSelect<number>>({
  label: '',
  value: 0,
});
const dataDepartment = reactive({
  id: null as number | null,
  name: '' as string,
});

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
const fetchDepartments = async () => {
  await useDepartmentStore().getDepartments();
};
const clear = (): void => {
  Object.assign(dataEmployee, {
    name: '',
    email: '',
    cpf: '',
    cnpj: '',
    stateRegistration: '',
    municipalRegistration: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    cep: '',
    neighborhood: '',
    address: '',
    number: '',
    complement: '',
    description: '',
    dateBirthday: '',
    password: '',
    confirmPassword: '',
  });

  selectedDepartment.value = {
    label: 'Sem departamento',
    value: null,
  };
  selectedSex.value = {
    label: 'Não selecionado',
    value: null,
  };
  selectedRole.value = {
    label: '',
    value: 0,
  };

  Object.assign(dataDepartment, {
    id: null,
    name: '',
  });

  allowSearchCep.value = false;
};
const save = async () => {
  const check = checkDataEmployee(dataEmployee, hasLoginAccess.value);
  if (check.status) {
    const response = await useEmployeeStore().createEmployee(
      dataEmployee.name,
      dataEmployee.email.trim() !== '' ? dataEmployee.email : null,
      dataEmployee.dateBirthday.trim() !== '' ? dataEmployee.dateBirthday : null,
      selectedSex.value.value,
      dataEmployee.phone.trim() !== '' ? dataEmployee.phone : null,
      dataEmployee.cpf.trim() !== '' ? Number(dataEmployee.cpf) : null,
      dataEmployee.cnpj.trim() !== '' ? Number(dataEmployee.cnpj) : null,
      dataEmployee.stateRegistration.trim() !== '' ? dataEmployee.stateRegistration : null,
      dataEmployee.municipalRegistration.trim() !== '' ? dataEmployee.municipalRegistration : null,
      dataEmployee.country.trim() !== '' ? dataEmployee.country : null,
      dataEmployee.state.trim() !== '' ? dataEmployee.state : null,
      dataEmployee.city.trim() !== '' ? dataEmployee.city : null,
      dataEmployee.cep.trim() !== '' ? Number(dataEmployee.cep) : null,
      dataEmployee.neighborhood.trim() !== '' ? dataEmployee.neighborhood : null,
      dataEmployee.address.trim() !== '' ? dataEmployee.address : null,
      dataEmployee.number.trim() !== '' ? Number(dataEmployee.number) : null,
      dataEmployee.complement.trim() !== '' ? dataEmployee.complement : null,
      dataEmployee.description.trim() !== '' ? dataEmployee.description : null,
      selectedDepartment.value.value,
      hasLoginAccess.value ? 1 : 0,
      hasLoginAccess.value ? dataEmployee.password : null,
      hasLoginAccess.value ? selectedRole.value.value : null,
    );
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados do funcionário');
  }
};
const update = async () => {
  const check = checkDataEmployee(dataEmployee, hasLoginAccess.value);
  if (check.status) {
    const response = await useEmployeeStore().updateEmployee(
      employeeId.value ?? 0,
      dataEmployee.name,
      dataEmployee.email.trim() !== '' ? dataEmployee.email : null,
      dataEmployee.dateBirthday.trim() !== '' ? dataEmployee.dateBirthday : null,
      selectedSex.value.value,
      dataEmployee.phone.trim() !== '' ? dataEmployee.phone : null,
      dataEmployee.cpf.trim() !== '' ? Number(dataEmployee.cpf) : null,
      dataEmployee.cnpj.trim() !== '' ? Number(dataEmployee.cnpj) : null,
      dataEmployee.stateRegistration.trim() !== '' ? dataEmployee.stateRegistration : null,
      dataEmployee.municipalRegistration.trim() !== '' ? dataEmployee.municipalRegistration : null,
      dataEmployee.country.trim() !== '' ? dataEmployee.country : null,
      dataEmployee.state.trim() !== '' ? dataEmployee.state : null,
      dataEmployee.city.trim() !== '' ? dataEmployee.city : null,
      dataEmployee.cep.trim() !== '' ? Number(dataEmployee.cep) : null,
      dataEmployee.neighborhood.trim() !== '' ? dataEmployee.neighborhood : null,
      dataEmployee.address.trim() !== '' ? dataEmployee.address : null,
      dataEmployee.number.trim() !== '' ? Number(dataEmployee.number) : null,
      dataEmployee.complement.trim() !== '' ? dataEmployee.complement : null,
      dataEmployee.description.trim() !== '' ? dataEmployee.description : null,
      selectedDepartment.value.value,
      hasLoginAccess.value ? 1 : 0,
    );
    if (response?.status === 200) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados do funcionário');
  }
};
const checkDataEdit = async () => {
  if (employeeId.value) {
    const response = await useEmployeeStore().showEmployee(employeeId.value);
    if (response?.status === 200) {
      const employee = response.data.employee;

      Object.assign(dataEmployee, {
        name: employee.name ?? '',
        email: employee.email ?? '',
        phone: employee.phone ?? '',
        cpf: employee.cpf ? String(employee.cpf) : '',
        cnpj: employee.cnpj ? String(employee.cnpj) : '',
        stateRegistration: employee.state_registration ?? '',
        municipalRegistration: employee.municipal_registration ?? '',
        country: employee.country ?? '',
        state: employee.state ?? '',
        city: employee.city ?? '',
        cep: employee.cep ? String(employee.cep) : '',
        neighborhood: employee.neighborhood ?? '',
        address: employee.address ?? '',
        number: employee.number ? String(employee.number) : '',
        complement: employee.complement ?? '',
        description: employee.description ?? '',
        dateBirthday: employee.date_birthday ?? '',
      });

      const selectedDepartmentItem = listDepartment.value.find(
        (item) => item.id === employee.department_id,
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
const fetchRoles = async () => {
  await useRoleStore().getRolesSelect();
  const selectedItem = listRoleSelect.value.find((item) => item.name.toLowerCase() === 'master');
  selectedRole.value = {
    label: selectedItem?.name ?? '',
    value: selectedItem?.id ?? 0,
  };
};

const employeeId = computed(() => props.data.employeeId);
const formattedPhone = computed({
  get() {
    const phone = (dataEmployee.phone || '').replace(/\D/g, '');

    if (phone.length === 10) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
    }
    if (phone.length === 11) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
    }
    return phone;
  },
  set(value) {
    const digits = (value || '').replace(/\D/g, '');

    if (digits.length > 11) {
      return;
    }

    dataEmployee.phone = digits;
  },
});
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});
const optionsSex = computed(() => {
  return [
    {
      label: 'Masculino',
      value: 'M',
    },
    {
      label: 'Feminino',
      value: 'F',
    },
    {
      label: 'Não selecionado',
      value: null,
    },
  ];
});
const optionsRoles = computed(() => {
  return listRoleSelect.value.map((item) => ({
    label: item.name,
    value: item.id,
  }));
});

watch(hasLoginAccess, () => {
  dataEmployee.password = '';
  dataEmployee.confirmPassword = '';
});
watch(
  () => dataEmployee.cep,
  async (cep: string) => {
    dataEmployee.cep = dataEmployee.cep.replace(/\D/g, '');
    if (allowSearchCep.value) {
      if (cep.trim().length === 8) {
        loading.value = true;
        const response = await searchCep(cep);
        if (response.status === 200) {
          dataEmployee.neighborhood = response.data.bairro;
          dataEmployee.state = response.data.estado;
          dataEmployee.city = response.data.localidade;
          dataEmployee.address = response.data.logradouro;
        }
      } else {
        dataEmployee.neighborhood = '';
        dataEmployee.state = '';
        dataEmployee.city = '';
        dataEmployee.address = '';
      }
    } else {
      allowSearchCep.value = true;
    }
    loading.value = false;
  },
);
watch(
  () => dataEmployee.country,
  (country: string) => {
    if (country.trim().length > 0) {
      dataEmployee.country = dataEmployee.country.replace(/\d+/g, '');
    }
  },
);
watch(
  [() => dataEmployee.cpf, () => dataEmployee.cnpj, () => dataEmployee.number],
  ([cpf, cnpj, numberAdress]) => {
    dataEmployee.cpf = cpf.replace(/\D/g, '');
    dataEmployee.cnpj = cnpj.replace(/\D/g, '');
    dataEmployee.number = numberAdress.replace(/\D/g, '');
  },
);
watch(
  selectedIdentifier,
  (identifier: string) => {
    if (identifier === 'CPF') {
      dataEmployee.cnpj = '';
      dataEmployee.municipalRegistration = '';
      dataEmployee.stateRegistration = '';
    } else {
      dataEmployee.cpf = '';
    }
  },
  { immediate: true },
);
watch(open, async () => {
  clear();
  if (open.value) {
    await fetchDepartments();
    await fetchRoles();
    await checkDataEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="employeeId ? 'Atualização de funcionário' : 'Cadastro de funcionário'"
          icon="person"
        />
      </q-card-section>
      <Loading :show="loadingDepartment || loadingRole" />
      <q-card-section class="q-pa-sm">
        <q-form v-show="!loadingDepartment && !loadingRole" class="q-gutter-y-sm">
          <q-input
            v-model="dataEmployee.name"
            bg-color="white"
            label-color="black"
            filled
            label="Nome do funcionário"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEmployee.email"
            bg-color="white"
            label-color="black"
            filled
            label="E-mail do funcionário"
            dense
            input-class="text-black"
            autocomplete="new-email"
          >
            <template v-slot:prepend>
              <q-icon name="mail" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="selectedSex"
            :options="optionsSex"
            label="Selecione o gênero"
            filled
            dense
            options-dense
            bg-color="white"
            label-color="black"
          >
            <template v-slot:prepend>
              <q-icon
                :name="
                  selectedSex.value === 'M'
                    ? 'male'
                    : selectedSex.value === 'F'
                      ? 'female'
                      : 'favorite'
                "
                color="black"
                size="20px"
              />
            </template>
          </q-select>
          <q-input
            v-model="dataEmployee.dateBirthday"
            bg-color="white"
            label-color="black"
            filled
            label="Data de nascimento"
            dense
            input-class="text-black"
            mask="##/##/####"
          >
            <template v-slot:prepend>
              <q-icon name="today" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="formattedPhone"
            bg-color="white"
            label-color="black"
            filled
            label="Telefone do funcionário"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="phone" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataDepartment.name"
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
          <div class="row justify-between">
            <q-select
              v-model="selectedIdentifier"
              :options="optionsIdentifier"
              label="Selecione o documento"
              filled
              dense
              options-dense
              bg-color="white"
              label-color="black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="info" color="black" size="20px" />
              </template>
            </q-select>
            <q-input
              v-if="selectedIdentifier === 'CNPJ'"
              v-model="dataEmployee.cnpj"
              bg-color="white"
              label-color="black"
              filled
              label="Digite o CNPJ"
              dense
              input-class="text-black"
              class="input-divider"
              maxlength="14"
            >
              <template v-slot:prepend>
                <q-icon name="badge" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-else
              v-model="dataEmployee.cpf"
              bg-color="white"
              label-color="black"
              filled
              label="Digite o CPF"
              dense
              input-class="text-black"
              class="input-divider"
              maxlength="11"
            >
              <template v-slot:prepend>
                <q-icon name="badge" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <div class="row justify-between" v-show="selectedIdentifier === 'CNPJ'">
            <q-input
              v-model="dataEmployee.stateRegistration"
              bg-color="white"
              label-color="black"
              filled
              label="Inscrição estadual"
              dense
              input-class="text-black"
              class="input-divider"
              maxlength="30"
            >
              <template v-slot:prepend>
                <q-icon name="flag" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataEmployee.municipalRegistration"
              bg-color="white"
              label-color="black"
              filled
              label="Inscrição municipal"
              dense
              input-class="text-black"
              class="input-divider"
              maxlength="30"
            >
              <template v-slot:prepend>
                <q-icon name="flag" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="dataEmployee.cep"
            bg-color="white"
            label-color="black"
            filled
            label="Digite o CEP"
            dense
            input-class="text-black"
            :loading="loading"
            maxlength="8"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEmployee.country"
            bg-color="white"
            label-color="black"
            filled
            label="País"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="south_america" color="black" size="20px" />
            </template>
          </q-input>
          <div class="row justify-between">
            <q-input
              v-model="dataEmployee.state"
              bg-color="white"
              label-color="black"
              filled
              label="UF"
              dense
              input-class="text-black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="map" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataEmployee.city"
              bg-color="white"
              label-color="black"
              filled
              label="Cidade"
              dense
              input-class="text-black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="pin_drop" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="dataEmployee.neighborhood"
            bg-color="white"
            label-color="black"
            filled
            label="Bairro"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEmployee.address"
            bg-color="white"
            label-color="black"
            filled
            label="Logradouro"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
            </template>
          </q-input>
          <div class="row justify-between">
            <q-input
              v-model="dataEmployee.number"
              bg-color="white"
              label-color="black"
              filled
              label="Número"
              dense
              input-class="text-black"
              class="input-divider"
              maxlength="15"
              mask="###############"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataEmployee.complement"
              bg-color="white"
              label-color="black"
              filled
              label="Complemento"
              dense
              input-class="text-black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="dataEmployee.description"
            bg-color="white"
            label-color="black"
            filled
            label="Descrição"
            dense
            input-class="text-black no-resize"
            type="textarea"
          >
            <template v-slot:prepend>
              <q-icon name="description" color="black" size="20px" />
            </template>
          </q-input>
          <q-toggle v-model="hasLoginAccess" label="Criar acesso ao sistema" />
          <q-select
            v-show="employeeId === null && hasLoginAccess"
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
          <q-input
            v-show="employeeId === null && hasLoginAccess"
            v-model="dataEmployee.password"
            bg-color="white"
            label-color="black"
            filled
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
            v-show="employeeId === null && hasLoginAccess"
            v-model="dataEmployee.confirmPassword"
            bg-color="white"
            label-color="black"
            filled
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
        <DepartmentChoose
          :open="showDepartmentChoose"
          @update:open="changeViewDepartmentChoose"
          @update:choose-department="handleChooseDepartment"
        />
      </q-card-section>
      <q-card-actions align="right" v-show="!loadingDepartment && !loadingRole">
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
            v-if="employeeId === null"
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingEmployee"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingEmployee"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
