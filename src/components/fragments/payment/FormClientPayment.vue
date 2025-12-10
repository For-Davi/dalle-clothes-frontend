<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { reactive, watch, computed, ref } from 'vue';
import { searchCep } from 'src/services/cep-service';

defineOptions({
  name: 'FormClientPayment',
});

const props = defineProps<{
  show: boolean;
  client: IClient | null;
}>();

const dataClient = reactive({
  clientId: null as number | null,
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
  sex: '' as string,
});
const selectedIdentifier = ref<string>('CNPJ');
const optionsIdentifier = reactive<string[]>(['CNPJ', 'CPF']);
const allowSearchCep = ref<boolean>(false);
const loading = ref<boolean>(false);

const checkDataEdit = () => {
  if (props.client) {
    const client = props.client;

    Object.assign(dataClient, {
      clientId: clientId.value ?? null,
      name: client.name ?? '',
      email: client.email ?? '',
      phone: client.phone ?? '',
      cpf: client.cpf ? String(client.cpf) : '',
      cnpj: client.cnpj ? String(client.cnpj) : '',
      stateRegistration: client.state_registration ?? '',
      municipalRegistration: client.municipal_registration ?? '',
      country: client.country ?? '',
      state: client.state ?? '',
      city: client.city ?? '',
      cep: client.cep ? String(client.cep) : '',
      neighborhood: client.neighborhood ?? '',
      address: client.address ?? '',
      number: client.number ? String(client.number) : '',
      complement: client.complement ?? '',
      description: client.description ?? '',
      dateBirthday: client.date_birthday ?? '',
      sex: client.sex === 'M' ? 'Masculino' : 'Feminino',
    });

    if (client.cpf !== null) {
      selectedIdentifier.value = 'CPF';
    } else {
      selectedIdentifier.value = 'CNPJ';
    }
  }
};

const formattedPhone = computed({
  get() {
    const phone = (dataClient.phone || '').replace(/\D/g, '');

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

    dataClient.phone = digits;
  },
});
const clientId = computed(() => props.client?.id);

watch(
  () => dataClient.cep,
  async (cep: string) => {
    dataClient.cep = dataClient.cep.replace(/\D/g, '');
    if (allowSearchCep.value) {
      if (cep.trim().length === 8) {
        loading.value = true;
        const response = await searchCep(cep);
        if (response.status === 200) {
          dataClient.neighborhood = response.data.bairro;
          dataClient.state = response.data.estado;
          dataClient.city = response.data.localidade;
          dataClient.address = response.data.logradouro;
        }
      } else {
        dataClient.neighborhood = '';
        dataClient.state = '';
        dataClient.city = '';
        dataClient.address = '';
      }
    } else {
      allowSearchCep.value = true;
    }
    loading.value = false;
  },
);
watch(
  () => dataClient.country,
  (country: string) => {
    if (country.trim().length > 0) {
      dataClient.country = dataClient.country.replace(/\d+/g, '');
    }
  },
);
watch(
  [() => dataClient.cpf, () => dataClient.cnpj, () => dataClient.number],
  ([cpf, cnpj, numberAdress]) => {
    dataClient.cpf = cpf.replace(/\D/g, '');
    dataClient.cnpj = cnpj.replace(/\D/g, '');
    dataClient.number = numberAdress.replace(/\D/g, '');
  },
);
watch(
  () => props.client,
  (client) => {
    if (client) {
      checkDataEdit();
    }
  },
  { immediate: true },
);
</script>

<template>
  <q-card v-if="props.show" flat class="q-mt-md">
    <q-card-section class="q-pa-none">
      <TitlePage title="Formulário do cliente" icon="list_alt" />
    </q-card-section>
    <q-card-section class="q-pa-sm">
      <q-form class="q-gutter-y-sm">
        <q-input
          v-model="dataClient.name"
          bg-color="white"
          label-color="black"
          outlined
          label="Nome do cliente"
          dense
          input-class="text-black"
        >
          <template v-slot:prepend>
            <q-icon name="person" color="black" size="20px" />
          </template>
        </q-input>
        <q-select
          v-model="dataClient.sex"
          :options="['Masculino', 'Feminino']"
          label="Selecione o gênero"
          outlined
          dense
          options-dense
          bg-color="white"
          label-color="black"
        >
          <template v-slot:prepend>
            <q-icon
              :name="dataClient.sex === 'Masculino' ? 'male' : 'female'"
              color="black"
              size="20px"
            />
          </template>
        </q-select>
        <q-input
          v-model="dataClient.email"
          bg-color="white"
          label-color="black"
          outlined
          label="E-mail do cliente"
          dense
          input-class="text-black"
          autocomplete="new-email"
        >
          <template v-slot:prepend>
            <q-icon name="mail" color="black" size="20px" />
          </template>
        </q-input>
        <q-input
          v-model="dataClient.dateBirthday"
          bg-color="white"
          label-color="black"
          outlined
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
          outlined
          label="Telefone do cliente"
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
            v-model="dataClient.cnpj"
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
            v-model="dataClient.cpf"
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
        <div class="row justify-between" v-show="selectedIdentifier === 'CNPJ'">
          <q-input
            v-model="dataClient.stateRegistration"
            bg-color="white"
            label-color="black"
            outlined
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
            v-model="dataClient.municipalRegistration"
            bg-color="white"
            label-color="black"
            outlined
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
          v-model="dataClient.cep"
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
        <q-input
          v-model="dataClient.country"
          bg-color="white"
          label-color="black"
          outlined
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
            v-model="dataClient.state"
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
            v-model="dataClient.city"
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
          v-model="dataClient.neighborhood"
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
          v-model="dataClient.address"
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
            v-model="dataClient.number"
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
            v-model="dataClient.complement"
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
        <q-input
          v-model="dataClient.description"
          bg-color="white"
          label-color="black"
          outlined
          label="Descrição"
          dense
          input-class="text-black no-resize"
          type="textarea"
        >
          <template v-slot:prepend>
            <q-icon name="description" color="black" size="20px" />
          </template>
        </q-input>
      </q-form>
    </q-card-section>
  </q-card>
</template>
