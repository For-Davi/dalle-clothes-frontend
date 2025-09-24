<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import { searchCep } from 'src/services/cep-service';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { storeToRefs } from 'pinia';
import Loading from '../shared/Loading.vue';
import { checkEnterpriseData } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';
import { useRouter } from 'vue-router';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import { useAuthStore } from 'src/stores/auth-store';

defineOptions({
  name: 'FormEnterprise',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingEnterprise } = storeToRefs(useEnterpriseStore());
const router = useRouter();

const dataEnterprise = reactive({
  name: '' as string,
  email: '' as string,
  phone: '' as string,
  cpf: '' as string,
  cnpj: '' as string,
  cep: '' as string,
  state: '' as string,
  city: '' as string,
  neighborhood: '' as string,
  address: '' as string,
  numberAddress: '' as string,
  complement: '' as string,
});
const selectedIdentifier = ref<string>('CNPJ');
const optionsIdentifier = reactive<string[]>(['CNPJ', 'CPF']);
const allowSearchCep = ref<boolean>(false);
const loading = ref<boolean>(false);
const showConfirmAction = ref<boolean>(false);

const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  const response = await useEnterpriseStore().deleteEnterprise();

  if (response?.status === 200) {
    useAuthStore().setToken(null);
    useAuthStore().setUser(null);
    await router.push({ name: 'auth' });
  }
};
const closeConfirmAction = () => {
  showConfirmAction.value = false;
};
const changeShowConfirmAction = () => {
  showConfirmAction.value = true;
};
const update = async () => {
  const check = checkEnterpriseData(dataEnterprise);
  if (check.status) {
    const response = await useEnterpriseStore().updateEnterprise(dataEnterprise);
    if (response?.status == 200) {
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao atualizar dados da empresa');
  }
};
const clear = () => {
  Object.assign(dataEnterprise, {
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cnpj: '',
    cep: '',
    state: '',
    city: '',
    neighborhood: '',
    address: '',
    numberAddress: '',
    complement: '',
  });
};
const checkDataEdit = async () => {
  const response = await useEnterpriseStore().showEnterprise();
  if (response?.status === 200) {
    const enterprise = response.data.enterprise;

    Object.assign(dataEnterprise, {
      name: enterprise.name,
      email: enterprise.email,
      phone: enterprise.phone,
      cpf: enterprise.cpf,
      cnpj: enterprise.cnpj,
      cep: enterprise.cep,
      state: enterprise.state,
      city: enterprise.city,
      neighborhood: enterprise.neighborhood,
      address: enterprise.address,
      numberAddress: enterprise.number_address,
      complement: enterprise.complement,
    });

    if (selectedIdentifier.value === 'CPF') {
      dataEnterprise.cnpj = '';
    } else {
      dataEnterprise.cpf = '';
    }
  }
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const formattedPhone = computed({
  get() {
    const phone = (dataEnterprise.phone || '').replace(/\D/g, '');

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

    dataEnterprise.phone = digits;
  },
});

watch(
  () => dataEnterprise.cep,
  async (cep: string) => {
    if (cep !== null) {
      dataEnterprise.cep = dataEnterprise.cep.replace(/\D/g, '');
      if (allowSearchCep.value) {
        if (cep.trim().length === 8) {
          loading.value = true;
          const response = await searchCep(cep);
          if (response.status === 200) {
            dataEnterprise.neighborhood = response.data.bairro;
            dataEnterprise.state = response.data.estado;
            dataEnterprise.city = response.data.localidade;
            dataEnterprise.address = response.data.logradouro;
          }
        } else {
          dataEnterprise.neighborhood = '';
          dataEnterprise.state = '';
          dataEnterprise.city = '';
          dataEnterprise.address = '';
        }
      } else {
        allowSearchCep.value = true;
      }
    }
    loading.value = false;
  },
);
watch(selectedIdentifier, (newVal) => {
  if (newVal === 'CNPJ') {
    dataEnterprise.cpf = '';
  } else if (newVal === 'CPF') {
    dataEnterprise.cnpj = '';
  }
});
watch(open, async () => {
  if (open.value) {
    clear();
    await checkDataEdit();
  }
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic column justify-between">
      <q-card-section class="q-pa-none">
        <TitlePage title="Dados da organização" icon="groups" />
      </q-card-section>
      <Loading :show="loadingEnterprise" />
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm" v-show="!loadingEnterprise">
          <q-input
            v-model="dataEnterprise.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome da empresa"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEnterprise.email"
            bg-color="white"
            label-color="black"
            outlined
            label="E-mail da empresa"
            dense
            input-class="text-black"
            autocomplete="new-email"
          >
            <template v-slot:prepend>
              <q-icon name="mail" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="formattedPhone"
            bg-color="white"
            label-color="black"
            outlined
            label="Telefone da empresa"
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
              outlined
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
              v-model="dataEnterprise.cnpj"
              bg-color="white"
              label-color="black"
              outlined
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
              v-model="dataEnterprise.cpf"
              bg-color="white"
              label-color="black"
              outlined
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
          <q-input
            v-model="dataEnterprise.cep"
            bg-color="white"
            label-color="black"
            outlined
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
          <div class="row justify-between">
            <q-input
              v-model="dataEnterprise.state"
              bg-color="white"
              label-color="black"
              outlined
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
              v-model="dataEnterprise.city"
              bg-color="white"
              label-color="black"
              outlined
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
            v-model="dataEnterprise.neighborhood"
            bg-color="white"
            label-color="black"
            outlined
            label="Bairro"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEnterprise.address"
            bg-color="white"
            label-color="black"
            outlined
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
              v-model="dataEnterprise.numberAddress"
              bg-color="white"
              label-color="black"
              outlined
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
              v-model="dataEnterprise.complement"
              bg-color="white"
              label-color="black"
              outlined
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
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat color="red" label="Fechar" size="md" @click="open = false" unelevated no-caps />
        <q-btn
          color="red"
          :loading="loadingEnterprise"
          @click="changeShowConfirmAction"
          label="Apagar organização"
          size="md"
          unelevated
          no-caps
        />
        <q-btn
          color="primary"
          :loading="loadingEnterprise"
          @click="update"
          label="Atualizar"
          size="md"
          unelevated
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Modals -->
  <ConfirmAction
    :open="showConfirmAction"
    label-action="Continuar"
    title="Confirmação de exclusão da empresa"
    message="Caso tenha certeza, clique em 'Continuar', pois essa ação é irreversível e excluirá a empresa permanentemente, desvinculando-a de todos os dados salvos."
    @update:open="closeConfirmAction"
    @update:ok="closeConfirmActionOk"
  />
</template>
