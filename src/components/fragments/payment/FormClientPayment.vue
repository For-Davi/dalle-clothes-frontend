<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { reactive, watch, computed, ref } from 'vue';
import { searchCep } from 'src/services/cep-service';
import { useClientStore } from 'src/stores/client-store';
import Loading from 'src/components/shared/Loading.vue';

defineOptions({
  name: 'FormClientPayment',
});

const props = defineProps<{
  data: {
    show: boolean;
    clientId: number | null;
  };
}>();

const model = defineModel<IVModelClient>({ required: true });
const selectedIdentifier = ref<string>('CNPJ');
const optionsIdentifier = reactive<string[]>(['CNPJ', 'CPF']);
const allowSearchCep = ref<boolean>(false);
const loading = ref<boolean>(false);
const loadingCheckData = ref<boolean>(false);

const checkDataEdit = async () => {
  if (props.data.clientId) {
    loadingCheckData.value = true;
    const response = await useClientStore().showClient(props.data.clientId);
    if (response?.status === 200) {
      const client = response.data.client;
      Object.assign(model.value, {
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

      loadingCheckData.value = false;
    }
  }
};

const formattedPhone = computed({
  get() {
    const phone = (model.value.phone || '').replace(/\D/g, '');

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

    model.value.phone = digits;
  },
});

watch(
  [() => props.data.show, () => props.data.clientId],
  async ([show, clientId]) => {
    if (show && clientId) {
      await checkDataEdit();
    }
  },
  { immediate: true },
);

watch(
  [() => model.value.cpf, () => model.value.cnpj],
  ([cpf, cnpj]) => {
    if (cpf) {
      selectedIdentifier.value = 'CPF';
    } else if (cnpj) {
      selectedIdentifier.value = 'CNPJ';
    }
  },
  { immediate: true },
);
watch(selectedIdentifier, (newVal) => {
  if (newVal === 'CPF') {
    model.value.cnpj = '';
  }
  if (newVal === 'CNPJ') {
    model.value.cpf = '';
  }
});
watch(
  () => model.value.cep,
  async (cep: string | null) => {
    model.value.cep = model.value.cep?.toString().replace(/\D/g, '') || '';
    if (allowSearchCep.value) {
      if (cep) {
        if (cep.toString().trim().length === 8) {
          loading.value = true;
          const response = await searchCep(cep.toString());
          if (response.status === 200) {
            model.value.neighborhood = response.data.bairro;
            model.value.state = response.data.estado;
            model.value.city = response.data.localidade;
            model.value.address = response.data.logradouro;
          }
        } else {
          model.value.neighborhood = '';
          model.value.state = '';
          model.value.city = '';
          model.value.address = '';
        }
      }
    } else {
      allowSearchCep.value = true;
    }
    loading.value = false;
  },
);
watch(
  () => model.value.country,
  (country: string | null) => {
    if (country) {
      if (country.trim().length > 0) {
        model.value.country = model.value.country?.replace(/\d+/g, '') || '';
      }
    }
  },
);
watch(
  [() => model.value.cpf, () => model.value.cnpj, () => model.value.number],
  ([cpf, cnpj, numberAdress]) => {
    model.value.cpf = cpf?.replace(/\D/g, '') || '';
    model.value.cnpj = cnpj?.toString().replace(/\D/g, '') || '';
    model.value.number = numberAdress?.toString().replace(/\D/g, '') || '';
  },
);
</script>

<template>
  <q-card v-if="props.data.show" flat class="q-mt-md flex justify-between column">
    <q-card-section class="q-pa-none">
      <TitlePage title="Formulário do cliente" icon="list_alt" />
    </q-card-section>
    <div v-if="loadingCheckData" class="flex flex-center q-ma-xl">
      <Loading :show="loadingCheckData" />
    </div>

    <q-card-section class="q-pa-sm" v-if="!loadingCheckData">
      <q-form class="q-gutter-y-sm">
        <q-input
          v-model="model.name"
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
          v-model="model.sex"
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
              :name="model.sex === 'Masculino' ? 'male' : 'female'"
              color="black"
              size="20px"
            />
          </template>
        </q-select>
        <q-input
          v-model="model.email"
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
          v-model="model.dateBirthday"
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
            v-model="model.cnpj"
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
            v-model="model.cpf"
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
            v-model="model.stateRegistration"
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
            v-model="model.municipalRegistration"
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
          v-model="model.cep"
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
          v-model="model.country"
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
            v-model="model.state"
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
            v-model="model.city"
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
          v-model="model.neighborhood"
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
          v-model="model.address"
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
            v-model="model.number"
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
            v-model="model.complement"
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
          v-model="model.description"
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
