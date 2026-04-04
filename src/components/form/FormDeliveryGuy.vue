<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from '../shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useDeliveryGuyStore } from 'src/stores/delivery-guy-store';
import { checkDataDeliveryGuy } from 'src/composables/CheckData';
import { createErrorData } from 'src/composables/CreateNotify';
import Loading from '../shared/Loading.vue';

defineOptions({
  name: 'FormDeliveryGuy',
});

const emit = defineEmits<{
  'update:open': [void];
}>();
const props = defineProps<{
  data: {
    open: boolean;
    deliveryGuyID: number | null;
  };
}>();

const { loadingDeliveryGuy } = storeToRefs(useDeliveryGuyStore());

const deliveryGuyData = reactive({
  name: '',
  cpf: '',
  email: '',
  phone: '',
  vehicle: '',
});

const save = async () => {
  const check = checkDataDeliveryGuy(deliveryGuyData);

  if (check.status) {
    const response = await useDeliveryGuyStore().createDeliveryGuy(deliveryGuyData);
    if (response?.status === 201) {
      emit('update:open');
      clear();
    }
  } else {
    createErrorData(check.message || 'Erro ao enviar dados do entregador');
  }
};
const update = async () => {
  const check = checkDataDeliveryGuy(deliveryGuyData);

  if (check.status) {
    const response = await useDeliveryGuyStore().updateDeliveryGuy(
      deliveryGuyID.value ?? 0,
      deliveryGuyData,
    );
    if (response?.status === 200) {
      emit('update:open');
      clear();
    }
  } else {
    createErrorData(check.message || 'Erro ao enviar dados do entregador');
  }
};
const clear = () => {
  Object.assign(deliveryGuyData, {
    name: '',
    cpf: '',
    email: '',
    phone: '',
    vehicle: '',
  });
};
const checkDataEdit = async () => {
  if (deliveryGuyID.value) {
    const response = await useDeliveryGuyStore().showDeliveryGuy(deliveryGuyID.value);
    if (response?.status === 200) {
      const deliverGuy = response.data.deliveryGuy;

      Object.assign(deliveryGuyData, {
        name: deliverGuy.name,
        cpf: deliverGuy.cpf ?? '',
        email: deliverGuy.email ?? '',
        phone: deliverGuy.phone ?? '',
        vehicle: deliverGuy.vehicle,
      });
    }
  }
};

const deliveryGuyID = computed(() => props.data.deliveryGuyID);
const formattedPhone = computed({
  get() {
    const phone = (deliveryGuyData.phone || '').replace(/\D/g, '');

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

    deliveryGuyData.phone = digits;
  },
});
const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  clear();
  if (open.value) {
    await checkDataEdit();
  }
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card :class="loadingDeliveryGuy ? 'bg-grey-2 form-basic column' : 'bg-grey-2 sub-page'">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="deliveryGuyID ? 'Edição do entregador' : 'Cadastro do entregador'"
          icon="moped"
        />
      </q-card-section>
      <Loading :show="loadingDeliveryGuy" v-show="loadingDeliveryGuy" />
      <q-card-section v-if="!loadingDeliveryGuy">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="deliveryGuyData.name"
            label="Nome"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="deliveryGuyData.cpf"
            label="CPF"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="badge" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="deliveryGuyData.email"
            label="Email"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="mail" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="formattedPhone"
            label="Telefone"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="call" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="deliveryGuyData.vehicle"
            label="Informações do veículo"
            bg-color="white"
            label-color="black"
            outlined
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="moped" color="black" size="20px" />
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
            :loading="loadingDeliveryGuy"
            unelevated
            no-caps
          />
          <q-btn
            v-if="!deliveryGuyID"
            color="primary"
            label="Salvar"
            size="md"
            @click="save"
            :loading="loadingDeliveryGuy"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            color="primary"
            label="Atualizar"
            size="md"
            @click="update"
            :loading="loadingDeliveryGuy"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
