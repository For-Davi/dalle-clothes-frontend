<script setup lang="ts">
import { watch, ref, computed } from 'vue';
import { searchCep } from 'src/services/cep-service';

defineOptions({
  name: 'FormDelivery',
});

const allowSearchCep = ref<boolean>(false);
const loading = ref<boolean>(false);
const model = defineModel<IDeliveryData>({
  default: () => ({
    freight: false,
    freightValue: '',
    cep: '',
    state: '',
    city: '',
    neighborhood: '',
    address: '',
    numberAddress: '',
    complement: '',
    recipientName: '',
    recipientPhone: '',
    observation: '',
  }),
});

const clearDelivery = () => {
  model.value.freightValue = '0.00';
  model.value.cep = '';
  model.value.state = '';
  model.value.city = '';
  model.value.neighborhood = '';
  model.value.address = '';
  model.value.numberAddress = '';
  model.value.complement = '';
  model.value.recipientName = '';
  model.value.recipientPhone = '';
};

const formattedPhone = computed({
  get() {
    const phone = (model.value.recipientPhone || '').replace(/\D/g, '');

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

    model.value.recipientPhone = digits;
  },
});

watch(
  () => model.value.cep,
  async (cep) => {
    if (cep !== null) {
      model.value.cep = model.value.cep?.replace(/\D/g, '') ?? null;
      if (allowSearchCep.value) {
        if (cep.trim().length === 8) {
          loading.value = true;
          const response = await searchCep(cep);
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
      } else {
        allowSearchCep.value = true;
      }
    }
    loading.value = false;
  },
);
</script>

<template>
  <section class="q-gutter-y-sm">
    <TitlePage title="Entrega" icon="local_shipping" class="q-pa-none q-ma-none" />
    <q-toggle v-model="model.freight" label="Frete" size="lg" @click="clearDelivery" />
    <q-input
      label="R$ Valor do frete"
      v-model="model.freightValue"
      bg-color="white"
      label-color="black"
      outlined
      dense
      input-class="text-black no-spinners"
      type="text"
      mask="#.##"
      fill-mask="0"
      reverse-fill-mask
      class="full-width"
      :disable="!model.freight"
    >
      <template v-slot:prepend>
        <q-icon name="attach_money" color="black" />
      </template>
    </q-input>
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
      :disable="!model.freight"
    >
      <template v-slot:prepend>
        <q-icon name="search" color="black" size="20px" />
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
        :disable="!model.freight"
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
        :disable="!model.freight"
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
      :disable="!model.freight"
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
      :disable="!model.freight"
    >
      <template v-slot:prepend>
        <q-icon name="pin_drop" color="black" size="20px" />
      </template>
    </q-input>
    <div class="row justify-between">
      <q-input
        v-model="model.numberAddress"
        bg-color="white"
        label-color="black"
        outlined
        label="Número"
        dense
        input-class="text-black"
        class="input-divider"
        maxlength="15"
        mask="###############"
        :disable="!model.freight"
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
        :disable="!model.freight"
      >
        <template v-slot:prepend>
          <q-icon name="numbers" color="black" size="20px" />
        </template>
      </q-input>
    </div>
    <q-input
      v-model="model.recipientName"
      bg-color="white"
      label-color="black"
      outlined
      label="Nome do recebedor"
      dense
      input-class="text-black"
      :disable="!model.freight"
    >
      <template v-slot:prepend>
        <q-icon name="person" color="black" size="20px" />
      </template>
    </q-input>
    <q-input
      v-model="formattedPhone"
      bg-color="white"
      label-color="black"
      outlined
      label="Telefone do recebedor"
      dense
      input-class="text-black"
      :disable="!model.freight"
    >
      <template v-slot:prepend>
        <q-icon name="phone" color="black" size="20px" />
      </template>
    </q-input>
    <q-input
      v-model="model.observation"
      bg-color="white"
      label-color="black"
      outlined
      label="Observação"
      dense
      input-class="text-black no-resize"
      type="textarea"
      :disable="!model.freight"
    >
      <template v-slot:prepend>
        <q-icon name="description" color="black" size="20px" />
      </template>
    </q-input>
  </section>
</template>
