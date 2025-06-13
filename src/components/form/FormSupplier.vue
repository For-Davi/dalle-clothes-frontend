<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { useCategorySupplierStore } from 'src/stores/category-supplier-store';
import { searchCep } from 'src/services/cep-service';
import { checkDataSupplier } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';
import { useSupplierStore } from 'src/stores/supplier-store';

defineOptions({
  name: 'FormSupplier',
});

const props = defineProps<{
  data: {
    open: boolean;
    supplierId: number | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingCategorySupplier, listCategorySupplier } = storeToRefs(useCategorySupplierStore());
const { loadingSupplier } = storeToRefs(useSupplierStore());

const loading = ref<boolean>(false);
const supplierEdit = ref<IUser | null>(null);
const dataSupplier = reactive({
  name: '' as string,
  email: '' as string,
  cpf: '' as string,
  cnpj: '' as string,
  stateRegistration: '' as string,
  municipalRegistration: '' as string,
  phone: '' as string,
  site: '' as string,
  country: '' as string,
  state: '' as string,
  city: '' as string,
  cep: '' as string,
  neighborhood: '' as string,
  address: '' as string,
  number: '' as string,
  complement: '' as string,
  description: '' as string,
});
const selectedCategory = ref<IQuasarSelect<number | null>>({
  label: 'Sem categoria',
  value: null,
});
const selectedIdentifier = ref<string>('CNPJ');
const optionsIdentifier = reactive<string[]>(['CNPJ', 'CPF']);

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

const clear = (): void => {
  Object.assign(dataSupplier, {
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cnpj: '',
    stateRegistration: '',
    municipalRegistration: '',
    site: '',
    country: '',
    state: '',
    city: '',
    cep: '',
    neighborhood: '',
    address: '',
    number: '',
    complement: '',
    description: '',
  });

  supplierEdit.value = null;

  selectedCategory.value = {
    label: 'Sem categoria',
    value: null,
  };
};
const save = async () => {
  const check = checkDataSupplier(dataSupplier);
  if (check.status) {
    console.log('selectedCategory.value.value', selectedCategory.value.value);
    const response = await useSupplierStore().createSupplier(
      dataSupplier.name,
      dataSupplier.email.trim() !== '' ? dataSupplier.email : null,
      dataSupplier.phone.trim() !== '' ? dataSupplier.phone : null,
      dataSupplier.cpf.trim() !== '' ? Number(dataSupplier.cpf) : null,
      dataSupplier.cnpj.trim() !== '' ? Number(dataSupplier.cnpj) : null,
      dataSupplier.stateRegistration.trim() !== '' ? dataSupplier.stateRegistration : null,
      dataSupplier.municipalRegistration.trim() !== '' ? dataSupplier.municipalRegistration : null,
      dataSupplier.site.trim() !== '' ? dataSupplier.site : null,
      dataSupplier.country.trim() !== '' ? dataSupplier.country : null,
      dataSupplier.state.trim() !== '' ? dataSupplier.state : null,
      dataSupplier.city.trim() !== '' ? dataSupplier.city : null,
      dataSupplier.cep.trim() !== '' ? Number(dataSupplier.cep) : null,
      dataSupplier.neighborhood.trim() !== '' ? dataSupplier.neighborhood : null,
      dataSupplier.address.trim() !== '' ? dataSupplier.address : null,
      dataSupplier.number.trim() !== '' ? Number(dataSupplier.number) : null,
      dataSupplier.complement.trim() !== '' ? dataSupplier.complement : null,
      dataSupplier.description.trim() !== '' ? dataSupplier.description : null,
      selectedCategory.value.value,
    );
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados do forncedor');
  }
};
// const update = async () => {
//   const check = checkDataUserSystem(dataUser, 'update');
//   if (check.status) {
//     const response = await useUserStore().updateUser(
//       userId.value ?? 0,
//       dataUser.name,
//       dataUser.email,
//       selectedRole.value.value,
//       dataDepartment.id,
//       selectedStatus.value.value,
//     );
//     if (response?.status === 200) {
//       clear();
//       emit('update:open');
//     }
//   } else {
//     createErrorData(check.message || 'Erro ao processar dados do fornecedor');
//   }
// };
// const checkDataEdit = async () => {
//   if (userId.value !== null) {
//     const response = await useUserStore().showUser(userId.value);
//     if (response?.status === 200) {
//       const user = response.data.user;

//       Object.assign(dataUser, {
//         name: user.name,
//         email: user.email,
//         active: user.active,
//       });

//       const selectedRoleItem = listRoleSelect.value.find((item) => item.id === user.role_id);
//       selectedRole.value = selectedRoleItem
//         ? { label: selectedRoleItem?.name, value: selectedRoleItem?.id }
//         : { label: '', value: 0 };

//       const selectedDepartmentItem = listDepartment.value.find(
//         (item) => item.id === user.department_id,
//       );
//       selectedDepartment.value = selectedDepartmentItem
//         ? { label: selectedDepartmentItem?.name, value: selectedDepartmentItem?.id }
//         : { label: '', value: null };

//       Object.assign(dataDepartment, {
//         id: selectedDepartment.value.value,
//         name: selectedDepartment.value.label,
//       });
//     }
//   }
// };
const fetchCategories = async (): Promise<void> => {
  await useCategorySupplierStore().getCategoriesSupplier();
};

const optionsCategories = computed(() => {
  return [
    { label: 'Sem categoria', value: null },
    ...listCategorySupplier.value.map((item) => ({
      label: item.name,
      value: item.id,
    })),
  ];
});
const isLoading = computed((): boolean => {
  return loadingCategorySupplier.value || loading.value || loadingSupplier.value;
});
const supplierId = computed(() => props.data.supplierId);
const formattedPhone = computed({
  get() {
    const phone = (dataSupplier.phone || '').replace(/\D/g, '');

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

    dataSupplier.phone = digits;
  },
});

watch(
  () => dataSupplier.cep,
  async (cep: string) => {
    dataSupplier.cep = dataSupplier.cep.replace(/\D/g, '');
    if (cep.trim().length === 8) {
      loading.value = true;
      const response = await searchCep(cep);
      if (response.status === 200) {
        dataSupplier.neighborhood = response.data.bairro;
        dataSupplier.state = response.data.estado;
        dataSupplier.city = response.data.localidade;
        dataSupplier.address = response.data.logradouro;
      }
    } else {
      dataSupplier.neighborhood = '';
      dataSupplier.state = '';
      dataSupplier.city = '';
      dataSupplier.address = '';
    }
    loading.value = false;
  },
);
watch(
  () => dataSupplier.country,
  (country: string) => {
    if (country.trim().length > 0) {
      dataSupplier.country = dataSupplier.country.replace(/\d+/g, '');
    }
  },
);
watch(
  [() => dataSupplier.cpf, () => dataSupplier.cnpj, () => dataSupplier.number],
  ([cpf, cnpj, numberAdress]) => {
    dataSupplier.cpf = cpf.replace(/\D/g, '');
    dataSupplier.cnpj = cnpj.replace(/\D/g, '');
    dataSupplier.number = numberAdress.replace(/\D/g, '');
  },
);
watch(
  selectedIdentifier,
  (identifier: string) => {
    if (identifier === 'CPF') {
      dataSupplier.cnpj = '';
      dataSupplier.municipalRegistration = '';
      dataSupplier.stateRegistration = '';
    } else {
      dataSupplier.cpf = '';
    }
  },
  { immediate: true },
);
watch(open, async () => {
  if (open.value) {
    clear();
    await fetchCategories();
    // await checkDataEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="supplierId ? 'Atualização de forncedor' : 'Cadastro de fornecedor'"
          icon="list_alt"
        />
      </q-card-section>
      <Loading :show="loadingCategorySupplier" />
      <q-card-section class="q-pa-sm" v-show="!loadingCategorySupplier">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataSupplier.name"
            bg-color="white"
            label-color="black"
            filled
            label="Nome do fornecedor"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSupplier.email"
            bg-color="white"
            label-color="black"
            filled
            label="E-mail do fornecedor"
            dense
            input-class="text-black"
            autocomplete="new-email"
          >
            <template v-slot:prepend>
              <q-icon name="mail" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSupplier.site"
            bg-color="white"
            label-color="black"
            filled
            label="Site do fornecedor"
            dense
            input-class="text-black"
            autocomplete="new-email"
          >
            <template v-slot:prepend>
              <q-icon name="link" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            filled
            v-model="selectedCategory"
            label="Selecione a categoria"
            :options="optionsCategories"
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
            v-model="formattedPhone"
            bg-color="white"
            label-color="black"
            filled
            label="Telefone do fornecedor"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="phone" color="black" size="20px" />
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
              v-model="dataSupplier.cnpj"
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
              v-model="dataSupplier.cpf"
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
              v-model="dataSupplier.stateRegistration"
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
              v-model="dataSupplier.municipalRegistration"
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
            v-model="dataSupplier.cep"
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
            v-model="dataSupplier.country"
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
              v-model="dataSupplier.state"
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
              v-model="dataSupplier.city"
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
            v-model="dataSupplier.neighborhood"
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
            v-model="dataSupplier.address"
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
              v-model="dataSupplier.number"
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
              v-model="dataSupplier.complement"
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
            v-model="dataSupplier.description"
            bg-color="white"
            label-color="black"
            filled
            label="Descrição"
            dense
            input-class="text-black"
            type="textarea"
            class="no-resize"
          >
            <template v-slot:prepend>
              <q-icon name="description" color="black" size="20px" />
            </template>
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" v-show="!loadingCategorySupplier">
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
            v-if="!supplierId"
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
