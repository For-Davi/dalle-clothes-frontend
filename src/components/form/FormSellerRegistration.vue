<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { createErrorData } from 'src/composables/CreateNotify';
import { checkDataSellerRegistration } from 'src/composables/CheckData';
import { useSellerStore } from 'src/stores/DalleAdm/seller-store';
import { ref } from 'vue';

defineOptions({
  name: 'FormSellerRegistration',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingSeller } = storeToRefs(useSellerStore());

const isPwd = ref<boolean>(true);
const dataSeller = reactive({
  name: '' as string,
  phone: '' as string,
  email: '' as string,
  cpf: '' as string,
  password: '' as string,
  description: '' as string,
});

const clear = (): void => {
  Object.assign(dataSeller, {
    name: '',
    phone: '',
    email: '',
    cpf: '',
    password: '',
    description: '',
  });
};
const save = async () => {
  const check = checkDataSellerRegistration(dataSeller);
  if (check.status) {
    const response = await useSellerStore().createSellerRegistration({
      name: dataSeller.name,
      phone: dataSeller.phone,
      email: dataSeller.email,
      cpf: dataSeller.cpf,
      password: dataSeller.password,
      description: dataSeller.description.trim() === '' ? null : dataSeller.description,
    });
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    createErrorData(check.message || 'Erro ao processar dados do associado');
  }
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const formattedPhone = computed({
  get() {
    const phone = (dataSeller.phone || '').replace(/\D/g, '');

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

    dataSeller.phone = digits;
  },
});

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 column justify-between" style="width: 600px; max-width: 95vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Cadastro de associado" icon="handshake" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataSeller.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome do associado"
            dense
            input-class="text-black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSeller.email"
            bg-color="white"
            label-color="black"
            outlined
            label="E-mail do associado"
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
            label="Telefone do associado"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="phone" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSeller.cpf"
            bg-color="white"
            label-color="black"
            outlined
            label="CPF do associado"
            dense
            input-class="text-black"
            maxlength="11"
          >
            <template v-slot:prepend>
              <q-icon name="badge" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataSeller.password"
            bg-color="white"
            label-color="black"
            outlined
            label="Senha do associado"
            dense
            input-class="text-black"
            :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="black" size="20px" />
            </template>
            <template v-slot:append>
              <q-icon
                @click="isPwd = !isPwd"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                size="20px"
              />
            </template>
          </q-input>
          <q-input
            v-model="dataSeller.description"
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
      <q-card-actions align="right" v-show="!loadingSeller">
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
            label="Solicitar"
            size="md"
            :loading="loadingSeller"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
